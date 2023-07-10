---
title: "6. (Optional) Setup GPU"
description: "Install nvidia docker, nvidia device plugin"
sidebar_position: 6
date: 2021-12-13
lastmod: 2021-12-13
contributors: ["Jaeyeon Kim"]
---

For using GPU in Kubernetes and Kubeflow, the following tasks are required.

## 1. Install NVIDIA Driver

If the following screen is output when executing `nvidia-smi`, please omit this step.

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

If the output of nvidia-smi is not as above, please install the nvidia driver that fits your installed GPU.

If you are not familiar with the installation of nvidia drivers, please install it through the following command.

  ```text
  sudo add-apt-repository ppa:graphics-drivers/ppa
  sudo apt update && sudo apt install -y ubuntu-drivers-common
  sudo ubuntu-drivers autoinstall
  sudo reboot
  ```

## 2. Install NVIDIA-Docker.

Let's install NVIDIA-Docker.

```text
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | \
  sudo apt-key add -
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list
sudo apt-get update
sudo apt-get install -y nvidia-docker2 &&
sudo systemctl restart docker
```

To check if it is installed correctly, we will run the docker container using the GPU.

```text
sudo docker run --rm --gpus all nvidia/cuda:11.0-base nvidia-smi
```

If the following message appears, it means that the installation was successful: 

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

## 3. Setting NVIDIA-Docker as the Default Container Runtime

By default, Kubernetes uses Docker-CE as the default container runtime. To use NVIDIA GPU within Docker containers, you need to configure NVIDIA-Docker as the container runtime and modify the default runtime for creating pods.

1. Open the `/etc/docker/daemon.json` file and make the following modifications:

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

2. After confirming the file changes, restart Docker.

  ```text
  sudo systemctl daemon-reload
  sudo service docker restart
  ```

3. Verify that the changes have been applied.

  ```text
  sudo docker info | grep nvidia
  ```

  If you see the following message, it means that the installation was successful.

  ```text
  mlops@ubuntu:~$ docker info | grep nvidia
  Runtimes: io.containerd.runc.v2 io.containerd.runtime.v1.linux nvidia runc
  Default Runtime: nvidia
  ```

## 4. Nvidia-Device-Plugin

1. Create the nvidia-device-plugin daemonset.

  ```text
  kubectl create -f https://raw.githubusercontent.com/NVIDIA/k8s-device-plugin/v0.10.0/nvidia-device-plugin.yml
  ```

2. Verify that the nvidia-device-plugin pod is in the RUNNING state.

  ```text
  kubectl get pod -n kube-system | grep nvidia
  ```

You should see the following output:

  ```text
  kube-system   nvidia-device-plugin-daemonset-nlqh2   1/1     Running   0    1h
  ```

3. Verify that the nodes have been configured to have GPUs available.

  ```text
  kubectl get nodes "-o=custom-columns=NAME:.metadata.name,GPU:.status.allocatable.nvidia\.com/gpu"
  ```

  If you see the following message, it means that the configuration was successful.  
  (*In the *MLOps for ALL* tutorial cluster, there are two GPUs, so the output is 2.
  If the output shows the correct number of GPUs for your cluster, it is fine.)

  ```text
  NAME       GPU
  ubuntu     2
  ```

  If it is not configured, the GPU value will be displayed as `<None>`.
