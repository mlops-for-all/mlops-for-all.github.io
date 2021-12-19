---
title : "7. Pipeline - Run"
description: ""
lead: ""
draft: false
weight: 315
contributors: ["Jongseob Jeon"]
menu:
  docs:
    parent: "kubeflow"
---

## Run Pipeline

이제 우리가 업로드한 파이프라인을 실행시켜 보겠습니다.

## Before Run

### 1. Create Experiment

Experiment란 Kubeflow 에서 실행되는 Run을 논리적으로 관리하는 단위입니다.  
Kubeflow를 최초 실행하면 Experiment가 없습니다. 따라서 파이프라인을 최초 실행할 때 Experiment를 먼저 생성해두어야 합니다.  
Experiment 를 미리 생성해두었다면 [Run Pipeline]({{< relref "docs/kubeflow/basic-run.md#run-pipeline-1" >}})으로 넘어가도 무방합니다.

Experiment는 Create Experiment 버튼을 통해 생성할 수 있습니다.

<p align="center">
  <img src="/images/docs/kubeflow/run-0.png" title="run"/>
</p>

### 2. Name 입력

Experiment로 사용할 이름을 입력합니다.
<p align="center">
  <img src="/images/docs/kubeflow/run-1.png" title="run"/>
</p>

## Run Pipeline

### 1. Create Run 선택

<p align="center">
  <img src="/images/docs/kubeflow/run-2.png" title="run"/>
</p>

### 2. Experiment 선택

<p align="center">
  <img src="/images/docs/kubeflow/run-9.png" title="run"/>
</p>

<p align="center">
  <img src="/images/docs/kubeflow/run-10.png" title="run"/>
</p>

### 3. Pipeline Config 입력

파이프라인을 생성할 때 입력한 Config 값들을 채워 넣습니다.
<p align="center">
  <img src="/images/docs/kubeflow/run-3.png" title="run"/>
</p>

### 4. Start

입력 후 Start 버튼을 누르면 파이프라인이 실행됩니다.
<p align="center">
  <img src="/images/docs/kubeflow/run-4.png" title="run"/>
</p>

## Run Result

실행된 파이프라인들은 Runs 탭에서 확인할 수 있습니다.
Run을 클릭하면 실행된 파이프라인과 관련된 자세한 내용을 확인해 볼 수 있습니다.

<p align="center">
  <img src="/images/docs/kubeflow/run-5.png" title="run"/>
</p>

클릭하면 다음과 같은 화면이 나옵니다. 아직 실행되지 않은 컴포넌트는 회색 표시로 나옵니다.

<p align="center">
  <img src="/images/docs/kubeflow/run-6.png" title="run"/>
</p>

컴포넌트가 실행이 완료되면 초록색 체크 표시가 나옵니다.

<p align="center">
  <img src="/images/docs/kubeflow/run-7.png" title="run"/>
</p>

가장 마지막 컴포넌트를 보면 입력한 Config인 3과 5의 합인 8이 출력된 것을 확인할 수 있습니다.

<p align="center">
  <img src="/images/docs/kubeflow/run-8.png" title="run"/>
</p>
