---
title : "9. Component - Environment"
description: ""
sidebar_position: 9
contributors: ["Jongseob Jeon"]
---

## Component Environment

When we run the pipeline written in [8. Component - InputPath/OutputPath](../kubeflow/advanced-component.md), it fails. Let's find out why it fails and modify it so that it can run properly. 

### Convert to Kubeflow Format

Let's convert the component written [earlier](../kubeflow/advanced-component.md#convert-to-kubeflow-format) into a yaml file.

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

If you run the script above, you will get a `train_from_csv.yaml` file like the one below.

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

According to the content explained in the [Basic Usage Component](../kubeflow/basic-component.md#convert-to-kubeflow-format) previously mentioned, this component will be executed as follows:

1. `docker pull python:3.7`
2. run `command`

However, when running the component created above, an error will occur.  
The reason is in the way the component wrapper is executed.  
Kubeflow uses Kubernetes, so the component wrapper runs the component content on its own separate container.

In detail, the image specified in the generated `train_from_csv.yaml` is `image: python:3.7`.

There may be some people who notice why it is not running for some reason.

The `python:3.7` image does not have the packages we want to use, such as `dill`, `pandas`, and `sklearn`, installed.  
Therefore, when executing, it fails with an error indicating that the packages are not found.

So, how can we add the packages?

## Adding packages

During the process of converting Kubeflow, there are two ways to add packages:

1. Using `base_image`
2. Using `package_to_install`

Let's check what arguments the function `create_component_from_func` used to compile the components can receive.

```text
def create_component_from_func(
    func: Callable,
    output_component_file: Optional[str] = None,
    base_image: Optional[str] = None,
    packages_to_install: List[str] = None,
    annotations: Optional[Mapping[str, str]] = None,
):
```

- `func`: Function that creates the component wrapper to be made into a component.
- `base_image`: Image that the component wrapper will run on.
- `packages_to_install`: Additional packages that need to be installed for the component to use.

### 1. base_image

Take a closer look at the sequence in which the component is executed and it will be as follows:

1. `docker pull base_image`
2. `pip install packages_to_install`
3. run `command`

If the base_image used by the component already has all the packages installed, you can use it without installing additional packages.

For example, on this page we are going to write a Dockerfile like this:

```dockerfile
FROM python:3.7

RUN pip install dill pandas scikit-learn
```

Let's build the image using the Dockerfile above. The Docker hub we will use for the practice is ghcr.  
You can choose a Docker hub according to your environment and upload it.

```text
docker build . -f Dockerfile -t ghcr.io/mlops-for-all/base-image
docker push ghcr.io/mlops-for-all/base-image
```

Now let's try inputting the base image.

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

If you compile the generated component, it will appear as follows.

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

We can confirm that the base_image has been changed to the value we have set.

### 2. packages_to_install

However, when packages are added, it takes a lot of time to create a new Docker image.
In this case, we can use the `packages_to_install` argument to easily add packages to the container.
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

If you execute the script, the `train_from_csv.yaml` file will be generated.

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

If we take a closer look at the order in which the components written above are executed, it looks like this:

1. `docker pull python:3.7`
2. `pip install dill==0.3.4 pandas==1.3.4 scikit-learn==1.0.1`
3. run `command`

When the generated yaml file is closely examined, the following lines are automatically added, so that the necessary packages are installed and the program runs smoothly without errors.

```text
    command:
    - sh
    - -c
    - (PIP_DISABLE_PIP_VERSION_CHECK=1 python3 -m pip install --quiet --no-warn-script-location
      'dill==0.3.4' 'pandas==1.3.4' 'scikit-learn==1.0.1' || PIP_DISABLE_PIP_VERSION_CHECK=1
      python3 -m pip install --quiet --no-warn-script-location 'dill==0.3.4' 'pandas==1.3.4'
      'scikit-learn==1.0.1' --user) && "$0" "$@"
```
