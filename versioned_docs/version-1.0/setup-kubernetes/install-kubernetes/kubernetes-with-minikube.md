---
title: "4.2. Minikube"
description: ""
sidebar_position: 2
date: 2021-12-13
lastmod: 2021-12-20
contributors: ["Jaeyeon Kim"]
---

## 1. Prerequisite

쿠버네티스 클러스터를 구축하기에 앞서, 필요한 구성 요소들을 **클러스터에** 설치합니다.

[Install Prerequisite](../../setup-kubernetes/install-prerequisite.md)을 참고하여 Kubernetes를 설치하기 전에 필요한 요소들을 **클러스터에** 설치해 주시기 바랍니다.

### Minikube binary

Minikube를 사용하기 위해, v1.24.0 버전의 Minikube 바이너리를 설치합니다.

```bash
wget https://github.com/kubernetes/minikube/releases/download/v1.24.0/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

정상적으로 설치되었는지 확인합니다.

```bash
minikube version
```

다음과 같은 메시지가 보이면 정상적으로 설치된 것을 의미합니다.

```bash
mlops@ubuntu:~$ minikube version
minikube version: v1.24.0
commit: 76b94fb3c4e8ac5062daf70d60cf03ddcc0a741b
```

## 2. 쿠버네티스 클러스터 셋업

이제 Minikube를 활용해 쿠버네티스 클러스터를 **클러스터에** 구축합니다.
GPU 의 원활한 사용과 클러스터-클라이언트 간 통신을 간편하게 수행하기 위해, Minikube 는 `driver=none` 옵션을 활용하여 실행합니다. `driver=none` 옵션은 root user 로 실행해야 함에 주의 바랍니다.

root user로 전환합니다.

```bash
sudo su
```

`minikube start`를 수행하여 쿠버네티스 클러스터 구축을 진행합니다. Kubeflow의 원활한 사용을 위해, 쿠버네티스 버전은 v1.21.7로 지정하여 구축하며 `--extra-config`를 추가합니다.

```bash
minikube start --driver=none \
  --kubernetes-version=v1.21.7 \
  --extra-config=apiserver.service-account-signing-key-file=/var/lib/minikube/certs/sa.key \
  --extra-config=apiserver.service-account-issuer=kubernetes.default.svc
```

### Disable default addons

Minikube를 설치하면 Default로 설치되는 addon이 존재합니다. 이 중 저희가 사용하지 않을 addon을 비활성화합니다.

```bash
minikube addons disable storage-provisioner
minikube addons disable default-storageclass
```

모든 addon이 비활성화된 것을 확인합니다.

```bash
minikube addons list
```

다음과 같은 메시지가 보이면 정상적으로 설치된 것을 의미합니다.

```bash
root@ubuntu:/home/mlops# minikube addons list
|-----------------------------|----------|--------------|-----------------------|
|         ADDON NAME          | PROFILE  |    STATUS    |      MAINTAINER       |
|-----------------------------|----------|--------------|-----------------------|
| ambassador                  | minikube | disabled     | unknown (third-party) |
| auto-pause                  | minikube | disabled     | google                |
| csi-hostpath-driver         | minikube | disabled     | kubernetes            |
| dashboard                   | minikube | disabled     | kubernetes            |
| default-storageclass        | minikube | disabled     | kubernetes            |
| efk                         | minikube | disabled     | unknown (third-party) |
| freshpod                    | minikube | disabled     | google                |
| gcp-auth                    | minikube | disabled     | google                |
| gvisor                      | minikube | disabled     | google                |
| helm-tiller                 | minikube | disabled     | unknown (third-party) |
| ingress                     | minikube | disabled     | unknown (third-party) |
| ingress-dns                 | minikube | disabled     | unknown (third-party) |
| istio                       | minikube | disabled     | unknown (third-party) |
| istio-provisioner           | minikube | disabled     | unknown (third-party) |
| kubevirt                    | minikube | disabled     | unknown (third-party) |
| logviewer                   | minikube | disabled     | google                |
| metallb                     | minikube | disabled     | unknown (third-party) |
| metrics-server              | minikube | disabled     | kubernetes            |
| nvidia-driver-installer     | minikube | disabled     | google                |
| nvidia-gpu-device-plugin    | minikube | disabled     | unknown (third-party) |
| olm                         | minikube | disabled     | unknown (third-party) |
| pod-security-policy         | minikube | disabled     | unknown (third-party) |
| portainer                   | minikube | disabled     | portainer.io          |
| registry                    | minikube | disabled     | google                |
| registry-aliases            | minikube | disabled     | unknown (third-party) |
| registry-creds              | minikube | disabled     | unknown (third-party) |
| storage-provisioner         | minikube | disabled     | kubernetes            |
| storage-provisioner-gluster | minikube | disabled     | unknown (third-party) |
| volumesnapshots             | minikube | disabled     | kubernetes            |
|-----------------------------|----------|--------------|-----------------------|
```

## 3. 쿠버네티스 클라이언트 셋업

이번에는 **클라이언트**에 쿠버네티스의 원활한 사용을 위한 도구를 설치합니다.
**클라이언트**와 **클러스터** 노드가 분리되지 않은 경우에는 root user로 모든 작업을 진행해야 함에 주의바랍니다.

**클라이언트**와 **클러스터** 노드가 분리된 경우, 우선 kubernetes의 관리자 인증 정보를 **클라이언트**로 가져옵니다.

1. **클러스터**에서 config를 확인합니다.

  ```bash
  # 클러스터 노드
  minikube kubectl -- config view --flatten
  ```

2. 다음과 같은 정보가 출력됩니다.

  ```bash
  apiVersion: v1
  clusters:
  - cluster:
      certificate-authority-data: LS0tLS1CRUd....
      extensions:
      - extension:
          last-update: Mon, 06 Dec 2021 06:55:46 UTC
          provider: minikube.sigs.k8s.io
          version: v1.24.0
        name: cluster_info
      server: https://192.168.0.62:8443
    name: minikube
  contexts:
  - context:
      cluster: minikube
      extensions:
      - extension:
          last-update: Mon, 06 Dec 2021 06:55:46 UTC
          provider: minikube.sigs.k8s.io
          version: v1.24.0
        name: context_info
      namespace: default
      user: minikube
    name: minikube
  current-context: minikube
  kind: Config
  preferences: {}
  users:
  - name: minikube
    user:
      client-certificate-data: LS0tLS1CRUdJTi....
      client-key-data: LS0tLS1CRUdJTiBSU0....
  ```

3. **클라이언트** 노드에서 `.kube` 폴더를 생성합니다.

  ```bash
  # 클라이언트 노드
  mkdir -p /home/$USER/.kube
  ```

4. 해당 파일에 2. 에서 출력된 정보를 붙여넣은 뒤 저장합니다.
  
  ```bash
  vi /home/$USER/.kube/config
  ```

## 4. 쿠버네티스 기본 모듈 설치

[Setup Kubernetes Modules](../../setup-kubernetes/install-kubernetes-module.md)을 참고하여 다음 컴포넌트들을 설치해 주시기 바랍니다.

- helm
- kustomize
- CSI plugin
- [Optional] nvidia-docker, nvidia-device-plugin

## 5. 정상 설치 확인

최종적으로 node가 Ready 인지, OS, Docker, Kubernetes 버전을 확인합니다.

```bash
kubectl get nodes -o wide
```

다음과 같은 메시지가 보이면 정상적으로 설치된 것을 의미합니다.

```bash
NAME     STATUS   ROLES                  AGE     VERSION   INTERNAL-IP    EXTERNAL-IP   OS-IMAGE             KERNEL-VERSION     CONTAINER-RUNTIME
ubuntu   Ready    control-plane,master   2d23h   v1.21.7   192.168.0.75   <none>        Ubuntu 20.04.3 LTS   5.4.0-91-generic   docker://20.10.11
```
