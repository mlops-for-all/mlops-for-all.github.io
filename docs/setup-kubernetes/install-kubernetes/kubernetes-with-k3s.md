---
title: "4.1. K3s"
description: ""
sidebar_position: 1
date: 2021-12-13
lastmod: 2021-12-20
draft: false
weight: 221
contributors: ["Jongseob Jeon"]
menu:
  docs:
    parent:../setup-kubernetes"
images: []
---

## 1. Prerequisite

쿠버네티스 클러스터를 구축하기에 앞서, 필요한 구성 요소들을 **클러스터에** 설치합니다.

[Install Prerequisite](../../setup-kubernetes/install-kubernetes-module.md)을 참고하여 Kubernetes를 설치하기 전에 필요한 요소들을 **클러스터에** 설치해 주시기 바랍니다.

k3s 에서는 기본값으로 containerd를 백엔드로 이용해 설치합니다.
하지만 저희는 GPU를 사용하기 위해서 docker를 백엔드로 사용해야 하므로 `--docker` 옵션을 통해 백엔드를 docker로 설치하겠습니다.

```text
curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION=v1.21.7+k3s1 sh -s - server --disable traefik --disable servicelb --disable local-storage --docker
```

k3s를 설치 후 k3s config를 확인합니다

```text
sudo cat /etc/rancher/k3s/k3s.yaml
```

정상적으로 설치되면 다음과 같은 항목이 출력됩니다.  
(보안 문제와 관련된 키들은 <...>로 가렸습니다.)

```text
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data:
    <...>
    server: https://127.0.0.1:6443
  name: default
contexts:
- context:
    cluster: default
    user: default
  name: default
current-context: default
kind: Config
preferences: {}
users:
- name: default
  user:
    client-certificate-data:
    <...>
    client-key-data:
    <...>
```

## 2. 쿠버네티스 클러스터 셋업

k3s config를 클러스터의 kubeconfig로 사용하기 위해서 복사합니다.

```text
mkdir .kube
sudo cp /etc/rancher/k3s/k3s.yaml .kube/config
```

복사된 config 파일에 user가 접근할 수 있는 권한을 줍니다.

```text
sudo chown $USER:$USER .kube/config
```

## 3. 쿠버네티스 클라이언트 셋업

이제 클러스터에서 설정한 kubeconfig를 로컬로 이동합니다.
로컬에서는 경로를 `~/.kube/config`로 설정합니다.

처음 복사한 config 파일에는 server ip가 `https://127.0.0.1:6443` 으로 되어 있습니다.  
이 값을 클러스터의 ip에 맞게 수정합니다.  
(이번 페이지에서 사용하는 클러스터의 ip에 맞춰서 `https://192.168.0.19:6443` 으로 수정했습니다.)

```text
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data:
    <...>
    server: https://192.168.0.19:6443
  name: default
contexts:
- context:
    cluster: default
    user: default
  name: default
current-context: default
kind: Config
preferences: {}
users:
- name: default
  user:
    client-certificate-data:
    <...>
    client-key-data:
    <...>
```

## 4. 쿠버네티스 기본 모듈 설치

[Setup Kubernetes Modules](../../setup-kubernetes/install-kubernetes-module.md)을 참고하여 다음 컴포넌트들을 설치해 주시기 바랍니다.

- helm
- kustomize
- CSI plugin
- [Optional] nvidia-docker, nvidia-device-plugin

## 5. 정상 설치 확인

최종적으로 node가 Ready 인지, OS, Docker, Kubernetes 버전을 확인합니다.

```text
kubectl get nodes -o wide
```

다음과 같은 메시지가 보이면 정상적으로 설치된 것을 의미합니다.

```text
NAME    STATUS   ROLES                  AGE   VERSION        INTERNAL-IP    EXTERNAL-IP   OS-IMAGE             KERNEL-VERSION     CONTAINER-RUNTIME
ubuntu   Ready    control-plane,master   11m   v1.21.7+k3s1   192.168.0.19   <none>        Ubuntu 20.04.3 LTS   5.4.0-91-generic   docker://20.10.11
```

## 6. References

- [https://rancher.com/docs/k3s/latest/en/installation/install-options/](https://rancher.com/docs/k3s/latest/en/installation/install-options/)
