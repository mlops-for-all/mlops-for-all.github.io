---
title: "6. (Optional) Setup GPU"
description: "Install nvidia docker, nvidia device plugin"
date: 2021-12-13
lastmod: 2021-12-13
draft: false
weight: 231
contributors: ["Jaeyeon Kim", "Jongsun Shinn"]
menu:
  docs:
    parent: "setup-kubernetes"
images: []
---

쿠버네티스 및 Kubeflow 등에서 GP 를 사용하기 위해서는 다음 작업이 필요합니다.

## 1. Install NVIDIA Driver

`nvidia-smi` 수행 시 다음과 같은 화면이 출력된다면 이 단계는 생략해 주시기 바랍니다.

  ```text
  mlops@ubuntu:~$ nvidia-smi 
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

`nvidia-smi`의 출력 결과가 위와 같지 않다면 장착된 GPU에 맞는 nvidia driver를 설치해 주시기 바랍니다.

만약 nvidia driver의 설치에 익숙하지 않다면 아래 명령어를 통해 설치하시기 바랍니다.

  ```text
  sudo add-apt-repository ppa:graphics-drivers/ppa
  sudo apt update && sudo apt install -y ubuntu-drivers-common
  sudo ubuntu-drivers autoinstall
  sudo reboot
  ```

## 2. NVIDIA-Docker 설치

NVIDIA-Docker를 설치합니다.

```text
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list
sudo apt-get update
sudo apt-get install -y nvidia-docker2
sudo systemctl restart docker
```

정상적으로 설치되었는지 확인하기 위해, GPU를 사용하는 도커 컨테이너를 실행해봅니다.

```text
sudo docker run --rm --gpus all nvidia/cuda:11.0-base nvidia-smi
```

다음과 같은 메시지가 보이면 정상적으로 설치된 것을 의미합니다.

  ```text
  mlops@ubuntu:~$ sudo docker run --rm --gpus all nvidia/cuda:11.0-base nvidia-smi
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
  |  0%   34C    P8     6W / 175W |      5MiB /  7982MiB |      0%      Default |
  |                               |                      |                  N/A |
  +-------------------------------+----------------------+----------------------+
                                                                                
  +-----------------------------------------------------------------------------+
  | Processes:                                                                  |
  |  GPU   GI   CI        PID   Type   Process name                  GPU Memory |
  |        ID   ID                                                   Usage      |
  |=============================================================================|
  +-----------------------------------------------------------------------------+
  ```

만약 `could not select device driver "" with capabilities: [[gpu]]..` 와 같은 에러가 나는 경우, nvidia-container-toolkit을 같이 설치합니다.
관련 issue는 [여기서](https://github.com/NVIDIA/nvidia-docker/issues/1034) 확인 가능합니다.

```text
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list

sudo apt-get update && sudo apt-get install -y nvidia-container-toolkit
sudo systemctl restart docker
```

## 3. NVIDIA-Docker를 Default Container Runtime으로 설정

쿠버네티스는 기본적으로 Docker-CE를 Default Container Runtime으로 사용합니다.
따라서, Docker Container 내에서 NVIDIA GPU를 사용하기 위해서는 NVIDIA-Docker 를 Container Runtime 으로 사용하여 pod를 생성할 수 있도록 Default Runtime을 수정해 주어야 합니다.

1. `/etc/docker/daemon.json` 파일을 열어 다음과 같이 수정합니다.

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

2. 파일이 변경된 것을 확인한 후, Docker를 재시작합니다.

  ```text
  sudo systemctl daemon-reload
  sudo service docker restart
  ```

3. 변경 사항이 반영되었는지 확인합니다.

  ```text
  sudo docker info | grep nvidia
  ```

  다음과 같은 메시지가 보이면 정상적으로 설치된 것을 의미합니다.

  ```text
  mlops@ubuntu:~$ docker info | grep nvidia
  Runtimes: io.containerd.runc.v2 io.containerd.runtime.v1.linux nvidia runc
  Default Runtime: nvidia
  ```

## 4. Nvidia-Device-Plugin

1. nvidia-device-plugin daemonset을 생성합니다.

  ```text
  kubectl create -f https://raw.githubusercontent.com/NVIDIA/k8s-device-plugin/v0.10.0/nvidia-device-plugin.yml
  ```

2. nvidia-device-plugin pod이 RUNNING 상태로 생성되었는지 확인합니다.

  ```text
  kubectl get pod -n kube-system | grep nvidia
  ```

  다음과 같은 결과가 출력되어야 합니다.

  ```text
  kube-system       nvidia-device-plugin-daemonset-nlqh2         1/1     Running   0      1h
  ```

3. node 정보에 gpu가 사용가능하도록 설정되었는지 확인합니다.

  ```text
  kubectl get nodes "-o=custom-columns=NAME:.metadata.name,GPU:.status.allocatable.nvidia\.com/gpu"
  ```

  다음과 같은 메시지가 보이면 정상적으로 설정된 것을 의미합니다.  
  (*모두의 MLOps* 에서 실습을 진행한 클러스터는 2개의 GPU가 있어서 2가 출력됩니다.
  본인의 클러스터의 GPU 개수와 맞는 숫자가 출력된다면 됩니다.)

  ```text
  NAME       GPU
  ubuntu     2
  ```

설정되지 않은 경우, GPU의 value가 `<None>` 으로 표시됩니다.
