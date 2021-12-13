---
title: "Setup Postrequisite"
description: "Install Helm, Kustomize, nvidia docker, nvidia device plugin"
date: 2021-12-13T13:45:04+09:00
lastmod: 2021-12-13T13:45:04+09:00
draft: false
weight: 221
contributors: ["Jaeyeon Kim"]
menu:
  docs:
    parent: "setup"
images: []
---

## helm

Helm 은 여러 쿠버네티스 리소스를 한 번에 배포하고 관리할 수 있게 도와주는 패키지 매니징 도구 중 하나입니다.

현재 폴더에 Helm v3.7.1 버전을 다운받습니다.

```text
wget https://get.helm.sh/helm-v3.7.1-linux-amd64.tar.gz
```

helm 을 사용할 수 있도록 압축을 풀고, 파일의 위치를 변경합니다.

```text
tar -zxvf helm-v3.5.4-linux-amd64.tar.gz
sudo mv linux-amd64/helm /usr/local/bin/helm
```

정상적으로 설치되었는지 확인합니다.

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

| Name                               | Description                                                                       |
|------------------------------------|-----------------------------------------------------------------------------------|
| $HELM_CACHE_HOME                   | set an alternative location for storing cached files.                             |
| $HELM_CONFIG_HOME                  | set an alternative location for storing Helm configuration.                       |
| $HELM_DATA_HOME                    | set an alternative location for storing Helm data.                                |

...
```

## kustomize

kustomize 또한 여러 쿠버네티스 리소스를 한 번에 배포하고 관리할 수 있게 도와주는 패키지 매니징 도구 중 하나입니다.

현재 폴더에 kustomize v3.10.0 버전을 다운받습니다.

```text
wget https://github.com/kubernetes-sigs/kustomize/releases/download/kustomize%2Fv3.10.0/kustomize_v3.10.0_linux_amd64.tar.gz
```

kustomize 를 사용할 수 있도록 압축을 풀고, 파일의 위치를 변경합니다.

```text
tar -zxvf kustomize_v3.10.0_linux_amd64.tar.gz
sudo mv kustomize_3.2.0_linux_amd64 /usr/local/bin/kustomize
```

정상적으로 설치되었는지 확인합니다.

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

CSI Plugin 은 kubernetes 내의 스토리지를 담당하는 모듈입니다. 단일 노드 클러스터에서 쉽게 사용할 수 있는 CSI Plugin 인 Local Path Provisioner 를 설치합니다.

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

또한, 다음과 같이 local-path-storage namespace 에 provisioner pod 가 Running 인지 확인합니다.

```text
kubectl -n local-path-storage get pod
```

```text
NAME                                     READY     STATUS    RESTARTS   AGE
local-path-provisioner-d744ccf98-xfcbk   1/1       Running   0          7m
```

다음을 수행하여 default storage class 로 변경합니다.

```text
kubectl patch storageclass local-path  -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'
```

default storage class 로 설정되었는지 확인합니다.

```text
kubectl get sc
```

다음과 같이 NAME 에 `local-path (default)` 인 row 가 존재하는 것을 확인합니다.

```text
NAME                   PROVISIONER             RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
local-path (default)   rancher.io/local-path   Delete          WaitForFirstConsumer   false                  2h
```


## (Optional for GPU) NVIDIA-Docker

쿠버네티스 및 Kubeflow 등에서 GPU 를 사용하기 위해서는 다음 작업이 필요합니다.


### 1. [Optional] Install NVIDIA Driver

`nvidia-smi` 수행 시 다음과 같은 화면이 출력된다면 이 단계는 스킵해 주시기 바랍니다.

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

`nvidia-smi`의 출력 결과가 다음과 같지 않다면, 다음과 같이 nvidia driver를 설치해 주시기 바랍니다.

```text
sudo add-apt-repository ppa:graphics-drivers/ppa
sudo apt update && sudo apt install -y ubuntu-drivers-common
sudo ubuntu-drivers autoinstall
sudo reboot
```


#### 1. NVIDIA-Docker 설치

NVIDIA-Docker 를 설치합니다. 다음 커맨드를 순서대로 수행합니다.

```text
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list
sudo apt-get update
sudo apt-get install -y nvidia-container-toolkit
sudo systemctl restart docker
```

정상적으로 설치되었는지 확인하기 위해, GPU 를 사용하는 도커 컨테이너를 실행해봅니다.

```text
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

```text
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

```text
sudo systemctl daemon-reload
sudo service docker restart
```

변경 사항이 반영되었는지 확인합니다.

```text
sudo docker info | grep nvidia
```

다음과 같은 메시지가 보이면 정상적으로 설치된 것을 의미합니다.

```text
mlops@ubuntu:~$ docker info | grep nvidia
 Runtimes: io.containerd.runc.v2 io.containerd.runtime.v1.linux nvidia runc
 Default Runtime: nvidia
```


### Nvidia-Device-Plugin

```text
kubectl create -f https://raw.githubusercontent.com/NVIDIA/k8s-device-plugin/v0.10.0/nvidia-device-plugin.yml
```

nvidia-device-plugin pod이 RUNNING 상태로 생성되었는지 확인합니다.

```text
kubectl get pod -n kube-system | grep nvidia
```

다음과 같은 결과가 출력되어야 합니다.

```text
kube-system                 nvidia-device-plugin-daemonset-nlqh2                        1/1     Running   0          1h
```

node 정보에 gpu 가 사용가능하도록 설정되었는지 확인합니다.

```text
kubectl get nodes "-o=custom-columns=NAME:.metadata.name,GPU:.status.allocatable.nvidia\.com/gpu"
```

다음과 같은 메시지가 보이면 정상적으로 설정된 것을 의미합니다.

```text
NAME       GPU
ubuntu     1
```

설정되지 않은 경우, GPU 의 value 가 <none> 으로 표시됩니다.

## References

- [Helm install: From the Binary Releases](https://helm.sh/docs/intro/install/#from-the-binary-releases)
- [local-path-provistioner#installation](https://helm.sh/docs/intro/install/#from-the-binary-releases)
