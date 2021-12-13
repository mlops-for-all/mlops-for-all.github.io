---
title : "Introduction"
description: "Setup Introduction"
lead: ""
# date: 2020-10-06T08:48:23+00:00
# lastmod: 2020-10-06T08:48:23+00:00
draft: false
weight: 201
contributors: ["Jaeyeon Kim"]
menu:
  docs:
    parent: "setup"
images: []
---

## MLOps 시스템 구축해보기

MLOps 를 공부하는 데 있어서 가장 큰 장벽은 MLOps 시스템을 구성해보고 사용해보기가 어렵다는 점입니다. AWS, GCP 등의 퍼블릭 클라우드 혹은 Weight & Bias, neptune.ai 등의 상용 툴을 사용해보기에는 과금에 대한 부담이 존재하고, 처음부터 모든 환경을 혼자서 구성하기에는 어디서부터 시작해야 할 지 막막하게 느껴질 수밖에 없습니다.

이런 이유들로 MLOps 를 선뜻 시작해보지 못하시는 분들을 위해, *모두의 MLOps*에서는 우분투가 설치되는 데스크탑 하나만 준비되어 있다면 MLOps 시스템을 밑바닥부터 구축하고 사용해 볼 수 있는 방법을 다룰 예정입니다.

하지만 MLOps 를 구성하는 요소들을 대표하는 오픈소스를 모두 사용해볼 수는 없기에, **모두의 MLOps**에서는 대표적인 오픈소스만을 설치한 뒤, 서로 연동하여 사용하는 부분을 주로 다룰 예정입니다.

이 글에서 다루는 구성요소가 모두 Standard 를 의미하는 것은 아니며, 여러분의 상황에 맞게 적절한 툴을 취사 선택하시는 것을 권장합니다.

## 구성 요소

이 글에서 만들어 볼 MLOps 시스템의 구성 요소들과 각 버전은 다음 버전에서 검증되었습니다.

원활한 환경에서 테스트하기 위해 서버와 클라이언트를 분리하여 설명드릴 예정입니다. 서버는 쉬고 있는 데스크탑을, 클라이언트는 여러분이 자주 사용하시는 노트북 혹은 데스크탑을 사용하시는 것을 권장드리지만, 꼭 서버와 클라이언트를 분리하실 필요는 없습니다. 데스크탑 하나를 동시에 서버와 클라이언트 용도로 사용하셔도 괜찮습니다.

[TODO] - table 로

### 서버

- Ubuntu : 20.04.3 LTS
- Docker (Server) : 20.10.11
- Nvidia-Driver : 470.86
- Kubernetes : v1.21.7
  - CNI : k8s 설치 tool 에 따라 상이
  - CSI : local-path-provisioner : v0.0.20
  - Nvidia-device-plugin : (Optional)
- Kubeflow : v1.4.0
- MLFlow :
- Seldon-Core :
- Prometheus :
- Grafana :
- Istio :

### 클라이언트

- kubectl : v1.21.7
- helm : v3.7.1
- kustomize : v3.10.0

## Prerequisite

### Computing Spec

모두의 MLOps 를 설치할 서버는 다음과 같은 사양을 만족시키는 것을 권장합니다. 이는 Kubernetes 및 Kubeflow 의 최소 사양에 의존합니다.

- CPU : 6 core
- RAM : 12 GB
- DISK : 50 GB
- GPU : NVIDIA GPU (Optional)
