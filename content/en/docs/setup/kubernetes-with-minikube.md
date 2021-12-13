---
title: "Setup Kubernetes - Minikube"
description: ""
date: 2021-12-02T18:36:04+09:00
lastmod: 2021-12-02T18:36:04+09:00
draft: false
weight: 212
contributors: ["Jaeyeon Kim"]
menu:
  docs:
    parent: "setup"
images: []
---

## 1. Prerequisite

쿠버네티스 클러스터를 구축하기에 앞서, 필요한 구성요소들을 **서버에** 설치합니다.

[Setup Prerequisite]({{< relref "docs/setup/setup-pre-requisite.md" >}})을 참고하여 Kubernetes를 설치하기 전에 필요한 요소들을 **서버에** 설치해 주시기 바랍니다.

### Minikube binary

Minikube 를 사용하기 위해, v1.24.0 버전의 Minikube 바이너리를 설치합니다.

```text
wget https://github.com/kubernetes/minikube/releases/download/v1.24.0/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

정상적으로 설치되었는지 확인합니다.

```text
minikube version
```

다음과 같은 메시지가 보이면 정상적으로 설치된 것을 의미합니다.

```text
mlops@ubuntu:~$ minikube version
minikube version: v1.24.0
commit: 76b94fb3c4e8ac5062daf70d60cf03ddcc0a741b
```

## 2. 쿠버네티스 클러스터 셋업

이제 Minikube 를 활용해 쿠버네티스 클러스터를 **서버에** 구축합니다.
GPU 의 원활한 사용과, 서버-클라이언트 간 통신을 간편하게 수행하기 위해, Minikube 는 `driver=none` 옵션을 활용하여 실행합니다. `driver=none` 옵션은 root user 로 실행해야함에 주의바랍니다.

root user 로 전환합니다.

```text
sudo su
```

`minikube start` 를 수행하여 쿠버네티스 클러스터 구축을 진행합니다. Kubeflow 의 원활한 사용을 위해, 쿠버네티스 버전은 v1.21.7 로 지정하여 구축하며 `--extra-config` 를 추가합니다.

```text
minikube start --driver=none \
  --kubernetes-version=v1.21.7 \
  --extra-config=apiserver.service-account-signing-key-file=/var/lib/minikube/certs/sa.key \
  --extra-config=apiserver.service-account-issuer=kubernetes.default.svc
```

### Disable default addons

Minikube 를 설치하면 Default 로 설치되는 addon 이 존재합니다. 이 중 저희가 사용하지 않을 addon 을 비활성화합니다.

```text
minikube addons disable storage-provisioner
minikube addons disable default-storageclass
```

모든 addon 이 비활성화된 것을 확인합니다.

```text
minikube addons list
```

다음과 같은 메시지가 보이면 정상적으로 설치된 것을 의미합니다.

```text
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
**클라이언트**와 **서버** 노드가 분리되지 않은 경우에는 root user 로 모든 작업을 진행해야 함에 주의바랍니다.

### kubectl

kubectl 은 쿠버네티스 클러스터에게 API 를 요청할 때, 자주 사용하는 Client 툴 중 하나입니다.

현재 폴더에 kubectl v1.21.7 버전을 다운받습니다.

```text
curl -LO https://dl.k8s.io/release/v1.21.7/bin/linux/amd64/kubectl
```

kubectl 을 사용할 수 있도록 파일의 권한과 위치를 변경합니다.

```text
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

정상적으로 설치되었는지 확인합니다.

```text
kubectl --help
```

다음과 같은 메시지가 보이면 정상적으로 설치된 것을 의미합니다.

```text
kubectl controls the Kubernetes cluster manager.

 Find more information at:
https://kubernetes.io/docs/reference/kubectl/overview/

Basic Commands (Beginner):
  create        Create a resource from a file or from stdin
  expose        Take a replication controller, service, deployment or pod and
expose it as a new Kubernetes service
  run           Run a particular image on the cluster
  set           Set specific features on objects
...
```

## 4. 쿠버네티스 기본 모듈 설치

이제부터는 쿠버네티스 클러스터에 필요한 기본적인 모듈을 설치합니다. 쿠버네티스 관련 명령은 모두 **클라이언트**에서 수행할 것입니다. 따라서 명령을 원활히 수행하기 위해서, 우선 kubernetes 의 관리자 인증 정보를 **클라이언트**로 가져옵니다.

우선 서버에서 다음 명령을 수행합니다.

```text
minikube kubectl -- config view --flatten
```

다음과 같은 정보가 출력될 것입니다. --- KUBECONFIG

```text
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

클라이언트에서 다음을 수행합니다.

```text
mkdir -p /home/$USER/.kube
vi /home/$USER/.kube/config
```

해당 파일에 위의 KUBECONFIG 정보를 붙여넣습니다. (기존에 해당 파일이 있는 경우에는 주의하시기 바랍니다. 여러 개의 kubeconfig 파일 혹은 여러 개의 kubecontext 를 효율적으로 관리하는 방법은 다음과 같은 문서를 참고하시면 좋습니다. : https://dev.to/aabiseverywhere/configuring-multiple-kubeconfig-on-your-machine-59eo, https://github.com/ahmetb/kubectx)

클라이언트에서 다음을 수행하여 정상적으로 서버와 통신이 가능한지 확인합니다.

```text
kubectl get nodes
```

다음과 같은 정보가 정상적으로 출력되어야 합니다.

```text
NAME     STATUS   ROLES                  AGE    VERSION
ubuntu   Ready    control-plane,master   2d3h   v1.21.7
```

정상적으로 출력되지 않는 경우, KUBECONFIG 파일의 server IP 주소로 ping 이 가는지 확인해보시기 바랍니다.

### CNI Plugin

CNI Plugin 은 kubernetes 내의 네트워크를 담당하는 모듈입니다. Minikube 설치 시에는 추가적인 CNI Plugin 설치가 필요하지 않으므로 생략합니다.

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

- https://docs.docker.com/engine/install/ubuntu/
