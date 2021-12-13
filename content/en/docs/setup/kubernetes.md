---
title : "Setup Kubernetes"
description: "Setup Kubernetes"
date: 2020-10-06T08:48:23+00:00
lastmod: 2020-10-06T08:48:23+00:00
draft: false
weight: 210
contributors: ["Jaeyeon Kim"]
menu:
  docs:
    parent: "setup"
images: []
---

## Setup Kubernetes Cluster

쿠버네티스를 처음 배우시는 분들에게 첫 진입 장벽은 쿠버네티스 실습 환경을 구축하는 것입니다.

프로덕션 레벨의 쿠버네티스 클러스터를 구축할 수 있게 공식적으로 지원하는 도구는 kubeadm 이지만, 사용자들이 조금 더 쉽게 구축할 수 있도록 도와주는 kubespray, kops 등의 도구도 존재하며, 학습 목적을 위해서 컴팩트한 쿠버네티스 클러스터를 정말 쉽게 구축할 수 있도록 도와주는 k3s, minikube, microk8s, kind 등의 도구도 존재합니다.

각각의 도구는 장단점이 다르기에 사용자마다 선호하는 도구가 다른 점을 고려하여, 본 글에서는 kubeadm, k3, minikube 의 3 가지 도구를 활용하여 쿠버네티스 클러스터를 구축하는 방법을 다룹니다.
각 도구에 대한 자세한 비교는 다음 쿠버네티스 [공식 문서]((https://kubernetes.io/ko/docs/tasks/tools/))를 확인해주시기 바랍니다.

본 **모두의 MLOps**에서는 구축하게 될 MLOps 구성 요소들을 원활히 사용하기 위해, 각각의 도구를 활용해 쿠버네티스 클러스터를 구축할 때, 추가적으로 설정해주어야 하는 부분이 추가되어 있습니다.

Ubuntu OS 까지는 설치되어 있는 데스크탑을 k8s cluster 로 구축한 뒤, 외부 클라이언트 노드에서 쿠버네티스 클러스터에 접근하는 것을 확인하는 것까지가 본 **Setup Kubernetes**단원의 범위입니다.

자세한 구축 방법은 3 가지 도구마다 다르지만 모두 다음과 같은 흐름으로 구성되어 있습니다.

```text
1. Prerequisite

2. 쿠버네티스 클러스터 셋업

3. 쿠버네티스 클라이언트 셋업

4. 쿠버네티스 기본 모듈 설치

5. 정상 설치 확인
```

그럼 이제 각각의 도구를 활용해 쿠버네티스 클러스터를 구축해보겠습니다. 반드시 모든 도구를 사용해 볼 필요는 없으며, 이 중 여러분이 익숙하신 도구를 활용해주시면 충분합니다.