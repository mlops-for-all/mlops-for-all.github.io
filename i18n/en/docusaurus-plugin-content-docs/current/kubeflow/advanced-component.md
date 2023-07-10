---
title : "8. Component - InputPath/OutputPath"
description: ""
sidebar_position: 8
contributors: ["Jongseob Jeon", "SeungTae Kim"]
---

## Complex Outputs

On this page, we will write the code example from [Kubeflow Concepts](../kubeflow/kubeflow-concepts.md#component-contents) as a component.

## Component Contents

Below is the component content used in [Kubeflow Concepts](../kubeflow/kubeflow-concepts.md#component-contents).

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

With the necessary Configs for the Component Wrapper, it will look like this.

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

In the [Basic Usage Component]](../kubeflow/basic-component), we explained that you should provide type hints for input and output when describing. But what about complex objects such as dataframes, models, that cannot be used in json?

When passing values between functions in Python, objects can be returned and their value will be stored in the host's memory, so the same object can be used in the next function. However, in Kubeflow, components are running independently on each container, that is, they are not sharing the same memory, so you cannot pass objects in the same way as in a normal Python function. The only information that can be passed between components is in `json` format. Therefore, objects of types that cannot be converted into json format such as Model or DataFrame must be passed in some other way.

Kubeflow solves this by storing the data in a file instead of memory, and then using the file to pass information. Since the path of the stored file is a string, it can be passed between components. However, in Kubeflow, the user does not know the path of the file before the execution. For this, Kubeflow provides a magic related to the input and output paths, `InputPath` and `OutputPath`.

`InputPath` literally means the input path, and `OutputPath` literally means the output path.

For example, in a component that generates and returns data, `data_path: OutputPath()` is created as an argument. And in a component that receives data, `data_path: InputPath()` is created as an argument.

Once these are created, when connecting them in a pipeline, Kubeflow automatically generates and inputs the necessary paths. Therefore, users no longer need to worry about the paths and only need to consider the relationships between components.

Based on this information, when rewriting the component wrapper, it would look like the following.

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

InputPath or OutputPath can accept a string. This string is the format of the file to be input or output.  
However, it does not necessarily mean that the file has to be stored in this format.  
It just serves as a helper for type checking when compiling the pipeline.  
If the file format is not fixed, then no input is needed (it serves the role of something like `Any` in type hints).

### Convert to Kubeflow Format

Convert the written component into a format that can be used in Kubeflow.

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

## Rule for using InputPath/OutputPath

There are rules to follow when using InputPath or OutputPath arguments in pipeline.

### Load Data Component

To execute the previously written component, a component that generates data is created since data is required.

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

Now let's write the pipeline.

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

Have you noticed something strange?  
All the `_path` suffixes have disappeared from the arguments received in the input and output.  
We can see that instead of accessing `iris_data.outputs["data_path"]`, we are accessing `iris_data.outputs["data"]`.  
This happens because Kubeflow has a rule that paths created with `InputPath` and `OutputPath` can be accessed without the `_path` suffix when accessed from the pipeline.

However, if you upload the pipeline just written, it will not run.  
The reason is explained on the next page.
