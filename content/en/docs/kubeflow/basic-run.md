---
title : "[Basic Usage] Run"
description: ""
lead: ""
draft: false
weight: 313
contributors: ["Jongseob Jeon"]
menu:
  docs:
    parent: "kubeflow"
---

이제 우리가 업로드한 파이프라인을 실행시켜 보겠습니다.

## Before Run

제일 처음 실행을 할 경우 Experiment를 생성해야 합니다. 생성되어 있다면 넘어가도 무방합니다.

### 1. Create Experiment

Create Experiment 버튼을 통해 생성할 수 있습니다.

<img src="/images/docs/kubeflow/run-0.png" title="run"/>

### 2. Name 입력

Experiment로 사용할 이름을 입력합니다.

<img src="/images/docs/kubeflow/run-1.png" title="run"/>

## Run Pipeline

### 1. Create Run 선택

<img src="/images/docs/kubeflow/run-2.png" title="run"/>

### 2. Pipeline Config 입력

파이프라인을 생성할 때 입력한 config 값들을 입력합니다.

<img src="/images/docs/kubeflow/run-3.png" title="run"/>

### 3. Start

입력후 Start 버튼을 누르면 파이프라인이 실행됩니다.

<img src="/images/docs/kubeflow/run-4.png" title="run"/>

## Run Result

파이프라인이 실행되면 Runs 탭에 결과들이 모이게 됩니다.
자세한 내용을 확인해 보기 위해서 생성된 Run을 클릭합니다

<img src="/images/docs/kubeflow/run-5.png" title="run"/>

클릭하면 다음과 같은 화면이 나옵니다. 아직 실행되지 않았을 때에는 회색 표시로 나옵니다.

<img src="/images/docs/kubeflow/run-6.png" title="run"/>

실행이 완료되면 초록색 체크 표시가 나옵니다.

<img src="/images/docs/kubeflow/run-7.png" title="run"/>

가장 마지막 컴포넌트를 보면 입력한 Config 3과 5의 합인 8이 출력된 것을 확인할 수 있습니다.

<img src="/images/docs/kubeflow/run-8.png" title="run"/>
