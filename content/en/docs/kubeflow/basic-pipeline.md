---
title : "[Basic Usage] Pipeline"
description: ""
lead: ""
draft: false
weight: 311
contributors: ["Jongseob Jeon"]
menu:
  docs:
    parent: "kubeflow"
---

컴포넌트는 독립적으로 시행되지 않고 파이프라인을 통해서만 실행됩니다.

파이프라인을 작성하기 위해서는 컴포넌트의 집합과 컴포넌트의 실행 순서가 필요합니다.

이번 페이지에서는 숫자를 입력받고 출력하는 컴포넌트 두 개와 앞의 두 개의 숫자를 받아서 합을 출력하는 컴포넌트가 있는 파이프라인을 만들어 보도록 하겠습니다.

## Component set

우선 사용할 컴포넌트들을 정의해 보겠습니다.

1. `print_and_return_number`

    입력받은 숫자를 출력하고 반환하는 컴포넌트입니다. 컴포넌트가 반환값이 있음을 알려주기 위해서 타입힌트를 추가하겠습니다. 입력받은 값을 출력함으로 int를 return 힌트로 입력합니다.

    ```python
    @create_component_from_func
    def print_and_return_number(number: int) -> int:
        print(number)
        return number
    ```

1. `sum_and_print_numbers`

    입력 받은 두개의 숫자의 합을 출력하는 컴포넌트입니다.

    ```python
    @create_component_from_func
    def sum_and_print_numbers(number_1: int, number_2: int) -> int:
        sum_num = number_1 + number_2
        print(sum_num)
        return sum_num
    ```

## Component Order

필요한 컴포넌트의 집합을 만들었으면, 다음으로는 이들의 순서도를 만들어 줍니다.
우리가 만들 파이프라인의 순서도를 표현하면 다음과 같이 됩니다.

<p align="center">
  <img src="/images/docs/kubeflow/pipeline-0.png" title="pipeline-order" width=50%/>
</p>

이제 이 순서도를 코드로 옮겨야 합니다.
우선 위의 `print_and_return_number_1` 과 `print_and_return_number_2` 를 작성하면 다음과 같이 됩니다.

```python
def example_pipeline():
    number_1_result = print_and_return_number(number_1)
    number_2_result = print_and_return_number(number_2)
```

컴포넌트를 실행하고 그 반환 값을 각각 `number_1_result` 와 `number_2_result` 에 저장합니다. `number_1_result` 의 반환값은 `number_1_resulst.output` 를 통해 사용할 수 있습니다.

위의 예시에서 컴포넌트는 단일 값만을 반환하기 때문에 `output`을 이용해 바로 사용할 수 있었습니다.
만약, 여러 개의 반환값이 있다면 `outputs`에 저장이 됩니다.
`outputs`는 dict 형태로서 key를 이용해 원하는 반환 값을 사용할 수 있습니다.

이제 이 두 값의 결과를 `sum_and_print_numbers` 에 전달합니다.

```python
def example_pipeline():
    number_1_result = print_and_return_number(number_1)
    number_2_result = print_and_return_number(number_2)
    sum_result = sum_and_print_numbers(
        number_1=number_1_result.output, number_2=number_2_result.output
    )
```

다음으로 각 컴포넌트에 필요한 config들을 모아서 파이프라인 config로 정의 합니다.

```python
def example_pipeline(number_1: int, number_2:int):
    number_1_result = print_and_return_number(number_1)
    number_2_result = print_and_return_number(number_2)
    sum_result = sum_and_print_numbers(
        number_1=number_1_result.output, number_2=number_2_result.output
    )
```

## Convert to Kubeflow Format

마지막으로 kubeflow에서 사용할 수 있는 형식으로 변환합니다. 변환은 `kfp.dsl.pipeline` 함수를 이용해 할 수 잇씁니다.

```python
from kfp.dsl import pipeline


@pipeline(name="example_pipeline")
def example_pipeline(number_1: int, number_2: int):
    number_1_result = print_and_return_number(number_1)
    number_2_result = print_and_return_number(number_2)
    sum_result = sum_and_print_numbers(
        number_1=number_1_result.output, number_2=number_2_result.output
    )
```

파이프라인을 yaml 형식으로 컴파일합니다.

```python
if __name__ == "__main__":
    import kfp
    kfp.compiler.Compiler().compile(example_pipeline, "example_pipeline.yaml")
```

## Conclusion

앞서 설명한 내용을 한 스크립트로 모을 경우 다음과 같이 됩니다.

```python
import kfp
from kfp.components import create_component_from_func
from kfp.dsl import pipeline

@create_component_from_func
def print_and_return_number(number: int) -> int:
    print(number)
    return number

@create_component_from_func
def sum_and_print_numbers(number_1: int, number_2: int):
    print(number_1 + number_2)

@pipeline(name="example_pipeline")
def example_pipeline(number_1: int, number_2: int):
    number_1_result = print_and_return_number(number_1)
    number_2_result = print_and_return_number(number_2)
    sum_result = sum_and_print_numbers(
        number_1=number_1_result.output, number_2=number_2_result.output
    )

if __name__ == "__main__":
    kfp.compiler.Compiler().compile(example_pipeline, "example_pipeline.yaml")
```

컴파일된 결과를 보면 다음과 같습니다.

<details>
  <summary>example_pipeline.yaml</summary>

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Workflow
metadata:
  generateName: example-pipeline-
  annotations: {pipelines.kubeflow.org/kfp_sdk_version: 1.6.3, pipelines.kubeflow.org/pipeline_compilation_time: '2021-12-05T13:38:51.566777',
    pipelines.kubeflow.org/pipeline_spec: '{"inputs": [{"name": "number_1", "type":
      "Integer"}, {"name": "number_2", "type": "Integer"}], "name": "example_pipeline"}'}
  labels: {pipelines.kubeflow.org/kfp_sdk_version: 1.6.3}
spec:
  entrypoint: example-pipeline
  templates:
  - name: example-pipeline
    inputs:
      parameters:
      - {name: number_1}
      - {name: number_2}
    dag:
      tasks:
      - name: print-and-return-number
        template: print-and-return-number
        arguments:
          parameters:
          - {name: number_1, value: '{{inputs.parameters.number_1}}'}
      - name: print-and-return-number-2
        template: print-and-return-number-2
        arguments:
          parameters:
          - {name: number_2, value: '{{inputs.parameters.number_2}}'}
      - name: sum-and-print-numbers
        template: sum-and-print-numbers
        dependencies: [print-and-return-number, print-and-return-number-2]
        arguments:
          parameters:
          - {name: print-and-return-number-2-Output, value: '{{tasks.print-and-return-number-2.outputs.parameters.print-and-return-number-2-Output}}'}
          - {name: print-and-return-number-Output, value: '{{tasks.print-and-return-number.outputs.parameters.print-and-return-number-Output}}'}
  - name: print-and-return-number
    container:
      args: [--number, '{{inputs.parameters.number_1}}', '----output-paths', /tmp/outputs/Output/data]
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
      image: python:3.7
    inputs:
      parameters:
      - {name: number_1}
    outputs:
      parameters:
      - name: print-and-return-number-Output
        valueFrom: {path: /tmp/outputs/Output/data}
      artifacts:
      - {name: print-and-return-number-Output, path: /tmp/outputs/Output/data}
    metadata:
      labels: {pipelines.kubeflow.org/kfp_sdk_version: 1.6.3, pipelines.kubeflow.org/pipeline-sdk-type: kfp}
      annotations: {pipelines.kubeflow.org/component_spec: '{"implementation": {"container":
          {"args": ["--number", {"inputValue": "number"}, "----output-paths", {"outputPath":
          "Output"}], "command": ["sh", "-ec", "program_path=$(mktemp)\nprintf \"%s\"
          \"$0\" > \"$program_path\"\npython3 -u \"$program_path\" \"$@\"\n", "def
          print_and_return_number(number):\n    print(number)\n    return number\n\ndef
          _serialize_int(int_value: int) -> str:\n    if isinstance(int_value, str):\n        return
          int_value\n    if not isinstance(int_value, int):\n        raise TypeError(''Value
          \"{}\" has type \"{}\" instead of int.''.format(str(int_value), str(type(int_value))))\n    return
          str(int_value)\n\nimport argparse\n_parser = argparse.ArgumentParser(prog=''Print
          and return number'', description='''')\n_parser.add_argument(\"--number\",
          dest=\"number\", type=int, required=True, default=argparse.SUPPRESS)\n_parser.add_argument(\"----output-paths\",
          dest=\"_output_paths\", type=str, nargs=1)\n_parsed_args = vars(_parser.parse_args())\n_output_files
          = _parsed_args.pop(\"_output_paths\", [])\n\n_outputs = print_and_return_number(**_parsed_args)\n\n_outputs
          = [_outputs]\n\n_output_serializers = [\n    _serialize_int,\n\n]\n\nimport
          os\nfor idx, output_file in enumerate(_output_files):\n    try:\n        os.makedirs(os.path.dirname(output_file))\n    except
          OSError:\n        pass\n    with open(output_file, ''w'') as f:\n        f.write(_output_serializers[idx](_outputs[idx]))\n"],
          "image": "python:3.7"}}, "inputs": [{"name": "number", "type": "Integer"}],
          "name": "Print and return number", "outputs": [{"name": "Output", "type":
          "Integer"}]}', pipelines.kubeflow.org/component_ref: '{}', pipelines.kubeflow.org/arguments.parameters: '{"number":
          "{{inputs.parameters.number_1}}"}'}
  - name: print-and-return-number-2
    container:
      args: [--number, '{{inputs.parameters.number_2}}', '----output-paths', /tmp/outputs/Output/data]
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
      image: python:3.7
    inputs:
      parameters:
      - {name: number_2}
    outputs:
      parameters:
      - name: print-and-return-number-2-Output
        valueFrom: {path: /tmp/outputs/Output/data}
      artifacts:
      - {name: print-and-return-number-2-Output, path: /tmp/outputs/Output/data}
    metadata:
      labels: {pipelines.kubeflow.org/kfp_sdk_version: 1.6.3, pipelines.kubeflow.org/pipeline-sdk-type: kfp}
      annotations: {pipelines.kubeflow.org/component_spec: '{"implementation": {"container":
          {"args": ["--number", {"inputValue": "number"}, "----output-paths", {"outputPath":
          "Output"}], "command": ["sh", "-ec", "program_path=$(mktemp)\nprintf \"%s\"
          \"$0\" > \"$program_path\"\npython3 -u \"$program_path\" \"$@\"\n", "def
          print_and_return_number(number):\n    print(number)\n    return number\n\ndef
          _serialize_int(int_value: int) -> str:\n    if isinstance(int_value, str):\n        return
          int_value\n    if not isinstance(int_value, int):\n        raise TypeError(''Value
          \"{}\" has type \"{}\" instead of int.''.format(str(int_value), str(type(int_value))))\n    return
          str(int_value)\n\nimport argparse\n_parser = argparse.ArgumentParser(prog=''Print
          and return number'', description='''')\n_parser.add_argument(\"--number\",
          dest=\"number\", type=int, required=True, default=argparse.SUPPRESS)\n_parser.add_argument(\"----output-paths\",
          dest=\"_output_paths\", type=str, nargs=1)\n_parsed_args = vars(_parser.parse_args())\n_output_files
          = _parsed_args.pop(\"_output_paths\", [])\n\n_outputs = print_and_return_number(**_parsed_args)\n\n_outputs
          = [_outputs]\n\n_output_serializers = [\n    _serialize_int,\n\n]\n\nimport
          os\nfor idx, output_file in enumerate(_output_files):\n    try:\n        os.makedirs(os.path.dirname(output_file))\n    except
          OSError:\n        pass\n    with open(output_file, ''w'') as f:\n        f.write(_output_serializers[idx](_outputs[idx]))\n"],
          "image": "python:3.7"}}, "inputs": [{"name": "number", "type": "Integer"}],
          "name": "Print and return number", "outputs": [{"name": "Output", "type":
          "Integer"}]}', pipelines.kubeflow.org/component_ref: '{}', pipelines.kubeflow.org/arguments.parameters: '{"number":
          "{{inputs.parameters.number_2}}"}'}
  - name: sum-and-print-numbers
    container:
      args: [--number-1, '{{inputs.parameters.print-and-return-number-Output}}', --number-2,
        '{{inputs.parameters.print-and-return-number-2-Output}}']
      command:
      - sh
      - -ec
      - |
        program_path=$(mktemp)
        printf "%s" "$0" > "$program_path"
        python3 -u "$program_path" "$@"
      - |
        def sum_and_print_numbers(number_1, number_2):
            print(number_1 + number_2)

        import argparse
        _parser = argparse.ArgumentParser(prog='Sum and print numbers', description='')
        _parser.add_argument("--number-1", dest="number_1", type=int, required=True, default=argparse.SUPPRESS)
        _parser.add_argument("--number-2", dest="number_2", type=int, required=True, default=argparse.SUPPRESS)
        _parsed_args = vars(_parser.parse_args())

        _outputs = sum_and_print_numbers(**_parsed_args)
      image: python:3.7
    inputs:
      parameters:
      - {name: print-and-return-number-2-Output}
      - {name: print-and-return-number-Output}
    metadata:
      labels: {pipelines.kubeflow.org/kfp_sdk_version: 1.6.3, pipelines.kubeflow.org/pipeline-sdk-type: kfp}
      annotations: {pipelines.kubeflow.org/component_spec: '{"implementation": {"container":
          {"args": ["--number-1", {"inputValue": "number_1"}, "--number-2", {"inputValue":
          "number_2"}], "command": ["sh", "-ec", "program_path=$(mktemp)\nprintf \"%s\"
          \"$0\" > \"$program_path\"\npython3 -u \"$program_path\" \"$@\"\n", "def
          sum_and_print_numbers(number_1, number_2):\n    print(number_1 + number_2)\n\nimport
          argparse\n_parser = argparse.ArgumentParser(prog=''Sum and print numbers'',
          description='''')\n_parser.add_argument(\"--number-1\", dest=\"number_1\",
          type=int, required=True, default=argparse.SUPPRESS)\n_parser.add_argument(\"--number-2\",
          dest=\"number_2\", type=int, required=True, default=argparse.SUPPRESS)\n_parsed_args
          = vars(_parser.parse_args())\n\n_outputs = sum_and_print_numbers(**_parsed_args)\n"],
          "image": "python:3.7"}}, "inputs": [{"name": "number_1", "type": "Integer"},
          {"name": "number_2", "type": "Integer"}], "name": "Sum and print numbers"}',
        pipelines.kubeflow.org/component_ref: '{}', pipelines.kubeflow.org/arguments.parameters: '{"number_1":
          "{{inputs.parameters.print-and-return-number-Output}}", "number_2": "{{inputs.parameters.print-and-return-number-2-Output}}"}'}
  arguments:
    parameters:
    - {name: number_1}
    - {name: number_2}
  serviceAccountName: pipeline-runner
```

</details>
