---
title : "[Kubeflow] Concepts"
description: ""
lead: ""
draft: false
weight: 302
contributors: ["Jongseob Jeon"]
menu:
  docs:
    parent: "kubeflow"
---

## Component

컴포넌트(Component)는 컴포넌트 컨텐츠(Component contents)와 컴포넌트 래퍼(Component wrapper)로 구성되어 있습니다.
하나의 컴포넌트는 컴포넌트 래퍼를 통해 kubeflow에 전달이 되며 전달된 컴포넌트는 정의된 컴포넌트 컨턴츠를 실행(execute)하고 결과물(artifacts)들을 생산합니다.

<img src="/images/docs/kubeflow/concept-0.png" title="concept-image"/>

## Component contents

Component Contents를 구성하는 것은 총 3가지가 있습니다.

<img src="/images/docs/kubeflow/concept-1.png" title="concept-image"/>

1. Environemnt
2. Python code w\ config
3. Generates Artifacts

예시와 함께 각 구성 요소들이 어떤 것인지 알아보도록 하겠습니다.
다음과  같이 데이터를 불러와 SVC를 학습한 후 SVC모델을 저장하는 과정을 적은 파이썬 코드가 있습니다.

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

이 파이썬 코드 다음과 같이 component contents로 나눌 수 있습니다.

<img src="/images/docs/kubeflow/concept-2.png" title="concept-image"/>

Environment는 파이썬 코드에서 사용하는 패키지들을 import하는 부분입니다.
다음으로 Config & Python Code에서는 주어진 Config를 이용해 실제로 학습을 수행합니다.
마지막으로 artifact를 저장하는 과정이 있습니다.

## Component wrapper

Component wrapper는 Component contents를 실행시키는 작업을 합니다.

<img src="/images/docs/kubeflow/concept-3.png" title="concept-image"/>

kubeflow에서는 component wrapper를 위의 `train_scv_from_`csv와 같이 함수의 형태로 정의합니다.
Component wrapper가 contents를 감싸면 다음과 같이 됩니다.

<img src="/images/docs/kubeflow/concept-4.png" title="concept-image"/>

## Artifacts

위의 설명에서 Component는 Artifacts를 생성한다고 했습니다.
Artifacts는 파일, log 등 어떤 형태로 생성되는 것을 통틀어서 말하는 용어입니다.
그 중 우리의 관심을 갖는 유의미한 것들은 다음과 같은 것들이 있습니다.

<img src="/images/docs/kubeflow/concept-5.png" title="concept-image"/>

### Model

저희는 모델은 예측을 할 수 있는 파이썬 코드와 학습된 weight 그리고 이를 실행시키기 위한 환경이 모두 있는 형태로 정의하였습니다.

### Data

데이터는 모델의 예측 값 등이 있을 수 있습니다.

### Metric

Metric은 동적 지표와 정적 지표 두 가지로 나누었습니다.

- 동적 지표란 train loss와 같이 학습 중 생기며 계속해서 변화하는 값을 의미합니다.
- 정적 지표란 학습이 끝난 후 최종적으로 모델을 평가하는 정확도 등을 의미합니다.

## 파이프라인의 정의

파이프라인은 component의 집합과 component를 실행시키는 순서도로 구성되어 있습니다.

<img src="/images/docs/kubeflow/concept-6.png" title="concept-image"/>

## Pipeline config

앞서 component를 실행시키기 위해서는 config가 필요하다고 설명했습니다.
Pipeline은 component의 집합이기 때문에 각 component의 config를 모아둔 것이 pipeline config입니다.

<img src="/images/docs/kubeflow/concept-7.png" title="concept-image"/>

## Run이란?

Pipeline을 실행시킬 config가 주어진다면 파이프라인은 실행(RUN)이 됩니다.
이러한 이유로 파이프라인이 실행된 결과를 run이라고 부릅니다.

<img src="/images/docs/kubeflow/concept-8.png" title="concept-image"/>

파이프라인이 실행되면 각 component들이 artifacts들을 생성합니다.
kubeflow에서는 이를 임의의 run_id를 만들고 전부 저장을 합니다.

<img src="/images/docs/kubeflow/concept-9.png" title="concept-image"/>

그러면 이제 직접 component와 pipeline을 작성하는 방법에 대해서 알아보도록 하겠습니다.
