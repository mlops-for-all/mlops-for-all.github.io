---
title : "[Basic Usage] Pipeline Upload"
description: ""
lead: ""
draft: false
weight: 312
contributors: ["Jongseob Jeon"]
menu:
  docs:
    parent: "kubeflow"
---

이제 우리가 만든 파이프라인을 직접 kubeflow에서 업로드 해 보겠습니다.

## Upload Pipeline

파이프라인을 업로드는 kubeflow 대쉬보드에서 ui를 통해 진행할 수 있습니다.

### 1. Pipelines 탭 선택

<p align="center">
  <img src="/images/docs/kubeflow/pipeline-gui-0.png" title="pipeline-gui"/>
</p>

### 2. Upload Pipeline 선택

<p align="center">
  <img src="/images/docs/kubeflow/pipeline-gui-1.png" title="pipeline-gui"/>
</p>

### 3. Choose file 선택

<p align="center">
  <img src="/images/docs/kubeflow/pipeline-gui-2.png" title="pipeline-gui"/>
</p>

### 4. 생성된 yaml파일 업로드

<p align="center">
  <img src="/images/docs/kubeflow/pipeline-gui-3.png" title="pipeline-gui"/>
</p>

### 5. Create

<p align="center">
  <img src="/images/docs/kubeflow/pipeline-gui-4.png" title="pipeline-gui"/>
</p>

## Upload Pipeline Version

업로드된 파이프라인은 업로드를 통해서 버전을 관리할 수 있습니다. 다만 깃헙과 같은 코드 차원의 버전 관리가 아닌 같은 이름의 파이프라인을 모아서 보여주는 역할을 합니다.
위의 예시에서 파이프라인을 업로드한 경우 다음과 같이 example_pipeline이 생성된 것을 확인할 수 있습니다.

<p align="center">
  <img src="/images/docs/kubeflow/pipeline-gui-5.png" title="pipeline-gui"/>
</p>

클릭하면 다음과 같은 화면이 나옵니다.

<p align="center">
  <img src="/images/docs/kubeflow/pipeline-gui-4.png" title="pipeline-gui"/>
</p>

이제 화면에 나오는 각 메뉴들에 대해서 설명하겠습니다.

- Create Run: 현재 버전의 파이프라인을 실행합니다.
- Upload Version: 파이프라인을 새로 업로드하여서 버전을 올립니다.
- Create Experiment: Experiment를 생성합니다.

> Experiment?
> Kubeflow에서는 실행되는 run을 Experiment단위로 관리를 합니다.

Upload Version을 클릭하면 다음과 같이 파이프라인을 업로드할 수 있는 화면이 생성됩니다.

<p align="center">
  <img src="/images/docs/kubeflow/pipeline-gui-6.png" title="pipeline-gui"/>
</p>

파이프라인을 업로드 합니다.

<p align="center">
  <img src="/images/docs/kubeflow/pipeline-gui-7.png" title="pipeline-gui"/>
</p>

업로드 된 경우 다음과 같이 파이프라인 버전을 확인할 수 있습니다.

<p align="center">
  <img src="/images/docs/kubeflow/pipeline-gui-8.png" title="pipeline-gui"/>
</p>
