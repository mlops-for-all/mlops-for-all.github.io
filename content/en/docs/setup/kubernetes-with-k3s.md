---
title: "Setup Kubernetes - K3s"
description: ""
date: 2021-12-02T18:36:04+09:00
lastmod: 2021-12-13T12:00:00+09:00
draft: false
weight: 213
contributors: ["Jongseob Jeon"]
menu:
  docs:
    parent: "setup"
images: []
---


## 1. Prerequisite

## 2. 쿠버네티스 클러스터 셋업

**해당 과정은 서버로 사용하는 데스크탑에서 진행됩니다.**
로컬과 서버가 분리된 경우 꼭 서버에서 설치되도록 확인해 주세요.

k3s 에서는 기본값으로 containerd를 백엔드로 이용해 설치합니다.
하지만 저희는 GPU를 사용하기 위해서 docker를 백엔드로 사용해야 하기 때문에 `--docker` 옵션을 통해 백엔드를 docker로 설치하겠습니다.

```bash
curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION=v1.21.7+k3s1 sh -s - server --disable traefik --disable servicelb --disable local-storage --docker
```

k3s를 설치후 k3s config를 확인합니다

```bash
cat /etc/rancher/k3s/k3s.yaml
```

k3s config를 클러스터의 kubeconfig로 사용하기 위해서 복사합니다.

```bash
mkdir .kube
sudo cp /etc/rancher/k3s/k3s.yaml .kube/config
sudo chown mrx:mrx .kube/config
```

## 3. 쿠버네티스 클라이언트 셋업

이제 클러스터에서 설정한 kubeconfig를 로컬로 이동합니다.
로컬에서는 경로를 `~/.kube/config`로 설정합니다.
정상적으로 작동하는지 확인합니다.

```bash
kubectl get nodes
```

## 4. 쿠버네티스 기본 모듈 설치

k3s를 설치 후에는 서버로 사용할 수 있도록 써드파티들을 설치해주어야 합니다.
위의 k3s installation 과정이 끝났다면 로컬에서 서버를 kubectl 을 통해 관리할 수 있습니다.
**아래 과정은 모두 local에서 이루어집니다.** (kubectl의 context를 잘 확인 후 진행하시기 바랍니다.)

### 4.1) Nvidia Device Plugin

```bash
helm repo add nvdp https://nvidia.github.io/k8s-device-plugin
helm repo update
helm install \
    --version=0.9.0 \
    --generate-name \
    nvdp/nvidia-device-plugin
```

### 4.2) Ingress

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install ingress-nginx/ingress-nginx -g -n ingress-nginx --create-namespace --set controller.service.type='NodePort' --set controller.service.nodePorts.http=32080 --set controller.service.nodePorts.https=32443
```

## 5. 정상 설치 확인
