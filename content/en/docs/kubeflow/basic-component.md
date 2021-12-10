---
title : "[Basic Usage] Component"
description: ""
lead: ""
draft: false
weight: 310
contributors: ["Jongseob Jeon"]
menu:
  docs:
    parent: "kubeflow"
---


컴포넌트(Component)를 작성하기 위해서는 다음과 같은 내용들을 작성해야 합니다.

1. 컴포넌트 컨텐츠(Component Contents) 작성
2. 컴포넌트 래퍼(Component Wrapper) 작성
3. Kubeflow에서 인식할 수 있도록 변환

이제 각 과정들에 대해서 알아보도록 하겠습니다.

## Component Contents

컴포넌트 컨텐츠는 우리가 흔히 작성하는 파이썬 코드와 다르지 않습니다.
예를 들어서 숫자를 입력으로 받고 입력받은 숫자를 출력한 뒤 반환하는 컴포넌트를 작성해 보겠습니다.
파이썬 코드는 다음과 같이 됩니다.

```python
print(number)
```

그런데 이 코드를 실행할 경우 에러가 나고 동작하지 않습니다.
출력해야 할 `number`가 정의되어 있지 않기 때문입니다.

[Concepts]({{< relref "docs/kubeflow/kubeflow-concepts.md" >}})에서 `number` 와 같이 컴포넌트 컨텐츠에서 필요한 값들은 **config**로 정의한다고 했습니다. 이러한 config들은 컴포넌트 래퍼에서 전달이 되어야 합니다.

## Component Wrapper

이제 필요한 config를 전달할 수 있도록 컴퍼넌트 래퍼를 만들어야 합니다.

별도의 config 없이 컴포넌트 래퍼로 감쌀 경우 다음과 같이 됩니다.

```python
def print_and_return_number():
    print(number)
    return number
```

이제 컨텐츠에서 필요한 `config` 를 래퍼의 argument로 추가합니다. 다만, argument 만을 적는 것이 아니라 argument의 타입 힌트도 작성해야 합니다. Kubeflow에서는 파이프라인을 생성하기 전 각 컴포넌트의 입력과 출력의 타입을 체크합니다. 만약 입력과 출력이 일치하지 않을 경우 파이프라인 생성을 할 수 없습니다.

그렇기 때문에 다음과 같이 argumet와 그 타입, 그리고 반환하는 타입을 적어서 컴포넌트 래퍼를 완성합니다.

```python
def print_and_return_number(number: int) -> int:
    print(number)
    return number
```

Kubeflow에서 반환값으로 사용할 수 있는 타입은 json에서 표현할 수 있는 타입들로 다음과 같습니다.

- int
- float
- str

만약 단일 출력이 아닌 여러개를 출력할 경우 `collections.namedtuple` 을 이용해야 합니다.
예를 들어서 입력 받은 숫자를 2로 나눈 후 그 몫과 나머지를 반환하는 경우에는 다음과 같이 작성해야 합니다.

```python
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

## Convert to Kubeflow Format

이제 작성한 컴포넌트를 kubeflow에서 사용할 수 있는 포맷으로 변환해야 합니다. 변환은 `kfp.components.create_component_from_func` 를 통해서 할 수 있습니다.

```python
from kfp.components import create_component_from_func

@create_component_from_func
def print_and_return_number(number: int) -> int:
    print(number)
    return number

if __name__ == "__main__":
    print_and_return_number.component_spec.save("print_and_return_number.yaml")
```

작성한 스크립트를 실행하면 `print_and_return_number.yaml` 파일이 생성됩니다. 파일을 확인하면 다음과 같습니다.

```yaml
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

kubeflow에서 컴포넌트가 실행되는 순서는 정의된 이미지를 pull 후 해당 이미지에서 컴포넌트 컨텐츠를 실행합니다.
`print_and_return_number.yaml` 를 예시로 들자면 실행되는 순서는 다음과 같습니다.

1. `docker pull python:3.7`
2. run `command`
