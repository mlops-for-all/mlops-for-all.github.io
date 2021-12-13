---
title: "5. Setup Kubernetes Modules"
description: "Install Helm, Kustomize"
date: 2021-12-13
lastmod: 2021-12-13
draft: false
weight: 230
contributors: ["Jaeyeon Kim"]
menu:
  docs:
    parent: "setup-kubernetes"
images: []
---

## Helm

Helm 은 쿠버네티스 패키지와 관련된 리소스를 한 번에 배포하고 관리할 수 있게 도와주는 패키지 매니징 도구 중 하나입니다.

1. 현재 폴더에 Helm v3.7.1 버전을 다운받습니다.

  ```text
  wget https://get.helm.sh/helm-v3.7.1-linux-amd64.tar.gz
  ```

2. helm 을 사용할 수 있도록 압축을 풀고, 파일의 위치를 변경합니다.

  ```text
  tar -zxvf helm-v3.5.4-linux-amd64.tar.gz
  sudo mv linux-amd64/helm /usr/local/bin/helm
  ```

3. 정상적으로 설치되었는지 확인합니다.

  ```text
  helm help
  ```

  다음과 같은 메시지가 보이면 정상적으로 설치된 것을 의미합니다.

  ```text
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

1. 현재 폴더에 kustomize v3.10.0 버전을 다운받습니다.

  ```text
  wget https://github.com/kubernetes-sigs/kustomize/releases/download/kustomize%2Fv3.10.0/kustomize_v3.10.0_linux_amd64.tar.gz
  ```

2. kustomize 를 사용할 수 있도록 압축을 풀고, 파일의 위치를 변경합니다.

  ```text
  tar -zxvf kustomize_v3.10.0_linux_amd64.tar.gz
  sudo mv kustomize_3.2.0_linux_amd64 /usr/local/bin/kustomize
  ```

3. 정상적으로 설치되었는지 확인합니다.

  ```text
  kustomize help
  ```

  다음과 같은 메시지가 보이면 정상적으로 설치된 것을 의미합니다.

  ```text
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

1. CSI Plugin 은 kubernetes 내의 스토리지를 담당하는 모듈입니다. 단일 노드 클러스터에서 쉽게 사용할 수 있는 CSI Plugin 인 Local Path Provisioner 를 설치합니다.

  ```text
  kubectl apply -f https://raw.githubusercontent.com/rancher/local-path-provisioner/v0.0.20/deploy/local-path-storage.yaml
  ```

  다음과 같은 메시지가 보이면 정상적으로 설치된 것을 의미합니다.

  ```text
  namespace/local-path-storage created
  serviceaccount/local-path-provisioner-service-account created
  clusterrole.rbac.authorization.k8s.io/local-path-provisioner-role created
  clusterrolebinding.rbac.authorization.k8s.io/local-path-provisioner-bind created
  deployment.apps/local-path-provisioner created
  storageclass.storage.k8s.io/local-path created
  configmap/local-path-config created
  ```

2. 또한, 다음과 같이 local-path-storage namespace 에 provisioner pod 가 Running 인지 확인합니다.

  ```text
  kubectl -n local-path-storage get pod
  ```

  정상적으로 수행할 경우 아래와 같이 출력됩니다.

  ```text
  NAME                                     READY     STATUS    RESTARTS   AGE
  local-path-provisioner-d744ccf98-xfcbk   1/1       Running   0          7m
  ```

4. 다음을 수행하여 default storage class 로 변경합니다.

  ```text
  kubectl patch storageclass local-path  -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'
  ```

5. default storage class 로 설정되었는지 확인합니다.

  ```text
  kubectl get sc
  ```

  다음과 같이 NAME 에 `local-path (default)` 인 storage class 가 존재하는 것을 확인합니다.

  ```text
  NAME                   PROVISIONER             RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
  local-path (default)   rancher.io/local-path   Delete          WaitForFirstConsumer   false                  2h
  ```
