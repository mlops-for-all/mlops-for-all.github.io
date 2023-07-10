---
title : "4. Component - Write"
description: ""
sidebar_position: 4
contributors: ["Jongseob Jeon"]
---


## Component

In order to write a component, the following must be written: 

1. Writing Component Contents 
2. Writing Component Wrapper 

Now, let's look at each process.

## Component Contents

Component Contents are no different from the Python code we commonly write.  
For example, let's try writing a component that takes a number as input, prints it, and then returns it. 
 We can write it in Python code like this.

```python
print(number)
```

However, when this code is run, an error occurs and it does not work because the `number` that should be printed is not defined. 

As we saw in [Kubeflow Concepts](../kubeflow/kubeflow-concepts.md), values like `number` that are required in component content are defined in **Config**. In order to execute component content, the necessary Configs must be passed from the component wrapper.

## Component Wrapper

### Define a standalone Python function

Now we need to create a component wrapper to be able to pass the required Configs.

Without a separate Config, it will be like this when wrapped with a component wrapper.

```python
def print_and_return_number():
    print(number)
    return number
```

Now we add the required Config for the content as an argument to the wrapper. However, it is not just writing the argument but also writing the type hint of the argument. When Kubeflow converts the pipeline into the Kubeflow format, it checks if the specified input and output types are matched in the connection between the components. If the format of the input required by the component does not match the output received from another component, the pipeline cannot be created.

Now we complete the component wrapper by writing down the argument, its type and the type to be returned as follows.

```python
def print_and_return_number(number: int) -> int:
    print(number)
    return number
```

In Kubeflow, you can only use types that can be expressed in json as return values. The most commonly used and recommended types are as follows:

- int
- float
- str

If you want to return multiple values instead of a single value, you must use `collections.namedtuple`.  
For more details, please refer to the Kubeflow official documentation [Kubeflow Official Documentation](https://www.kubeflow.org/docs/components/pipelines/sdk/python-function-components/#passing-parameters-by-value).  
For example, if you want to write a component that returns the quotient and remainder of a number when divided by 2, it should be written as follows.

```python
from typing import NamedTuple


def divide_and_return_number(
    number: int,
) -> NamedTuple("DivideOutputs", [("quotient", int), ("remainder", int)]):
    from collections import namedtuple

    quotient, remainder = divmod(number, 2)
    print("quotient is", quotient)
    print("remainder is", remainder)

    divide_outputs = namedtuple(
        "DivideOutputs",
        [
            "quotient",
            "remainder",
        ],
    )
    return divide_outputs(quotient, remainder)
```

### Convert to Kubeflow Format

Now you have to convert the written component into a format that can be used in Kubeflow. The conversion can be done through `kfp.components.create_component_from_func`. This converted form can be imported as a function in Python and used in the pipeline.

```python
from kfp.components import create_component_from_func

@create_component_from_func
def print_and_return_number(number: int) -> int:
    print(number)
    return number
```

### Share component with yaml file

If it is not possible to share with Python code, you can share components with a YAML file and use them.
To do this, first convert the component to a YAML file and then use it in the pipeline with `kfp.components.load_component_from_file`.

First, let's explain the process of converting the written component to a YAML file.

```python
from kfp.components import create_component_from_func

@create_component_from_func
def print_and_return_number(number: int) -> int:
    print(number)
    return number

if __name__ == "__main__":
    print_and_return_number.component_spec.save("print_and_return_number.yaml")
```

If you run the Python code you wrote, a file called `print_and_return_number.yaml` will be created. When you check the file, it will be as follows.

```bash
name: Print and return number
inputs:
- {name: number, type: Integer}
outputs:
- {name: Output, type: Integer}
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
      def print_and_return_number(number):
          print(number)
          return number

      def _serialize_int(int_value: int) -> str:
          if isinstance(int_value, str):
              return int_value
          if not isinstance(int_value, int):
              raise TypeError('Value "{}" has type "{}" instead of int.'.format(str(int_value), str(type(int_value))))
          return str(int_value)

      import argparse
      _parser = argparse.ArgumentParser(prog='Print and return number', description='')
      _parser.add_argument("--number", dest="number", type=int, required=True, default=argparse.SUPPRESS)
      _parser.add_argument("----output-paths", dest="_output_paths", type=str, nargs=1)
      _parsed_args = vars(_parser.parse_args())
      _output_files = _parsed_args.pop("_output_paths", [])

      _outputs = print_and_return_number(**_parsed_args)

      _outputs = [_outputs]

      _output_serializers = [
          _serialize_int,

      ]

      import os
      for idx, output_file in enumerate(_output_files):
          try:
              os.makedirs(os.path.dirname(output_file))
          except OSError:
              pass
          with open(output_file, 'w') as f:
              f.write(_output_serializers[idx](_outputs[idx]))
    args:
    - --number
    - {inputValue: number}
    - '----output-paths'
    - {outputPath: Output}
```

Now the generated file can be shared and used in the pipeline as follows.

```python
from kfp.components import load_component_from_file

print_and_return_number = load_component_from_file("print_and_return_number.yaml")
```

## How Kubeflow executes component

In Kubeflow, the execution order of components is as follows:

1. `docker pull <image>`: Pull the image containing the execution environment information of the defined component.
2. Run `command`: Execute the component's content within the pulled image.

Taking `print_and_return_number.yaml` as an example, the default image in `@create_component_from_func` is `python:3.7`, so the component's content will be executed based on that image.

1. `docker pull python:3.7`
2. `print(number)`

## References:
- [Getting Started With Python function based components](https://www.kubeflow.org/docs/components/pipelines/sdk/python-function-components/#getting-started-with-python-function-based-components)
