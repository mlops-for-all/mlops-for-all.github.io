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

### Docker

apt 패키지 매니저를 업데이트하고, Prerequisite 패키지들을 설치합니다.

```sh
sudo apt-get update && sudo apt-get install ca-certificates curl gnupg lsb-release
```

도커의 공식 GPG key 를 추가합니다.

```sh
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```

apt 패키지 매니저로 도커를 설치할 때, stable Repository 에서 받아오도록 설정합니다.

```sh
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

현재 설치 가능한 도커 버전을 확인합니다.

```sh
apt-cache madison docker-ce
```

`5:20.10.11~3-0~ubuntu-focal` 버전이 있는지 확인하고, 해당 버전의 도커를 설치합니다.

```sh
sudo apt-get install containerd.io docker-ce=5:20.10.11~3-0~ubuntu-focal docker-ce-cli=5:20.10.11~3-0~ubuntu-focal
```

도커가 정상적으로 설치된 것을 확인합니다.

```sh
sudo docker run hello-world
```

다음과 같은 메시지가 보이면 정상적으로 설치된 것을 의미합니다.

```text
mlops@ubuntu:~$ sudo docker run hello-world
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
2db29710123e: Pull complete 
Digest: sha256:cc15c5b292d8525effc0f89cb299f1804f3a725c8d05e158653a563f15e4f685
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```

### 기본적인 apt 패키지

추후 클라이언트와 서버의 원활한 통신을 위해서는 Port-Forwarding 을 수행해야 할 일이 있습니다.
Port-forwarding 을 위해서는 서버에 다음 패키지를 설치해주어야 합니다.

```sh
apt-get install -y socat
```

### (Optional for GPU) NVIDIA-Docker

쿠버네티스 및 Kubeflow 등에서 GPU 를 사용하기 위해서는 다음 작업이 필요합니다.

#### 1. NVIDIA-Docker 설치

우선 NVIDIA Driver 가 설치되어있어야 합니다.
서버의 GPU 에 맞는 버전의 NVIDIA Driver 가 정상적으로 설치되어 있는 경우, `nvidia-smi` 수행 시 다음과 같은 결과가 출력됩니다.

```text
mlops@ubuntu:~$ nvidia-smi 
Wed Dec  8 09:06:59 2021       
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 470.86       Driver Version: 470.86       CUDA Version: 11.4     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|                               |                      |               MIG M. |
|===============================+======================+======================|
|   0  NVIDIA GeForce ...  Off  | 00000000:01:00.0 Off |                  N/A |
| 25%   32C    P8     4W / 120W |    211MiB /  6078MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+
|   1  NVIDIA GeForce ...  Off  | 00000000:02:00.0 Off |                  N/A |
|  0%   34C    P8     7W / 175W |      5MiB /  7982MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+
                                                                               
+-----------------------------------------------------------------------------+
| Processes:                                                                  |
|  GPU   GI   CI        PID   Type   Process name                  GPU Memory |
|        ID   ID                                                   Usage      |
|=============================================================================|
|    0   N/A  N/A      1644      G   /usr/lib/xorg/Xorg                198MiB |
|    0   N/A  N/A      1893      G   /usr/bin/gnome-shell               10MiB |
|    1   N/A  N/A      1644      G   /usr/lib/xorg/Xorg                  4MiB |
+-----------------------------------------------------------------------------+

```

이제 NVIDIA-Docker 를 설치합니다. 다음 커맨드를 순서대로 수행합니다.

```sh
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list
sudo apt-get update
sudo apt-get install -y nvidia-container-toolkit
sudo systemctl restart docker
```

정상적으로 설치되었는지 확인하기 위해, GPU 를 사용하는 도커 컨테이너를 실행해봅니다.

```sh
sudo docker run --rm --gpus all nvidia/cuda:9.0-base nvidia-smi
```

다음과 같은 메시지가 보이면 정상적으로 설치된 것을 의미합니다.

```text
mlops@ubuntu:~$ sudo docker run --rm --gpus all nvidia/cuda:9.0-base nvidia-smi
Wed Dec  8 09:24:29 2021       
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 470.86       Driver Version: 470.86       CUDA Version: 11.4     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|                               |                      |               MIG M. |
|===============================+======================+======================|
|   0  NVIDIA GeForce ...  Off  | 00000000:01:00.0 Off |                  N/A |
| 25%   32C    P8     4W / 120W |    211MiB /  6078MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+
|   1  NVIDIA GeForce ...  Off  | 00000000:02:00.0 Off |                  N/A |
|  0%   34C    P8     7W / 175W |      5MiB /  7982MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+
                                                                               
+-----------------------------------------------------------------------------+
| Processes:                                                                  |
|  GPU   GI   CI        PID   Type   Process name                  GPU Memory |
|        ID   ID                                                   Usage      |
|=============================================================================|
+-----------------------------------------------------------------------------+
```

#### 2. NVIDIA-Docker 를 Default Container Runtime 으로 설정

Minikube 는 기본적으로 Docker-CE 를 Default Runtime 로 사용합니다. 즉, Minikube 내에서 pod 를 생성할 때, Container Runtime 으로 Docker-CE 를 디폴트로 사용합니다. 하지만, Docker Container 내에서 NVIDIA GPU 를 사용하기 위해서는 NVIDIA-Docker 를 Container Runtime 으로 사용하여 pod 를 생성할 수 있도록 Default Runtime 을 수정해주어야 합니다.

`/etc/docker/daemon.json` 파일을 열어 다음과 같이 수정합니다.

```sh
sudo vi /etc/docker/daemon.json

{
  "default-runtime": "nvidia",
  "runtimes": {
      "nvidia": {
          "path": "nvidia-container-runtime",
          "runtimeArgs": []
   }
  }
}
```

파일이 변경된 것을 확인한 후, Docker 를 재시작합니다.

```sh
sudo systemctl daemon-reload
sudo service docker restart
```

변경 사항이 반영되었는지 확인합니다.

```sh
sudo docker info | grep nvidia
```

다음과 같은 메시지가 보이면 정상적으로 설치된 것을 의미합니다.

```text
mlops@ubuntu:~$ docker info | grep nvidia
 Runtimes: io.containerd.runc.v2 io.containerd.runtime.v1.linux nvidia runc
 Default Runtime: nvidia
```

### Minikube binary

Minikube 를 사용하기 위해, v1.24.0 버전의 Minikube 바이너리를 설치합니다.

```sh
wget https://github.com/kubernetes/minikube/releases/download/v1.24.0/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

정상적으로 설치되었는지 확인합니다.

```sh
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

```sh
sudo su
```

`minikube start` 를 수행하여 쿠버네티스 클러스터 구축을 진행합니다. Kubeflow 의 원활한 사용을 위해, 쿠버네티스 버전은 v1.21.7 로 지정하여 구축하며 `--extra-config` 를 추가합니다.

```sh
minikube start --driver=none \
  --kubernetes-version=v1.21.7 \
  --extra-config=apiserver.service-account-signing-key-file=/var/lib/minikube/certs/sa.key \
  --extra-config=apiserver.service-account-issuer=kubernetes.default.svc
```

### Disable default addons

Minikube 를 설치하면 Default 로 설치되는 addon 이 존재합니다. 이 중 저희가 사용하지 않을 addon 을 비활성화합니다.

```sh
minikube addons disable storage-provisioner
minikube addons disable default-storageclass
```

모든 addon 이 비활성화된 것을 확인합니다.

```sh
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

```sh
curl -LO https://dl.k8s.io/release/v1.21.7/bin/linux/amd64/kubectl
```

kubectl 을 사용할 수 있도록 파일의 권한과 위치를 변경합니다.

```sh
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

정상적으로 설치되었는지 확인합니다.

```sh
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

### helm

Helm 은 여러 쿠버네티스 리소스를 한 번에 배포하고 관리할 수 있게 도와주는 패키지 매니징 도구 중 하나입니다.

현재 폴더에 Helm v3.7.1 버전을 다운받습니다.

```sh
wget https://get.helm.sh/helm-v3.7.1-linux-amd64.tar.gz
```

helm 을 사용할 수 있도록 압축을 풀고, 파일의 위치를 변경합니다.

```sh
tar -zxvf helm-v3.5.4-linux-amd64.tar.gz
sudo mv linux-amd64/helm /usr/local/bin/helm
```

정상적으로 설치되었는지 확인합니다.

```sh
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

| Name                               | Description                                                                       |
|------------------------------------|-----------------------------------------------------------------------------------|
| $HELM_CACHE_HOME                   | set an alternative location for storing cached files.                             |
| $HELM_CONFIG_HOME                  | set an alternative location for storing Helm configuration.                       |
| $HELM_DATA_HOME                    | set an alternative location for storing Helm data.                                |

...
```

### kustomize

kustomize 또한 여러 쿠버네티스 리소스를 한 번에 배포하고 관리할 수 있게 도와주는 패키지 매니징 도구 중 하나입니다.

현재 폴더에 kustomize v3.10.0 버전을 다운받습니다.

```sh
wget https://github.com/kubernetes-sigs/kustomize/releases/download/kustomize%2Fv3.10.0/kustomize_v3.10.0_linux_amd64.tar.gz
```

kustomize 를 사용할 수 있도록 압축을 풀고, 파일의 위치를 변경합니다.

```sh
tar -zxvf kustomize_v3.10.0_linux_amd64.tar.gz
sudo mv kustomize_3.2.0_linux_amd64 /usr/local/bin/kustomize
```

정상적으로 설치되었는지 확인합니다.

```sh
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

## 4. 쿠버네티스 기본 모듈 설치

이제부터는 쿠버네티스 클러스터에 필요한 기본적인 모듈을 설치합니다. 쿠버네티스 관련 명령은 모두 **클라이언트**에서 수행할 것입니다. 따라서 명령을 원활히 수행하기 위해서, 우선 kubernetes 의 관리자 인증 정보를 **클라이언트**로 가져옵니다.

우선 서버에서 다음 명령을 수행합니다.

```sh
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

```sh
mkdir -p /home/$USER/.kube
vi /home/$USER/.kube/config
```

해당 파일에 위의 KUBECONFIG 정보를 붙여넣습니다. (기존에 해당 파일이 있는 경우에는 주의하시기 바랍니다. 여러 개의 kubeconfig 파일 혹은 여러 개의 kubecontext 를 효율적으로 관리하는 방법은 다음과 같은 문서를 참고하시면 좋습니다. : https://dev.to/aabiseverywhere/configuring-multiple-kubeconfig-on-your-machine-59eo, https://github.com/ahmetb/kubectx)

클라이언트에서 다음을 수행하여 정상적으로 서버와 통신이 가능한지 확인합니다.

```sh
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

### CSI Plugin : Local Path Provisioner

CSI Plugin 은 kubernetes 내의 스토리지를 담당하는 모듈입니다. 단일 노드 클러스터에서 쉽게 사용할 수 있는 CSI Plugin 인 Local Path Provisioner 를 설치합니다.

```sh
kubectl apply -f https://raw.githubusercontent.com/rancher/local-path-provisioner/master/deploy/local-path-storage.yaml
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

또한, 다음과 같이 local-path-storage namespace 에 provisioner pod 가 Running 인지 확인합니다.

```sh
kubectl -n local-path-storage get pod
```

```text
NAME                                     READY     STATUS    RESTARTS   AGE
local-path-provisioner-d744ccf98-xfcbk   1/1       Running   0          7m
```

다음을 수행하여 default storage class 로 변경합니다.

```sh
kubectl edit sc local-path
```

`storageclass.kubernetes.io/is-default-class: "true"` 를 `metadata.annotations` 에 추가한 뒤, 저장합니다.

```text
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  annotations:
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"storage.k8s.io/v1","kind":"StorageClass","metadata":{"annotations":{},"name":"local-path"},"provisioner":"rancher.io/local-path","reclaimPolicy":"Delete","volumeBindingMode":"WaitForFirstConsumer"}
    storageclass.kubernetes.io/is-default-class: "true" <<<<< 이 부분을 추가합니다.
  creationTimestamp: "2021-12-06T09:02:26Z"
  name: local-path
  resourceVersion: "4162777"
  uid: 4ac5af43-b79f-4d1d-b76e-3cb78a42d880
provisioner: rancher.io/local-path
reclaimPolicy: Delete
volumeBindingMode: WaitForFirstConsumer
```

default storage class 로 설정되었는지 확인합니다.

```sh
kubectl get sc
```

다음과 같이 NAME 에 `local-path (default)` 인 row 가 존재하는 것을 확인합니다.

```text
NAME                   PROVISIONER             RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
local-path (default)   rancher.io/local-path   Delete          WaitForFirstConsumer   false                  2h
```

### Nvidia-Device-Plugin

```sh
kubectl create -f https://raw.githubusercontent.com/NVIDIA/k8s-device-plugin/v0.10.0/nvidia-device-plugin.yml
```

nvidia-device-plugin 은 daemonset 으로 생성되지만, minikube 를 single node 로 생성했으므로 1 개의 pod 이 RUNNING 상태로 생성되었는지 확인합니다.

```sh
kubectl get pod -n kube-system | grep nvidia
```

다음과 같은 결과가 출력되어야 합니다.

```text
kube-system                 nvidia-device-plugin-daemonset-nlqh2                        1/1     Running   0          1h
```

node 정보에 gpu 가 사용가능하도록 설정되었는지 확인합니다.

```sh
kubectl get nodes "-o=custom-columns=NAME:.metadata.name,GPU:.status.allocatable.nvidia\.com/gpu"
```

다음과 같은 메시지가 보이면 정상적으로 설정된 것을 의미합니다.

```text
NAME       GPU
ubuntu     1
```

설정되지 않은 경우, GPU 의 value 가 <none> 으로 표시됩니다.

## 5. 정상 설치 확인

최종적으로 node 가 Ready 인지, OS, Docker, Kubernetes 버전을 확인합니다.

```sh
kubectl get nodes -o wide
```

다음과 같은 메시지가 보이면 정상적으로 설치된 것을 의미합니다.

```text
NAME     STATUS   ROLES                  AGE     VERSION   INTERNAL-IP    EXTERNAL-IP   OS-IMAGE             KERNEL-VERSION     CONTAINER-RUNTIME
ubuntu   Ready    control-plane,master   2d23h   v1.21.7   192.168.0.75   <none>        Ubuntu 20.04.3 LTS   5.4.0-91-generic   docker://20.10.11
```

## 6. References

- https://docs.docker.com/engine/install/ubuntu/
