---
title : "9. Component - Environment"
description: ""
sidebar_position: 9
contributors: ["Jongseob Jeon"]
---


## Component Environment

앞서  [8. Component - InputPath/OutputPath](../kubeflow/advanced-component.md)에서 작성한 파이프라인을 실행하면 실패하게 됩니다. 왜 실패하는지 알아보고 정상적으로 실행될 수 있도록 수정합니다.

### Convert to Kubeflow Format

[앞에서 작성한 컴포넌트](../kubeflow/advanced-component.md#convert-to-kubeflow-format)를 yaml파일로 변환하도록 하겠습니다.

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

위의 스크립트를 실행하면 다음과 같은 `train_from_csv.yaml` 파일을 얻을 수 있습니다.

```bash
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

앞서 [Basic Usage Component](../kubeflow/basic-component.md#convert-to-kubeflow-format)에서 설명한 내용에 따르면 이 컴포넌트는 다음과 같이 실행됩니다.

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

```bash
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

```dockerfile
FROM python:3.7

RUN pip install dill pandas scikit-learn
```

위의 Dockerfile을 이용해 이미지를 빌드해 보겠습니다. 실습에서 사용해볼 도커 허브는 ghcr입니다.  
각자 환경에 맞추어서 도커 허브를 선택 후 업로드하면 됩니다.

```bash
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

```bash
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

```bash
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

```bash
    command:
    - sh
    - -c
    - (PIP_DISABLE_PIP_VERSION_CHECK=1 python3 -m pip install --quiet --no-warn-script-location
      'dill==0.3.4' 'pandas==1.3.4' 'scikit-learn==1.0.1' || PIP_DISABLE_PIP_VERSION_CHECK=1
      python3 -m pip install --quiet --no-warn-script-location 'dill==0.3.4' 'pandas==1.3.4'
      'scikit-learn==1.0.1' --user) && "$0" "$@"
```
