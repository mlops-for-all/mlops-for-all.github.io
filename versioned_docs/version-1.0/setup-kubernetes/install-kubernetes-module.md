---
title: "5. Install Kubernetes Modules"
description: "Install Helm, Kustomize"
sidebar_position: 5
date: 2021-12-13
lastmod: 2021-12-20
contributors: ["Jaeyeon Kim"]
---

## Setup Kubernetes Modules

이번 페이지에서는 클러스터에서 사용할 모듈을 클라이언트 노드에서 설치하는 과정에 관해서 설명합니다.  
앞으로 소개되는 과정은 모두 **클라이언트 노드**에서 진행됩니다.

## Helm

Helm은 쿠버네티스 패키지와 관련된 자원을 한 번에 배포하고 관리할 수 있게 도와주는 패키지 매니징 도구 중 하나입니다.

1. 현재 폴더에 Helm v3.7.1 버전을 내려받습니다.

- For Linux amd64

  ```bash
  wget https://get.helm.sh/helm-v3.7.1-linux-amd64.tar.gz
  ```

- 다른 OS는 [공식 홈페이지](https://github.com/helm/helm/releases/tag/v3.7.1)를 참고하시어, 클라이언트 노드의 OS와 CPU에 맞는 바이너리의 다운 경로를 확인하시기 바랍니다.

2. helm을 사용할 수 있도록 압축을 풀고, 파일의 위치를 변경합니다.

  ```bash
  tar -zxvf helm-v3.7.1-linux-amd64.tar.gz
  sudo mv linux-amd64/helm /usr/local/bin/helm
  ```

3. 정상적으로 설치되었는지 확인합니다.

  ```bash
  helm help
  ```

  다음과 같은 메시지가 보이면 정상적으로 설치된 것을 의미합니다.

  ```bash
  The Kubernetes package manager

  Common actions for Helm:

  - helm search:    search for charts
  - helm pull:      download a chart to your local directory to view
  - helm install:   upload the chart to Kubernetes
  - helm list:      list releases of charts

  Environment variables:

  | Name                     | Description                                                         |
  |--------------------------|---------------------------------------------------------------------|
  | $HELM_CACHE_HOME         | set an alternative location for storing cached files.               |
  | $HELM_CONFIG_HOME        | set an alternative location for storing Helm configuration.         |
  | $HELM_DATA_HOME          | set an alternative location for storing Helm data.                  |

  ...
  ```

## Kustomize

kustomize 또한 여러 쿠버네티스 리소스를 한 번에 배포하고 관리할 수 있게 도와주는 패키지 매니징 도구 중 하나입니다.

1. 현재 폴더에 kustomize v3.10.0 버전의 바이너리를 다운받습니다.

- For Linux amd64

  ```bash
  wget https://github.com/kubernetes-sigs/kustomize/releases/download/kustomize%2Fv3.10.0/kustomize_v3.10.0_linux_amd64.tar.gz
  ```

- 다른 OS는 [kustomize/v3.10.0](https://github.com/kubernetes-sigs/kustomize/releases/tag/kustomize%2Fv3.10.0)에서 확인 후 다운로드 받습니다.

2. kustomize 를 사용할 수 있도록 압축을 풀고, 파일의 위치를 변경합니다.

  ```bash
  tar -zxvf kustomize_v3.10.0_linux_amd64.tar.gz
  sudo mv kustomize /usr/local/bin/kustomize
  ```

3. 정상적으로 설치되었는지 확인합니다.

  ```bash
  kustomize help
  ```

  다음과 같은 메시지가 보이면 정상적으로 설치된 것을 의미합니다.

  ```bash
  Manages declarative configuration of Kubernetes.
  See https://sigs.k8s.io/kustomize

  Usage:
    kustomize [command]

  Available Commands:
    build                     Print configuration per contents of kustomization.yaml
    cfg                       Commands for reading and writing configuration.
    completion                Generate shell completion script
    create                    Create a new kustomization in the current directory
    edit                      Edits a kustomization file
    fn                        Commands for running functions against configuration.
  ...
  ```

## CSI Plugin : Local Path Provisioner

1. CSI Plugin은 kubernetes 내의 스토리지를 담당하는 모듈입니다. 단일 노드 클러스터에서 쉽게 사용할 수 있는 CSI Plugin인 Local Path Provisioner를 설치합니다.

  ```bash
  kubectl apply -f https://raw.githubusercontent.com/rancher/local-path-provisioner/v0.0.20/deploy/local-path-storage.yaml
  ```

  다음과 같은 메시지가 보이면 정상적으로 설치된 것을 의미합니다.

  ```bash
  namespace/local-path-storage created
  serviceaccount/local-path-provisioner-service-account created
  clusterrole.rbac.authorization.k8s.io/local-path-provisioner-role created
  clusterrolebinding.rbac.authorization.k8s.io/local-path-provisioner-bind created
  deployment.apps/local-path-provisioner created
  storageclass.storage.k8s.io/local-path created
  configmap/local-path-config created
  ```

2. 또한, 다음과 같이 local-path-storage namespace 에 provisioner pod이 Running 인지 확인합니다.

  ```bash
  kubectl -n local-path-storage get pod
  ```

  정상적으로 수행되면 아래와 같이 출력됩니다.

  ```bash
  NAME                                     READY     STATUS    RESTARTS   AGE
  local-path-provisioner-d744ccf98-xfcbk   1/1       Running   0          7m
  ```

4. 다음을 수행하여 default storage class로 변경합니다.

  ```bash
  kubectl patch storageclass local-path  -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'
  ```

  정상적으로 수행되면 아래와 같이 출력됩니다.

  ```bash
  storageclass.storage.k8s.io/local-path patched
  ```

5. default storage class로 설정되었는지 확인합니다.

  ```bash
  kubectl get sc
  ```

  다음과 같이 NAME에 `local-path (default)` 인 storage class가 존재하는 것을 확인합니다.

  ```bash
  NAME                   PROVISIONER             RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
  local-path (default)   rancher.io/local-path   Delete          WaitForFirstConsumer   false                  2h
  ```
