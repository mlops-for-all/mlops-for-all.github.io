---
title : "9. MLFlow Component"
description: ""
lead: ""
draft: false
weight: 322
contributors: ["Jongseob Jeon"]
menu:
  docs:
    parent: "kubeflow"
---

[Advanced Usage Component]({{< relref "docs/kubeflow/advanced-component.md" >}}) 에서 학습한 모델을 API Deployment까지 이어지기 위해서는 MLFlow에 모델을 저장해야 합니다.

이번 페이지에서는 MLFlow에 모델을 저장할 수 있는 컴포넌트를 작성하는 과정을 설명합니다.

## MLFlow in Local

MLFlow에서 모델을 저장하고 서빙에서 사용하기 위해서는 다음의 항목들이 필요합니다.

- model
- signature
- input_example
- conda_env

간단한 스크립트를 통해서 MLFLow에 모델을 저장하는 과정에 대해서 알아보겠습니다.

### 1. 모델 학습

아래 과정은 iris 데이터를 이용해 SVC 모델을 학습하는 과정입니다.

```python
import pandas as pd
from sklearn.datasets import load_iris
from sklearn.svm import SVC

iris = load_iris()

data = pd.DataFrame(iris["data"], columns=iris["feature_names"])
target = pd.DataFrame(iris["target"], columns=["target"])

clf = SVC(kernel="rbf")
clf.fit(data, target)

```

### 2. MLFLow Infos

mlflow에 필요한 정보들을 만드는 과정입니다.

```python
from mlflow.models.signature import infer_signature
from mlflow.utils.environment import _mlflow_conda_env

input_example = data.sample(1)
signature = infer_signature(data, clf.predict(data))
conda_env = _mlflow_conda_env(additional_pip_deps=["dill", "pandas", "scikit-learn"])
```

각 변수들의 내용을 확인하면 다음과 같습니다.

- `input_example`

    |  | sepal length (cm) | sepal width (cm) | petal length (cm) | petal width (cm) |
    | --- | --- | --- | --- | --- |
    | 64 | 65 | 6.7 | 3.1 | 4.4 |

- `signature`

    ```python
    inputs:
      ['sepal length (cm)': double, 'sepal width (cm)': double, 'petal length (cm)': double, 'petal width (cm)': double]
    outputs:
      [Tensor('int64', (-1,))]
    ```

- `conda_env`

    ```python
    {'name': 'mlflow-env',
     'channels': ['conda-forge'],
     'dependencies': ['python=3.8.10',
      'pip',
      {'pip': ['mlflow', 'dill', 'pandas', 'scikit-learn']}]}
    ```

### 3. Save MLFLow Infos

다음으로 학습한 정보들과 모델을 저장합니다.
학습한 모델이 sklearn 패키지를 이용하기 때문에 `mlflow.sklearn` 을 이용하면 쉽게 모델을 저장할 수 있습니다.

```python
from mlflow.sklearn import save_model

save_model(
    sk_model=clf,
    path="svc",
    serialization_format="cloudpickle",
    conda_env=conda_env,
    signature=signature,
    input_example=input_example,
)
```

로컬에서 작업할 경우 다음과 같은 svc 폴더가 생기며 아래와 같은 파일들이 생성됩니다.

```bash
ls svc
```

위의 명령어를 실행할 경우 다음의 출력값을 확인할 수 있습니다.

```bash
MLmodel            conda.yaml         input_example.json model.pkl          requirements.txt
```

각 파일들을 확인하면 다음과 같습니다.

- MLmodel

    ```bash
    flavors:
      python_function:
        env: conda.yaml
        loader_module: mlflow.sklearn
        model_path: model.pkl
        python_version: 3.8.10
      sklearn:
        pickled_model: model.pkl
        serialization_format: cloudpickle
        sklearn_version: 1.0.1
    saved_input_example_info:
      artifact_path: input_example.json
      pandas_orient: split
      type: dataframe
    signature:
      inputs: '[{"name": "sepal length (cm)", "type": "double"}, {"name": "sepal width
        (cm)", "type": "double"}, {"name": "petal length (cm)", "type": "double"}, {"name":
        "petal width (cm)", "type": "double"}]'
      outputs: '[{"type": "tensor", "tensor-spec": {"dtype": "int64", "shape": [-1]}}]'
    utc_time_created: '2021-12-06 06:52:30.612810'
    ```

- conda.yaml

    ```yaml
    channels:
    - conda-forge
    dependencies:
    - python=3.8.10
    - pip
    - pip:
      - mlflow
      - dill
      - pandas
      - scikit-learn
    name: mlflow-env
    ```

- input_example.json

    ```json
    {"columns": ["sepal length (cm)", "sepal width (cm)", "petal length (cm)", "petal width (cm)"], "data": [[6.7, 3.1, 4.4, 1.4]]}
    ```

- requirements.txt

    ```bash
    mlflow
    dill
    pandas
    scikit-learn
    ```

- model.pkl

## MLFlow on Server

이제 저장된 모델을 mlflow 서버에 올리는 작업을 해보겠습니다.

```python
import mlflow

with mlflow.start_run():
    mlflow.log_artifact("svc/")
```

저장을 하고 `mlruns` 가 생성된 경로에서 `mlflow ui` 명령어를 이용해 mlflow 대쉬보드를 띄웁니다.
그리고 생성된 run을 클릭하면 다음과 같이 보입니다.

<p align="center">
    <img src="/images/docs/kubeflow/mlflow-0.png" title="mlflow-dashboard"/>
</p>
(해당 화면은 mlflow 버전에 따라 상이할 수 있습니다.)

## MLFlow Component

이제 Kubeflow에서 재사용할 수 있는 컴포넌트를 작성해 보겠습니다.

재사용할 수 있는 컴포넌트를 작성하기 위한 방법은 크게 3가지가 있습니다.

1. 모델을 학습하는 컴포넌트에서 필요한 환경을 저장 후 MLFlow 컴포넌트는 업로드만 담당
2. 학습된 모델과 데이터를 MLFlow 컴포넌트에 전달 후 컴포넌트에서 저장과 업로드 담당
3. 모델을 학습하는 컴포넌트에서 저장과 업로드를 담당

저희는 이 중 1번의 접근 방법을 통해 모델을 관리하려고 합니다.
이유는 MLFlow 모델을 업로드하는 코드는 바뀌지 않기 때문에 매번 3번 처럼 컴포넌트 작성마다 작성할 필요는 없기 때문입니다.

컴포넌트를 재활용하는 방법은 1번과 2번의 방법으로 가능합니다.
다만 2번의 경우 모델이 학습된 이미지와 패키지들을 전달해야 하기 때문에 결국 컴포넌트에 대한 추가 정보를 전달해야 합니다.

1번의 방법으로 진행하기 위해서는 학습하는 컴포넌트 또한 변경이 되어야 합니다.
모델을 저장하는데 필요한 환경들을 저장해주는 코드가 추가되어야 합니다.

```python
from functools import partial
from kfp.components import InputPath, OutputPath, create_component_from_func

@partial(
    create_component_from_func,
    packages_to_install=["dill", "pandas", "scikit-learn", "mlflow"],
)
def train_from_csv(
    train_data_path: InputPath("csv"),
    train_target_path: InputPath("csv"),
    model_path: OutputPath("dill"),
    input_example_path: OutputPath("dill"),
    signature_path: OutputPath("dill"),
    conda_env_path: OutputPath("dill"),
    kernel: str,
):
    import dill
    import pandas as pd
    from sklearn.svm import SVC

    from mlflow.models.signature import infer_signature
    from mlflow.utils.environment import _mlflow_conda_env

    train_data = pd.read_csv(train_data_path)
    train_target = pd.read_csv(train_target_path)

    clf = SVC(kernel=kernel)
    clf.fit(train_data, train_target)

    with open(model_path, mode="wb") as file_writer:
        dill.dump(clf, file_writer)

    input_example = train_data.sample(1)
    with open(input_example_path, "wb") as file_writer:
        dill.dump(input_example, file_writer)

    signature = infer_signature(train_data, clf.predict(train_data))
    with open(signature_path, "wb") as file_writer:
        dill.dump(signature, file_writer)

    conda_env = _mlflow_conda_env(
        additional_pip_deps=["dill", "pandas", "scikit-learn"]
    )
    with open(conda_env_path, "wb") as file_writer:
        dill.dump(conda_env, file_writer)

```

그리고 MLFlow에 업로드하는 컴포넌트를 작성합니다.

```python
from functools import partial
from kfp.components import InputPath, create_component_from_func

@partial(
    create_component_from_func,
    packages_to_install=["dill", "pandas", "scikit-learn", "mlflow"],
)
def upload_sklearn_model_to_mlflow(
    model_name: str,
    model_path: InputPath("dill"),
    input_example_path: InputPath("dill"),
    signature_path: InputPath("dill"),
    conda_env_path: InputPath("dill"),
):
    import dill
    import mlflow
    from mlflow.sklearn import save_model

    with open(model_path, mode="rb") as file_reader:
        clf = dill.load(file_reader)

    with open(input_example_path, "rb") as file_reader:
        input_example = dill.load(file_reader)

    with open(signature_path, "rb") as file_reader:
        signature = dill.load(file_reader)

    with open(conda_env_path, "rb") as file_reader:
        conda_env = dill.load(file_reader)
    save_model(
        sk_model=clf,
        path=model_name,
        serialization_format="cloudpickle",
        conda_env=conda_env,
        signature=signature,
        input_example=input_example,
    )
    with mlflow.start_run():
        mlflow.log_artifact(model_name)
```

## MLFlow Pipeline

이제 작성한 컴포넌트들을 연결해서 파이프라인으로 만들어 보겠습니다.

### Data Component

모델을 학습할 때 쓸 데이터는 sklearn의 iris 입니다.
데이터를 생성하는 컴포넌트를 작성합니다.

```python
from functools import partial

from kfp.components import InputPath, OutputPath, create_component_from_func


@partial(
    create_component_from_func,
    packages_to_install=["pandas", "scikit-learn"],
)
def load_iris_data(
    data_path: OutputPath("csv"),
    target_path: OutputPath("csv"),
):
    import pandas as pd
    from sklearn.datasets import load_iris

    iris = load_iris()

    data = pd.DataFrame(iris["data"], columns=iris["feature_names"])
    target = pd.DataFrame(iris["target"], columns=["target"])

    data.to_csv(data_path)
    target.to_csv(target_path)

```

### Pipeline

파이프라인 코드는 다음과 같이 작성할 수 있습니다.

```python
from kfp.dsl import pipeline


@pipeline(name="mlflow_pipeline")
def mlflow_pipeline(kernel: str, model_name: str):
    iris_data = load_iris_data()
    model = train_from_csv(
        train_data=iris_data.outputs["data"],
        train_target=iris_data.outputs["target"],
        kernel=kernel,
    )
    _ = upload_sklearn_model_to_mlflow(
        model_name=model_name,
        model=model.outputs["model"],
        input_example=model.outputs["input_example"],
        signature=model.outputs["signature"],
        conda_env=model.outputs["conda_env"],
    )
```

한 가지 이상한 점을 확인하셨나요?
바로 입력과 출력에서 받는 argument중 경로와 관련된 것들에 `_path` 접미사가 모두 사라졌습니다.
이는 kubeflow에서 정한 법칙으로 `InputPath` 와 `OutputPath` 로 생성된 경로들은 파이프라인에서 작성될 때 접미사가 없어집니다.
