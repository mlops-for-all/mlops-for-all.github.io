---
title : "8. Component - InputPath/OutputPath"
description: ""
lead: ""
draft: false
weight: 321
contributors: ["Jongseob Jeon", "SeungTae Kim"]
menu:
  docs:
    parent: "kubeflow"
---


## Complex Outputs

이번 페이지에서는 [Kubeflow Concepts]({{< relref "docs/kubeflow/kubeflow-concepts.md#component-contents" >}}) 예시로 나왔던 코드를 컴포넌트로 작성해 보겠습니다.

## Component Contents

아래 코드는 [Kubeflow Concepts]({{< relref "docs/kubeflow/kubeflow-concepts.md#component-contents" >}})에서 사용했던 컴포넌트 콘텐츠입니다.

```python
import dill
import pandas as pd

from sklearn.svm import SVC

train_data = pd.read_csv(train_data_path)
train_target = pd.read_csv(train_target_path)

clf = SVC(kernel=kernel)
clf.fit(train_data, train_target)

with open(model_path, mode="wb") as file_writer:
    dill.dump(clf, file_writer)
```

## Component Wrapper

### Define a standalone Python function

컴포넌트 래퍼에 필요한 Config들과 함께 작성하면 다음과 같이 됩니다.

```python
def train_from_csv(
    train_data_path: str,
    train_target_path: str,
    model_path: str,
    kernel: str,
):
    import dill
    import pandas as pd

    from sklearn.svm import SVC

    train_data = pd.read_csv(train_data_path)
    train_target = pd.read_csv(train_target_path)

    clf = SVC(kernel=kernel)
    clf.fit(train_data, train_target)

    with open(model_path, mode="wb") as file_writer:
        dill.dump(clf, file_writer)
```

[Basic Usage Component]({{< relref "docs/kubeflow/basic-component" >}})에서 설명할 때 입력과 출력에 대한 타입 힌트를 적어야 한다고 설명 했었습니다. 그런데 만약 json에서 사용할 수 있는 기본 타입이 아닌 dataframe, model와 같이 복잡한 객체들은 어떻게 할까요?

파이썬에서 함수간에 값을 전달할 때, 객체를 반환해도 그 값이 호스트의 메모리에 저장되어 있으므로 다음 함수에서도 같은 객체를 사용할 수 있습니다. 하지만 kubeflow에서 컴포넌트들은 각각 컨테이너 위에서 서로 독립적으로 실행됩니다. 즉, 같은 메모리를 공유하고 있지 않기 때문에, 보통의 파이썬 함수에서 사용하는 방식과 같이 객체를 전달할 수 없습니다. 컴포넌트 간에 넘겨 줄 수 있는 정보는 `json` 으로만 가능합니다. 따라서 Model이나 DataFrame과 같이 json 형식으로 변환할 수 없는 타입의 객체는 다른 방법을 통해야 합니다.

Kubeflow에서는 이를 해결하기 위해 json-serializable 하지 않은 타입의 객체는 메모리 대신 파일에 데이터를 저장한 뒤, 그 파일을 이용해 정보를 전달합니다. 저장된 파일의 경로는 str이기 때문에 컴포넌트 간에 전달할 수 있기 때문입니다. 그런데 kubeflow에서는 minio를 이용해 파일을 저장하는데 유저는 실행을 하기 전에는 각 파일의 경로를 알 수 없습니다. 이를 위해서 kubeflow에서는 입력과 출력의 경로와 관련된 매직을 제공하는데 바로 `InputPath`와 `OutputPath` 입니다.

`InputPath`는 단어 그대로 입력 경로를 `OutputPath` 는 단어 그대로 출력 경로를 의미합니다.

예를 들어서 데이터를 생성하고 반환하는 컴포넌트에서는 `data_path: OutputPath()`를 argument로 만듭니다.
그리고 데이터를 받는 컴포넌트에서는 `data_path: InputPath()`을 argument로 생성합니다.

이렇게 만든 후 파이프라인에서 서로 연결을 하면 kubeflow에서 필요한 경로를 자동으로 생성후 입력해 주기 때문에 더 이상 유저는 경로를 신경쓰지 않고 컴포넌트간의 관계만 신경쓰면 됩니다.

이제 이 내용을 바탕으로 다시 컴포넌트 래퍼를 작성하면 다음과 같이 됩니다.

```python
from kfp.components import InputPath, OutputPath

def train_from_csv(
    train_data_path: InputPath("csv"),
    train_target_path: InputPath("csv"),
    model_path: OutputPath("dill"),
    kernel: str,
):
    import dill
    import pandas as pd

    from sklearn.svm import SVC

    train_data = pd.read_csv(train_data_path)
    train_target = pd.read_csv(train_target_path)

    clf = SVC(kernel=kernel)
    clf.fit(train_data, train_target)

    with open(model_path, mode="wb") as file_writer:
        dill.dump(clf, file_writer)
```

InputPath나 OutputPath는 string을 입력할 수 있습니다. 이 string은 입력 또는 출력하려고 하는 파일의 포맷입니다.  
그렇다고 꼭 이 포맷으로 파일 형태로 저장이 강제되는 것은 아닙니다.  
다만 파이프라인을 컴파일할 때 최소한의 타입 체크를 위한 도우미 역할을 합니다.  
만약 파일 포맷이 고정되지 않는다면 입력하지 않으면 됩니다 (타입 힌트 에서 `Any` 와 같은 역할을 합니다).

### Convert to Kubeflow Format

작성한 컴포넌트를 kubeflow에서 사용할 수 있는 포맷으로 변환합니다.

```python
from kfp.components import InputPath, OutputPath, create_component_from_func


@create_component_from_func
def train_from_csv(
    train_data_path: InputPath("csv"),
    train_target_path: InputPath("csv"),
    model_path: OutputPath("dill"),
    kernel: str,
):
    import dill
    import pandas as pd

    from sklearn.svm import SVC

    train_data = pd.read_csv(train_data_path)
    train_target = pd.read_csv(train_target_path)

    clf = SVC(kernel=kernel)
    clf.fit(train_data, train_target)

    with open(model_path, mode="wb") as file_writer:
        dill.dump(clf, file_writer)
```

## Rule to use InputPath/OutputPath

InputPath나 OutputPath argument는 파이프라인으로 작성할 때 지켜야하는 규칙이 있습니다.

### Load Data Component

위에서 작성한 컴포넌트를 실행하기 위해서는 데이터가 필요하므로 데이터를 생성하는 컴포넌트를 작성합니다.

```python
from functools import partial

from kfp.components import InputPath, OutputPath, create_component_from_func


@create_component_from_func
def load_iris_data(
    data_path: OutputPath("csv"),
    target_path: OutputPath("csv"),
):
    import pandas as pd
    from sklearn.datasets import load_iris

    iris = load_iris()

    data = pd.DataFrame(iris["data"], columns=iris["feature_names"])
    target = pd.DataFrame(iris["target"], columns=["target"])

    data.to_csv(data_path, index=False)
    target.to_csv(target_path, index=False)
```

### Write Pipeline

이제 파이프라인을 작성해 보도록 하겠습니다.

```python
from kfp.dsl import pipeline


@pipeline(name="complex_pipeline")
def complex_pipeline(kernel: str):
    iris_data = load_iris_data()
    model = train_from_csv(
        train_data=iris_data.outputs["data"],
        train_target=iris_data.outputs["target"],
        kernel=kernel,
    )
```

한 가지 이상한 점을 확인하셨나요?  
바로 입력과 출력에서 받는 argument중 경로와 관련된 것들에 `_path` 접미사가 모두 사라졌습니다.  
`iris_data.outputs["data_path"]` 가 아닌 `iris_data.outputs["data"]` 으로 접근하는 것을 확인할 수 있습니다.  
이는 kubeflow에서 정한 법칙으로 `InputPath` 와 `OutputPath` 으로 생성된 경로들은 파이프라인에서 접근할 때는 `_path` 접미사를 생략하여 접근합니다.

다만 방금 작성한 파이프라인을 업로드할 경우 실행이 되지 않습니다.
이유는 다음 페이지에서 설명합니다.
