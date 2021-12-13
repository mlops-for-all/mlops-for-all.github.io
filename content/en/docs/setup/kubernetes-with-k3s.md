---
title: "4.3. Setup Kubernetes - K3s"
description: ""
date: 2021-12-13
lastmod: 2021-12-13
draft: false
weight: 223
contributors: ["Jongseob Jeon"]
menu:
  docs:
    parent: "setup"
images: []
---

**해당 과정은 클러스터로 사용하는 데스크탑에서 진행됩니다.**
로컬과 클러스터가 분리된 경우 꼭 클러스터에서 설치되도록 확인해 주세요.

## 1. Prerequisite

k3s 에서는 기본값으로 containerd를 백엔드로 이용해 설치합니다.
하지만 저희는 GPU를 사용하기 위해서 docker를 백엔드로 사용해야 하기 때문에 `--docker` 옵션을 통해 백엔드를 docker로 설치하겠습니다.

```text
curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION=v1.21.7+k3s1 sh -s - server --disable traefik --disable servicelb --disable local-storage --docker
```

k3s를 설치후 k3s config를 확인합니다

```text
cat /etc/rancher/k3s/k3s.yaml
```

## 2. 쿠버네티스 클러스터 셋업

k3s config를 클러스터의 kubeconfig로 사용하기 위해서 복사합니다.

```text
mkdir .kube
sudo cp /etc/rancher/k3s/k3s.yaml .kube/config
sudo chown mrx:mrx .kube/config
```

## 3. 쿠버네티스 클라이언트 셋업

이제 클러스터에서 설정한 kubeconfig를 로컬로 이동합니다.
로컬에서는 경로를 `~/.kube/config`로 설정합니다.
정상적으로 작동하는지 확인합니다.

## 4. 쿠버네티스 기본 모듈 설치

[Setup Kubernetes Modules]({{< relref "docs/setup/setup-kubernetes-module.md" >}})을 참고하여 다음 컴포넌트들을 설치해 주시기 바랍니다.

- helm
- kustomize
- CSI plugin
- [Optional] nvidia-docker, nvidia-device-plugin

## 5. 정상 설치 확인

최종적으로 node 가 Ready 인지, OS, Docker, Kubernetes 버전을 확인합니다.

```text
kubectl get nodes -o wide
```

다음과 같은 메시지가 보이면 정상적으로 설치된 것을 의미합니다.

```text
NAME     STATUS   ROLES                  AGE     VERSION   INTERNAL-IP    EXTERNAL-IP   OS-IMAGE             KERNEL-VERSION     CONTAINER-RUNTIME
ubuntu   Ready    control-plane,master   2d23h   v1.21.7   192.168.0.75   <none>        Ubuntu 20.04.3 LTS   5.4.0-91-generic   docker://20.10.11
```

## 6. References

- [https://rancher.com/docs/k3s/latest/en/installation/install-options/](https://rancher.com/docs/k3s/latest/en/installation/install-options/)
