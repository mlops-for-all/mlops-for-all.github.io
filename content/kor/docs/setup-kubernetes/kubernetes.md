---
title : "2. Setup Kubernetes"
description: "Setup Kubernetes"
date: 2021-12-13
lastmod: 2021-12-13
draft: false
weight: 202
contributors: ["Jaeyeon Kim"]
menu:
  docs:
    parent: "setup-kubernetes"
images: []
---

## Setup Kubernetes Cluster

쿠버네티스를 처음 배우시는 분들에게 첫 진입 장벽은 쿠버네티스 실습 환경을 구축하는 것입니다.

프로덕션 레벨의 쿠버네티스 클러스터를 구축할 수 있게 공식적으로 지원하는 도구는 kubeadm 이지만, 사용자들이 조금 더 쉽게 구축할 수 있도록 도와주는 kubespray, kops 등의 도구도 존재하며, 학습 목적을 위해서 컴팩트한 쿠버네티스 클러스터를 정말 쉽게 구축할 수 있도록 도와주는 k3s, minikube, microk8s, kind 등의 도구도 존재합니다.

각각의 도구는 장단점이 다르기에 사용자마다 선호하는 도구가 다른 점을 고려하여, 본 글에서는 kubeadm, k3s, minikube의 3가지 도구를 활용하여 쿠버네티스 클러스터를 구축하는 방법을 다룹니다.
각 도구에 대한 자세한 비교는 다음 쿠버네티스 [공식 문서](https://kubernetes.io/ko/docs/tasks/tools/)를 확인해주시기를 바랍니다.

*모두의 MLOps*에서 권장하는 툴은 **k3s**로 쿠버네티스 클러스터를 구축할 때 쉽게 할 수 있다는 장점이 있습니다.  
만약 쿠버네티스의 모든 기능을 사용하고 노드 구성까지 활용하고 싶다면 **kubeadm**을 권장해 드립니다.  
minikube는 저희가 설명하는 컴포넌트 외에도 다른 쿠버네티스를 add-on 형식으로 쉽게 설치할 수 있다는 장점이 있습니다.

본 *모두의 MLOps*에서는 구축하게 될 MLOps 구성 요소들을 원활히 사용하기 위해, 각각의 도구를 활용해 쿠버네티스 클러스터를 구축할 때, 추가로 설정해 주어야 하는 부분이 추가되어 있습니다.

Ubuntu OS까지는 설치되어 있는 데스크탑을 k8s cluster로 구축한 뒤, 외부 클라이언트 노드에서 쿠버네티스 클러스터에 접근하는 것을 확인하는 것까지가 본 **Setup Kubernetes**단원의 범위입니다.

자세한 구축 방법은 3가지 도구마다 다르기에 다음과 같은 흐름으로 구성되어 있습니다.

```text
3. Setup Prerequisite
4. Setup Kubernetes
  4.1. with k3s
  4.2. with minikube
  4.3. with kubeadm
5. Setup Kubernetes Modules
```

그럼 이제 각각의 도구를 활용해 쿠버네티스 클러스터를 구축해보겠습니다. 반드시 모든 도구를 사용해 볼 필요는 없으며, 이 중 여러분이 익숙하신 도구를 활용해주시면 충분합니다.
