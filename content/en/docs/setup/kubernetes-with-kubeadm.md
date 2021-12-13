---
title: "Setup Kubernetes - Kubeadm"
description: ""
date: 2021-12-02T18:36:04+09:00
lastmod: 2021-12-02T18:36:04+09:00
draft: false
weight: 211
contributors: ["Youngcheol Jang"]
menu:
  docs:
    parent: "setup"
images: []
---

## 1. Prerequisite

### 1.1. Install Docker

```bash
$ sudo apt-get update
$ sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
$ echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

$ sudo apt-get update
$ sudo apt-get install -y \
  docker-ce=5:20.10.11~3-0~ubuntu-focal \
  docker-ce-cli=5:20.10.11~3-0~ubuntu-focal \
  containerd.io

# verify install
$ sudo docker run hello-world

# Manage Docker as a non-root user
$ sudo groupadd docker
$ sudo usermod -aG docker $USER
$ newgrp docker

# verify previlige setting
$ docker run hello-world
```

### 1.2. [Optional] Install nvidia-driver & nvidia-docker

```bash
sudo add-apt-repository ppa:graphics-drivers/ppa
sudo apt update && sudo apt install -y ubuntu-drivers-common
sudo ubuntu-drivers autoinstall
sudo reboot
```

```bash
stribution=$(. /etc/os-release;echo $ID$VERSION_ID) \
   && curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add - \
   && curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list
sudo apt-get update
sudo apt-get install -y nvidia-docker2
sudo systemctl restart docker
docker run --rm --gpus all nvidia/cuda:11.0-base nvidia-smi

# enable the nvidia runtime as your default runtime
# /etc/docker/daemon.json
{
    "default-runtime": "nvidia",
    "runtimes": {
        "nvidia": {
            "path": "/usr/bin/nvidia-container-runtime",
            "runtimeArgs": []
        }
    }
}
```

## 2. 쿠버네티스 클러스터 셋업

```
$ sudo modprobe br_netfilter

$ cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
br_netfilter
EOF

$ cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
$ sudo sysctl --system

$ sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab
$ sudo swapoff -a

# kubeadm, kubelet, kubectl
$ sudo apt-get update
$ sudo apt-get install -y apt-transport-https ca-certificates curl

$ sudo curl -fsSLo /usr/share/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg

$ echo "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list
$ sudo apt-get update
$ sudo apt-get install -y kubelet=1.21.7-00 kubeadm=1.21.7-00 kubectl=1.21.7-00
$ sudo apt-mark hold kubelet kubeadm kubectl
```

```
$ kubeadm config images list
$ kubeadm config images pull

$ sudo kubeadm init --pod-network-cidr=10.244.0.0/16

$ mkdir -p $HOME/.kube
$ sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
$ sudo chown $(id -u):$(id -g) $HOME/.kube/config

$ kubectl apply -f https://raw.githubusercontent.com/flannel-io/flannel/v0.13.0/Documentation/kube-flannel.yml

$ kubectl taint nodes --all node-role.kubernetes.io/master-

# Verify node ready
$ kubectl get nodes
NAME     STATUS   ROLES                  AGE     VERSION
ubuntu   Ready    control-plane,master   2m55s   v1.21.7
```

## 3. 쿠버네티스 클라이언트 셋업

## 4. 쿠버네티스 기본 모듈 설치

### 4.1. Install Storage Provisioner

```bash
# Install
$ kubectl apply -f https://raw.githubusercontent.com/rancher/local-path-provisioner/v0.0.20/deploy/local-path-storage.yaml
# Verify install
$ kubectl get sc
NAME         PROVISIONER             RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
local-path   rancher.io/local-path   Delete          WaitForFirstConsumer   false                  30s
$ kubectl get pod -n local-path-storage
NAME                                      READY   STATUS    RESTARTS   AGE
local-path-provisioner-556d4466c8-dgpt6   1/1     Running   0          30s

# Set local-path-storage as a default storage class
$ kubectl patch storageclass local-path  -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'
storageclass.storage.k8s.io/local-path patched
$ kubectl get storageclasses.storage.k8s.io
NAME                   PROVISIONER             RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
local-path (default)   rancher.io/local-path   Delete          WaitForFirstConsumer   false                  2m21s
```

### 4.2. [Optional] Install nvidia-device-plugin
```
```

## 5. 정상 설치 확인
