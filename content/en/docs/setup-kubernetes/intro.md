---
title : "1. Introduction"
description: "Setup Introduction"
lead: ""
date: 2021-12-13
lastmod: 2021-12-13
draft: false
weight: 201
contributors: ["Jaeyeon Kim"]
menu:
  docs:
    parent: "setup-kubernetes"
images: []
---

## MLOps 시스템 구축해보기

MLOps 를 공부하는 데 있어서 가장 큰 장벽은 MLOps 시스템을 구성해보고 사용해보기가 어렵다는 점입니다. AWS, GCP 등의 퍼블릭 클라우드 혹은 Weight & Bias, neptune.ai 등의 상용 툴을 사용해보기에는 과금에 대한 부담이 존재하고, 처음부터 모든 환경을 혼자서 구성하기에는 어디서부터 시작해야 할지 막막하게 느껴질 수밖에 없습니다.

이런 이유들로 MLOps 를 선뜻 시작해보지 못하시는 분들을 위해, *모두의 MLOps*에서는 우분투가 설치되는 데스크탑 하나만 준비되어 있다면 MLOps 시스템을 밑바닥부터 구축하고 사용해 볼 수 있는 방법을 다룰 예정입니다.

하지만 [MLOps의 구성요소]({{< relref "docs/introduction/component.md" >}})에서 설명하는 요소들을 모두 사용해볼 수는 없기에, *모두의 MLOps*에서는 대표적인 오픈소스만을 설치한 뒤, 서로 연동하여 사용하는 부분을 주로 다룰 예정입니다.

*모두의 MLOps*에서 설치하는 오픈소스가 표준을 의미하는 것은 아니며, 여러분의 상황에 맞게 적절한 툴을 취사선택하는 것을 권장합니다.

## 구성 요소

이 글에서 만들어 볼 MLOps 시스템의 구성 요소들과 각 버전은 아래와 같은 환경에서 검증되었습니다.

원활한 환경에서 테스트하기 위해 **클러스터 (혹은 클러스터)** 와 **클라이언트**를 분리하여 설명해 드릴 예정입니다.  
**클러스터** 는 우분투가 설치되어 있는 데스크탑을 의미합니다.  
**클라이언트** 는 노트북 혹은 클러스터가 설치되어 있는 데스크탑 외의 클라이언트로 사용할 수 있는 다른 데스크탑을 사용하는 것을 권장합니다.  
하지만 두 대의 머신을 준비할 수 없다면 데스크탑 하나를 동시에 클러스터와 클라이언트 용도로 사용하셔도 괜찮습니다.

### 클러스터

#### 1. Software

아래는 클러스터에 설치해야 할 소프트웨어 목록입니다.

| Software        | Version     |
| --------------- | ----------- |
| Ubuntu          | 20.04.3 LTS |
| Docker (Server) | 20.10.11    |
| Nvidia-Driver   | 470.86      |
| Kubernetes      | v1.21.7     |
| Kubeflow        | v1.4.0      |
| MLFlow          | v1.21.0     |

#### 2. Helm Chart

아래는 Helm을 이용해 설치되어야 할 써드파티 소프트웨어 목록입니다.

| Helm Chart Repo Name                            | Version     |
| ----------------------------------------------- | ----------- |
| datawire/ambassador                             | v6.9.3      |
| prometheus-community/kube-prometheus-stack      | v21.0.0     |

### 클라이언트

클라이언트는 MacOS (Intel CPU), Ubuntu 20.04 에서 검증되었습니다.

| Software        | Version     |
| --------------- | ----------- |
| kubectl         | v1.21.7     |
| helm            | v3.7.1      |
| kustomize       | v3.10.0     |

### Minimum System Requirements

모두의 MLOps 를 설치할 클러스터는 다음과 같은 사양을 만족시키는 것을 권장합니다.  
이는 Kubernetes 및 Kubeflow 의 권장 사양에 의존합니다.

- CPU : 6 core
- RAM : 12 GB
- DISK : 50 GB
- GPU : NVIDIA GPU (Optional)
