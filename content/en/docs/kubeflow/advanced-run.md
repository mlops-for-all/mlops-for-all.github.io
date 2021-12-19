---
title : "10. Pipeline - Run Result"
description: ""
lead: ""
draft: false
weight: 324
contributors: ["Jongseob Jeon"]
menu:
  docs:
    parent: "kubeflow"
---


## Run Result

Run 실행 결과를 눌러보면 3개의 탭이 존재합니다.
각각 Graph, Run output, Config 입니다.

<p align="center">
  <img src="/images/docs/kubeflow/advanced-run-0.png" title="run-result"/>
</p>

## Graph

<p align="center">
  <img src="/images/docs/kubeflow/advanced-run-1.png" title="run-graph"/>
</p>

그래프에서는 실행된 컴포넌트를 누르면 컴포넌트의 실행 정보를 확인할 수 있습니다.

### Input/Output

Input/Output 탭은 컴포넌트에서 사용한 Config들과 Input, Output Artifacts를 확인하고 다운로드 받을 수 있습니다.

### Logs

Logs에서는 파이썬 코드 실행 중 나오는 모든 stdout을 확인할 수 있습니다.
다만 pod은 일정 시간이 지난 후 지워지기 때문에 일정 시간이 지나면 이 탭에서는 확인할 수 없습니다.
이 때는 Output artifacts의 main-logs에서 확인할 수 있습니다.

### Visualizations

Visualizations에서는 컴포넌트에서 생성된 플랏을 보여줍니다.

플랏을 생성하기 위해서는 `mlpipeline_ui_metadata: OutputPath("UI_Metadata")` argument로 보여주고 싶은 값을 저장하면 됩니다. 이 때 플랏의 형태는 html 포맷이어야 합니다.
변환하는 과정은 다음과 같습니다.

```python

@partial(
    create_component_from_func,
    packages_to_install=["matplotlib"],
)
def plot_linear(
    mlpipeline_ui_metadata: OutputPath("UI_Metadata")
):
    import base64
    import json
    from io import BytesIO

    import matplotlib.pyplot as plt

    plt.plot(x=[1, 2, 3], y=[1, 2,3])

    tmpfile = BytesIO()
    plt.savefig(tmpfile, format="png")
    encoded = base64.b64encode(tmpfile.getvalue()).decode("utf-8")

    html = f"<img src='data:image/png;base64,{encoded}'>"
    metadata = {
        "outputs": [
            {
                "type": "web-app",
                "storage": "inline",
                "source": html,
            },
        ],
    }
    with open(mlpipeline_ui_metadata, "w") as html_writer:
        json.dump(metadata, html_writer)
```

파이프라인으로 작성하면 다음과 같이 됩니다.

```python
from functools import partial

import kfp
from kfp.components import create_component_from_func, OutputPath
from kfp.dsl import pipeline


@partial(
    create_component_from_func,
    packages_to_install=["matplotlib"],
)
def plot_linear(mlpipeline_ui_metadata: OutputPath("UI_Metadata")):
    import base64
    import json
    from io import BytesIO

    import matplotlib.pyplot as plt

    plt.plot([1, 2, 3], [1, 2, 3])

    tmpfile = BytesIO()
    plt.savefig(tmpfile, format="png")
    encoded = base64.b64encode(tmpfile.getvalue()).decode("utf-8")

    html = f"<img src='data:image/png;base64,{encoded}'>"
    metadata = {
        "outputs": [
            {
                "type": "web-app",
                "storage": "inline",
                "source": html,
            },
        ],
    }
    with open(mlpipeline_ui_metadata, "w") as html_writer:
        json.dump(metadata, html_writer)


@pipeline(name="plot_pipeline")
def plot_pipeline():
    plot_linear()


if __name__ == "__main__":
    kfp.compiler.Compiler().compile(plot_pipeline, "plot_pipeline.yaml")
```

실행 후 Visualization을 클릭합니다.

<p align="center">
  <img src="/images/docs/kubeflow/advanced-run-5.png" title="run-viz"/>
</p>

## Run output

<p align="center">
  <img src="/images/docs/kubeflow/advanced-run-2.png" title="run-output"/>
</p>

Run output은 kubeflow에서 지정한 형태로 생긴 Artifacts를 모아서 보여주는 곳이며 평가 지표(Metric)를 보여줍니다.

평가 지표(Metric)을 보여주기 위해서는 `mlpipeline_metrics_path: OutputPath("Metrics")` argument에 보여주고 싶은 이름과 값을 json 형태로 저장하면 됩니다.
예를 들어서 다음과 같이 작성할 수 있습니다.

```python
@create_component_from_func
def show_metric_of_sum(
    number: int,
    mlpipeline_metrics_path: OutputPath("Metrics"),
  ):
    import json
    metrics = {
        "metrics": [
            {
                "name": "sum_value",
                "numberValue": number,
            },
        ],
    }
    with open(mlpipeline_metrics_path, "w") as f:
        json.dump(metrics, f)
```

평가 지표를 생성하는 컴포넌트를 [파이프라인]({{< relref "docs/kubeflow/basic-pipeline.md" >}})에서 생성한 파이프라인에 추가 후 실행해 보겠습니다.
전체 파이프라인은 다음과 같습니다.

```python
import kfp
from kfp.components import create_component_from_func, OutputPath
from kfp.dsl import pipeline


@create_component_from_func
def print_and_return_number(number: int) -> int:
    print(number)
    return number

@create_component_from_func
def sum_and_print_numbers(number_1: int, number_2: int) -> int:
    sum_number = number_1 + number_2
    print(sum_number)
    return sum_number

@create_component_from_func
def show_metric_of_sum(
    number: int,
    mlpipeline_metrics_path: OutputPath("Metrics"),
  ):
    import json
    metrics = {
        "metrics": [
            {
                "name": "sum_value",
                "numberValue": number,
            },
        ],
    }
    with open(mlpipeline_metrics_path, "w") as f:
        json.dump(metrics, f)

@pipeline(name="example_pipeline")
def example_pipeline(number_1: int, number_2: int):
    number_1_result = print_and_return_number(number_1)
    number_2_result = print_and_return_number(number_2)
    sum_result = sum_and_print_numbers(
        number_1=number_1_result.output, number_2=number_2_result.output
    )
    show_metric_of_sum(sum_result.output)


if __name__ == "__main__":
    kfp.compiler.Compiler().compile(example_pipeline, "example_pipeline.yaml")
```

실행 후 Run Output을 클릭하면 다음과 같이 나옵니다.

<p align="center">
  <img src="/images/docs/kubeflow/advanced-run-4.png" title="run-output-metric"/>
</p>

## Config

<p align="center">
  <img src="/images/docs/kubeflow/advanced-run-3.png" title="run-config"/>
</p>

Config에서는 파이프라인 Config로 입력받은 모든 값을 확인할 수 있습니다.
