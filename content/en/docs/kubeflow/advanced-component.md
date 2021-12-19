---
title : "8. Component - Environment"
description: ""
lead: ""
draft: false
weight: 321
contributors: ["Jongseob Jeon"]
menu:
  docs:
    parent: "kubeflow"
---


## Component Environment

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

Kubeflow에서는 이를 해결하기 위해 json-serializable 하지 않은 타입의 객체는 메모리 대신 파일에 데이터를 저장한 뒤, 그 파일을 이용해 정보를 전달합니다. 저장된 파일의 경로는 str이기 때문에 컴포넌트 간에 전달할 수 있기 때문입니다. 그런데 kubeflow에서는 minio를 이용해 파일을 저장하는데 유저는 실행을 하기 전에는 각 파일의 경로를 알 수 없습니다. 이를 위해서 kubeflow에서는 입력롸 출력의 경로와 관련된 매직을 제공하는데 바로 `InputPath`와 `OutputPath` 입니다.

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
만약 파일 포맷이 고정되지 않는다면 입력하지 않으면 됩니다 (type hint 에서 `Any` 와 같은 역할을 합니다).

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


if __name__ == "__main__":
    train_from_csv.component_spec.save("train_from_csv.yaml")
```

이번에 알아볼 것은 다음으로 컴포넌트가 어떻게 컴포넌트 콘텐츠를 실행하는지 알아보겠습니다.
위의 스크립트를 실행하면 다음과 같은 `train_from_csv.yaml` 파일을 얻을 수 있습니다.

```text
name: Train from csv
inputs:
- {name: train_data, type: csv}
- {name: train_target, type: csv}
- {name: model, type: dill}
- {name: kernel, type: String}
implementation:
  container:
    image: python:3.7
    command:
    - sh
    - -ec
    - |
      program_path=$(mktemp)
      printf "%s" "$0" > "$program_path"
      python3 -u "$program_path" "$@"
    - |
      def train_from_csv(
          train_data_path,
          train_target_path,
          model_path,
          kernel,
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

      import argparse
      _parser = argparse.ArgumentParser(prog='Train from csv', description='')
      _parser.add_argument("--train-data", dest="train_data_path", type=str, required=True, default=argparse.SUPPRESS)
      _parser.add_argument("--train-target", dest="train_target_path", type=str, required=True, default=argparse.SUPPRESS)
      _parser.add_argument("--model", dest="model_path", type=str, required=True, default=argparse.SUPPRESS)
      _parser.add_argument("--kernel", dest="kernel", type=str, required=True, default=argparse.SUPPRESS)
      _parsed_args = vars(_parser.parse_args())

      _outputs = train_from_csv(**_parsed_args)
    args:
    - --train-data
    - {inputPath: train_data}
    - --train-target
    - {inputPath: train_target}
    - --model
    - {inputPath: model}
    - --kernel
    - {inputValue: kernel}
```

앞서 [Basic Usage Component]({{< relref "docs/kubeflow/basic-component.md#convert-to-kubeflow-format" >}})에서 설명한 내용에 따르면 이 컴포넌트는 다음과 같이 실행됩니다.

1. `docker pull python:3.7`
2. run `command`

하지만 위에서 생성된 컴포넌트를 실행하면 오류가 발생하게 됩니다.  
그 이유는 컴포넌트 래퍼가 실행되는 방식에 있습니다.  
Kubeflow는 쿠버네티스를 이용하기 때문에 컴포넌트 래퍼는 각각 독립된 컨테이너 위에서 컴포넌트 콘텐츠를 실행합니다.

자세히 보면 생성된 만든 `train_from_csv.yaml` 에서 정해진 이미지는  `image: python:3.7` 입니다.

이제 어떤 이유 때문에 실행이 안 되는지 눈치채신 분들도 있을 것입니다.

`python:3.7` 이미지에는 우리가 사용하고자 하는 `dill`, `pandas`, `sklearn` 이 설치되어 있지 않습니다.  
그러므로 실행할 때 해당 패키지가 존재하지 않는다는 에러와 함께 실행이 안 됩니다.

그럼 어떻게 패키지를 추가할 수 있을까요?

## 패키지 추가 방법

Kubeflow를 변환하는 과정에서 두 가지 방법을 통해 패키지를 추가할 수 있습니다.

1. `base_image` 사용
2. `package_to_install` 사용

컴포넌트를 컴파일할 때 사용했던 함수 `create_component_from_func` 가 어떤 argument들을 받을 수 있는지 확인해 보겠습니다.

```text
def create_component_from_func(
    func: Callable,
    output_component_file: Optional[str] = None,
    base_image: Optional[str] = None,
    packages_to_install: List[str] = None,
    annotations: Optional[Mapping[str, str]] = None,
):
```

- `func`: 컴포넌트로 만들 컴포넌트 래퍼 함수
- `base_image`: 컴포넌트 래퍼가 실행할 이미지
- `packages_to_install`: 컴포넌트에서 사용해서 추가로 설치해야 하는 패키지

### 1. base_image

컴포넌트가 실행되는 순서를 좀 더 자세히 들여다보면 다음과 같습니다.

1. `docker pull base_image`
2. `pip install packages_to_install`
3. run `command`

만약 컴포넌트가 사용하는 base_image에 패키지들이 전부 설치되어 있다면 추가적인 패키지 설치 없이 바로 사용할 수 있습니다.

예를 들어, 이번 페이지에서는 다음과 같은 Dockerfile을 작성하겠습니다.

```docker
BASE_IMAGE=python:3.7

RUN pip install dill pandas scikit-learn
```

위의 Dockerfile을 이용해 이미지를 빌드해 보겠습니다. 실습에서 사용해볼 도커 허브는 ghcr입니다.  
각자 환경에 맞추어서 도커 허브를 선택 후 업로드하면 됩니다.

```text
docker build . -f Dockerfile -t ghcr.io/mlops-for-all/base-image
docker push ghcr.io/mlops-for-all/base-image
```

이제 base_image를 입력해 보겠습니다.

```python
from functools import partial
from kfp.components import InputPath, OutputPath, create_component_from_func

@partial(
    create_component_from_func,
    base_image="ghcr.io/mlops-for-all/base-image:latest",
)
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

if __name__ == "__main__":
    train_from_csv.component_spec.save("train_from_csv.yaml")
```

이제 생성된 컴포넌트를 컴파일하면 다음과 같이 나옵니다.

```text
name: Train from csv
inputs:
- {name: train_data, type: csv}
- {name: train_target, type: csv}
- {name: kernel, type: String}
outputs:
- {name: model, type: dill}
implementation:
  container:
    image: ghcr.io/mlops-for-all/base-image:latest
    command:
    - sh
    - -ec
    - |
      program_path=$(mktemp)
      printf "%s" "$0" > "$program_path"
      python3 -u "$program_path" "$@"
    - |
      def _make_parent_dirs_and_return_path(file_path: str):
          import os
          os.makedirs(os.path.dirname(file_path), exist_ok=True)
          return file_path

      def train_from_csv(
          train_data_path,
          train_target_path,
          model_path,
          kernel,
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

      import argparse
      _parser = argparse.ArgumentParser(prog='Train from csv', description='')
      _parser.add_argument("--train-data", dest="train_data_path", type=str, required=True, default=argparse.SUPPRESS)
      _parser.add_argument("--train-target", dest="train_target_path", type=str, required=True, default=argparse.SUPPRESS)
      _parser.add_argument("--kernel", dest="kernel", type=str, required=True, default=argparse.SUPPRESS)
      _parser.add_argument("--model", dest="model_path", type=_make_parent_dirs_and_return_path, required=True, default=argparse.SUPPRESS)
      _parsed_args = vars(_parser.parse_args())

      _outputs = train_from_csv(**_parsed_args)
    args:
    - --train-data
    - {inputPath: train_data}
    - --train-target
    - {inputPath: train_target}
    - --kernel
    - {inputValue: kernel}
    - --model
    - {outputPath: model}
```

base_image가 우리가 설정한 값으로 바뀐 것을 확인할 수 있습니다.

### 2. packages_to_install

하지만 패키지가 추가될 때마다 docker 이미지를 계속해서 새로 생성하는 작업은 많은 시간이 소요됩니다.
이 때, `packages_to_install` argument 를 사용하면 패키지를 컨테이너에 쉽게 추가할 수 있습니다.

```python
from functools import partial
from kfp.components import InputPath, OutputPath, create_component_from_func

@partial(
    create_component_from_func,
    packages_to_install=["dill==0.3.4", "pandas==1.3.4", "scikit-learn==1.0.1"],
)
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

if __name__ == "__main__":
    train_from_csv.component_spec.save("train_from_csv.yaml")
```

스크립트를 실행하면 다음과 같은 `train_from_csv.yaml` 파일이 생성됩니다.

```text
name: Train from csv
inputs:
- {name: train_data, type: csv}
- {name: train_target, type: csv}
- {name: kernel, type: String}
outputs:
- {name: model, type: dill}
implementation:
  container:
    image: python:3.7
    command:
    - sh
    - -c
    - (PIP_DISABLE_PIP_VERSION_CHECK=1 python3 -m pip install --quiet --no-warn-script-location
      'dill==0.3.4' 'pandas==1.3.4' 'scikit-learn==1.0.1' || PIP_DISABLE_PIP_VERSION_CHECK=1
      python3 -m pip install --quiet --no-warn-script-location 'dill==0.3.4' 'pandas==1.3.4'
      'scikit-learn==1.0.1' --user) && "$0" "$@"
    - sh
    - -ec
    - |
      program_path=$(mktemp)
      printf "%s" "$0" > "$program_path"
      python3 -u "$program_path" "$@"
    - |
      def _make_parent_dirs_and_return_path(file_path: str):
          import os
          os.makedirs(os.path.dirname(file_path), exist_ok=True)
          return file_path

      def train_from_csv(
          train_data_path,
          train_target_path,
          model_path,
          kernel,
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

      import argparse
      _parser = argparse.ArgumentParser(prog='Train from csv', description='')
      _parser.add_argument("--train-data", dest="train_data_path", type=str, required=True, default=argparse.SUPPRESS)
      _parser.add_argument("--train-target", dest="train_target_path", type=str, required=True, default=argparse.SUPPRESS)
      _parser.add_argument("--kernel", dest="kernel", type=str, required=True, default=argparse.SUPPRESS)
      _parser.add_argument("--model", dest="model_path", type=_make_parent_dirs_and_return_path, required=True, default=argparse.SUPPRESS)
      _parsed_args = vars(_parser.parse_args())

      _outputs = train_from_csv(**_parsed_args)
    args:
    - --train-data
    - {inputPath: train_data}
    - --train-target
    - {inputPath: train_target}
    - --kernel
    - {inputValue: kernel}
    - --model
    - {outputPath: model}
```

위에 작성한 컴포넌트가 실행되는 순서를 좀 더 자세히 들여다보면 다음과 같습니다.

1. `docker pull python:3.7`
2. `pip install dill==0.3.4 pandas==1.3.4 scikit-learn==1.0.1`
3. run `command`

생성된 yaml 파일을 자세히 보면, 다음과 같은 줄이 자동으로 추가되어 필요한 패키지가 설치되기 때문에 오류 없이 정상적으로 실행됩니다.

```text
    command:
    - sh
    - -c
    - (PIP_DISABLE_PIP_VERSION_CHECK=1 python3 -m pip install --quiet --no-warn-script-location
      'dill==0.3.4' 'pandas==1.3.4' 'scikit-learn==1.0.1' || PIP_DISABLE_PIP_VERSION_CHECK=1
      python3 -m pip install --quiet --no-warn-script-location 'dill==0.3.4' 'pandas==1.3.4'
      'scikit-learn==1.0.1' --user) && "$0" "$@"
```
