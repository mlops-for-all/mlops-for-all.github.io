---
title : "4. Component - Write"
description: ""
lead: ""
draft: false
weight: 312
contributors: ["Jongseob Jeon"]
menu:
  docs:
    parent: "kubeflow"
---


## Component

컴포넌트(Component)를 작성하기 위해서는 다음과 같은 내용들을 작성해야 합니다.

1. 컴포넌트 콘텐츠(Component Contents) 작성
2. 컴포넌트 래퍼(Component Wrapper) 작성

이제 각 과정에 대해서 알아보도록 하겠습니다.

## Component Contents

컴포넌트 콘텐츠는 우리가 흔히 작성하는 파이썬 코드와 다르지 않습니다.  
예를 들어서 숫자를 입력으로 받고 입력받은 숫자를 출력한 뒤 반환하는 컴포넌트를 작성해 보겠습니다.  
파이썬 코드로 작성하면 다음과 같이 작성할 수 있습니다.

```python
print(number)
```

그런데 이 코드를 실행하면 에러가 나고 동작하지 않는데 그 이유는 출력해야 할 `number`가 정의되어 있지 않기 때문입니다.

[Kubeflow Concepts]({{< relref "docs/kubeflow/kubeflow-concepts.md" >}})에서 `number` 와 같이 컴포넌트 콘텐츠에서 필요한 값들은 **Config**로 정의한다고 했습니다. 컴포넌트 콘텐츠를 실행시키기 위해 필요한 Config들은 컴포넌트 래퍼에서 전달이 되어야 합니다.

## Component Wrapper

### Define a standalone Python function

이제 필요한 Config를 전달할 수 있도록 컴포넌트 래퍼를 만들어야 합니다.

별도의 Config 없이 컴포넌트 래퍼로 감쌀 경우 다음과 같이 됩니다.

```python
def print_and_return_number():
    print(number)
    return number
```

이제 콘텐츠에서 필요한 Config를 래퍼의 argument로 추가합니다. 다만, argument 만을 적는 것이 아니라 argument의 타입 힌트도 작성해야 합니다. Kubeflow에서는 파이프라인을 Kubeflow 포맷으로 변환할 때, 컴포넌트간의 연결에서 정해진 입력과 출력의 타입이 일치하는지 체크합니다. 만약 컴포넌트가 필요로 하는 입력과 다른 컴포넌트로 부터 전달받은 출력의 포맷이 일치하지 않을 경우 파이프라인 생성을 할 수 없습니다.

이제 다음과 같이 argument와 그 타입, 그리고 반환하는 타입을 적어서 컴포넌트 래퍼를 완성합니다.

```python
def print_and_return_number(number: int) -> int:
    print(number)
    return number
```

Kubeflow에서 반환 값으로 사용할 수 있는 타입은 json에서 표현할 수 있는 타입들만 사용할 수 있습니다. 대표적으로 사용되며 권장하는 타입들은 다음과 같습니다.

- int
- float
- str

만약 단일 값이 아닌 여러 값을 반환하려면 `collections.namedtuple` 을 이용해야 합니다.  
자세한 내용은 [Kubeflow 공식 문서](https://www.kubeflow.org/docs/components/pipelines/sdk/python-function-components/#passing-parameters-by-value)를 참고 하시길 바랍니다.  
예를 들어서 입력받은 숫자를 2로 나눈 몫과 나머지를 반환하는 컴포넌트는 다음과 같이 작성해야 합니다.

```python
from typing import NamedTuple


def divde_and_return_number(
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

이제 작성한 컴포넌트를 kubeflow에서 사용할 수 있는 포맷으로 변환해야 합니다. 변환은 `kfp.components.create_component_from_func` 를 통해서 할 수 있습니다.  
이렇게 변환된 형태는 파이썬에서 함수로 import하여서 파이프라인에서 사용할 수 있습니다.

```python
from kfp.components import create_component_from_func

@create_component_from_func
def print_and_return_number(number: int) -> int:
    print(number)
    return number
```

### Share component with yaml file

만약 파이썬 코드로 공유를 할 수 없는 경우 YAML 파일로 컴포넌트를 공유해서 사용할 수 있습니다.
이를 위해서는 우선 컴포넌트를 YAML 파일로 변환한 뒤 `kfp.components.load_component_from_file` 을 통해 파이프라인에서 사용할 수 있습니다.

우선 작성한 컴포넌트를 YAML 파일로 변환하는 과정에 대해서 설명합니다.

```python
from kfp.components import create_component_from_func

@create_component_from_func
def print_and_return_number(number: int) -> int:
    print(number)
    return number

if __name__ == "__main__":
    print_and_return_number.component_spec.save("print_and_return_number.yaml")
```

작성한 파이썬 코드를 실행하면 `print_and_return_number.yaml` 파일이 생성됩니다. 파일을 확인하면 다음과 같습니다.

```text
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

이제 생성된 파일을 공유해서 파이프라인에서 다음과 같이 사용할 수 있습니다.

```python
from kfp.components import load_component_from_file

print_and_return_number = load_component_from_file("print_and_return_number.yaml")
```

## How Kubeflow executes component

Kubeflow에서 컴포넌트가 실행되는 순서는 다음과 같습니다.

1. `docker pull <image>`: 정의된 컴포넌트의 실행 환경 정보가 담긴 이미지를 pull
2. run `command`: pull 한 이미지에서 컴포넌트 콘텐츠를 실행합니다.  

`print_and_return_number.yaml` 를 예시로 들자면 `@create_component_from_func` 의 default image 는 python:3.7 이므로 해당 이미지를 기준으로 컴포넌트 콘텐츠를 실행하게 됩니다.  

1. `docker pull python:3.7`
2. `print(number)`

## References:

- [Getting Started With Python function based components](https://www.kubeflow.org/docs/components/pipelines/sdk/python-function-components/#getting-started-with-python-function-based-components)
