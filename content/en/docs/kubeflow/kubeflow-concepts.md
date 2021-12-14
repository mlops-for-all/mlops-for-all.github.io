---
title : "2. Concepts"
description: ""
lead: ""
draft: false
weight: 303
contributors: ["Jongseob Jeon"]
menu:
  docs:
    parent: "kubeflow"
---

## Component

컴포넌트(Component)는 컴포넌트 컨텐츠(Component contents)와 컴포넌트 래퍼(Component wrapper)로 구성되어 있습니다.
하나의 컴포넌트는 컴포넌트 래퍼를 통해 kubeflow engine에 전달되며 전달된 컴포넌트는 정의된 컴포넌트 컨텐츠를 실행(execute)하고 결과물(artifacts)들을 생산합니다.

<p align="center">
  <img src="/images/docs/kubeflow/concept-0.png" title="kubeflow-component-concept"/>
</p>

### Component Contents

Component Contents를 구성하는 것은 총 3가지가 있습니다.

<p align="center">
  <img src="/images/docs/kubeflow/concept-1.png" title="component-contents" width=50%/>
</p>

1. Environemnt
2. Python code w\ config
3. Generates Artifacts

예시와 함께 각 구성 요소들이 어떤 것인지 알아보도록 하겠습니다.
다음과 같이 데이터를 불러와 SVC를 학습한 후 SVC모델을 저장하는 과정을 적은 파이썬 코드가 있습니다.

```python
import dill
import pandas as pd

from sklearn.svm import SVC

train_data = pd.read_csv(train_data_path)
train_target= pd.read_csv(train_target_path)

clf= SVC(
    kernel=kernel
)
clf.fit(train_data)

with open(model_path, mode="wb") as file_writer:
     dill.dump(clf, file_writer)
```

위의 파이썬 코드는 다음과 같이 컴포넌트 컨텐츠로 나눌 수 있습니다.

<p align="center">
  <img src="/images/docs/kubeflow/concept-2.png" title="concept-image"/>
</p>

Environment는 파이썬 코드에서 사용하는 패키지들을 import하는 부분입니다.
다음으로 Config & Python Code에서는 주어진 Config를 이용해 실제로 학습을 수행합니다.
마지막으로 artifact를 저장하는 과정이 있습니다.

### Component Wrapper

컴포넌트 래퍼는 컴포넌트 컨텐츠에 필요한 config를 전달하고 실행시키는 작업을 합니다.

<p align="center">
  <img src="/images/docs/kubeflow/concept-3.png" title="before-component-wrapper" width=90%/>
</p>

Kubeflow에서는 컴포넌트 래퍼를 위의 `train_scv_from_csv`와 같이 함수의 형태로 정의합니다.
컴포넌트 래퍼가 컨텐츠를 감싸면 다음과 같이 됩니다.

<p align="center">
  <img src="/images/docs/kubeflow/concept-4.png" title="after-component-wrapper" width=45%/>
</p>

### Artifacts

위의 설명에서 컴포넌트는 아티팩트(Artifacts)를 생성한다고 했습니다. 아티팩트란 evaluation result, log 등 어떤 형태로든 파일로 생성되는 것을 통틀어서 칭하는 용어입니다.
그 중 우리가 관심을 갖는 유의미한 것들은 다음과 같은 것들이 있습니다.

<p align="center">
  <img src="/images/docs/kubeflow/concept-5.png" title="artifacts"/>
</p>

- Model
- Data
- Metric

#### Model

저희는 모델은 파이썬 코드와 학습된 weights 그리고 이를 실행시키기 위한 환경이 모두 포함된 형태로 정의하였습니다.

#### Data

데이터는 전처리된 피쳐, 모델의 예측 값 등을 포함합니다.

#### Metric

Metric은 동적 지표와 정적 지표 두 가지로 나누었습니다.

- 동적 지표란 train loss와 같이 학습 중 생기며 계속해서 변화하는 값을 의미합니다.
- 정적 지표란 학습이 끝난 후 최종적으로 모델을 평가하는 정확도 등을 의미합니다.

## Pipeline

파이프라인은 컴포넌트의 집합과 컴포넌트를 실행시키는 순서도로 구성되어 있습니다. 이 때, 순서도는 방향 순환이 없는 그래프로 이루어져 있으며, 간단한 조건문을 포함할 수 있습니다.

<p align="center">
  <img src="/images/docs/kubeflow/concept-6.png" title="pipeline-concept" width=90%/>
</p>

### Pipeline Config

앞서 컴포넌트를 실행시키기 위해서는 config가 필요하다고 설명했습니다. Pipeline을 구성하는 컴포넌트의 config 중 맨 앞에서 전달해주어야 하는 config 를 모아둔 것이 파이프라인 config입니다.

<p align="center">
  <img src="/images/docs/kubeflow/concept-7.png" title="pipeline-config" width=90%/>
</p>

## Run

파이프라인을 실행시킬 config가 주어진다면 파이프라인은 실행(RUN)이 됩니다.
이러한 이유로 파이프라인이 실행된 결과를 run이라고 부릅니다.

<p align="center">
  <img src="/images/docs/kubeflow/concept-8.png" title="run" width=90%/>
</p>

파이프라인이 실행되면 각 컴포넌트들이 artifacts들을 생성합니다.
kubeflow pipeline에서는 run 하나 당 고유의 id 를 생성하고, 하나의 run에서 생성되는 artifacts들을 모두 저장합니다.

<p align="center">
  <img src="/images/docs/kubeflow/concept-9.png" title="kubeflow-run" width=90%/>
</p>

그러면 이제 직접 컴포넌트와 파이프라인을 작성하는 방법에 대해서 알아보도록 하겠습니다.
