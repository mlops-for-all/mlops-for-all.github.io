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

쿠버네티스 클러스터를 구축하기에 앞서, 필요한 구성요소들을 **서버에** 설치합니다.

[Setup Prerequisite]({{< relref "docs/setup/setup-pre-requisite.md" >}})을 참고하여 Kubernetes를 설치하기 전에 필요한 요소들을 **서버에** 설치해 주시기 바랍니다.

쿠버네티스를 위한 네트워크의 설정을 변경합니다.

```text
sudo modprobe br_netfilter

cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
br_netfilter
EOF

cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
sudo sysctl --system
```

kubelet 이 정상적으로 동작하게 하기 위해서는 swap이라고 불리는 가상메모리를 꺼 두어야 합니다.
다음 명령어를 통해 swap을 꺼 둡니다.

```text
sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab
sudo swapoff -a
```

## 2. 쿠버네티스 클러스터 셋업

```bash
$ sudo modprobe br_netfilter

$ cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
br_netfilter
EOF

- kubeadm : kubelet을 서비스에 등록하고, 클러스터 컴포넌트들 사이의 통신을 위한 인증서 발급 등 설치 과정 자동화
- kubelet : container 리소스를 실행, 종료를 해 주는 컨테이너 핸들러
- kubectl : 쿠버네티스 클러스터를 터미널에서 확인, 조작 하기 위한 CLI 툴

다음 명령어를 통해 kubeadm, kubelet, kubectl을 설치합니다.
실수로 이 컴포넌트들의 버전이 변경할 경우, 예기치 않은 장애를 낳을 수 있으므로 컴포넌트들이 변경되지 않도록 설정합니다.

```text
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl

sudo curl -fsSLo /usr/share/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg

echo "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update
sudo apt-get install -y kubelet=1.21.7-00 kubeadm=1.21.7-00 kubectl=1.21.7-00
sudo apt-mark hold kubelet kubeadm kubectl
```

kubeadm, kubelet, kubectl 이 잘 설치되었는지 확인합니다.

```text
mlops@ubuntu:~$ kubeadm


    ┌──────────────────────────────────────────────────────────┐
    │ KUBEADM                                                  │
    │ Easily bootstrap a secure Kubernetes cluster             │
    │                                                          │
    │ Please give us feedback at:                              │
    │ https://github.com/kubernetes/kubeadm/issues             │
    └──────────────────────────────────────────────────────────┘
...
mlops@ubuntu:~$ kubelet -h
The kubelet is the primary "node agent" that runs on each
node. It can register the node with the apiserver using one of: the hostname; a flag to
override the hostname; or specific logic for a cloud provider.
...
mlops@ubuntu:~$ kubectl
kubectl controls the Kubernetes cluster manager.

 Find more information at: https://kubernetes.io/docs/reference/kubectl/overview/

Basic Commands (Beginner):
  create        Create a resource from a file or from stdin.
  expose        Take a replication controller, service, deployment or pod and expose it as a new Kubernetes Service
  run           Run a particular image on the cluster
  set           Set specific features on objects
...
```

이제 kubeadm을 사용하여 쿠버네티스를 설치합니다.

```text
kubeadm config images list
kubeadm config images pull

sudo kubeadm init --pod-network-cidr=10.244.0.0/16
```

kubectl을 통해서 쿠버네티스 클러스터를 제어할 수 있도록 admin 인증서를 $HOME/.kube/config 경로에 복사합니다.

```text
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

CNI를 설치합니다.
쿠버네티스 내부의 네트워크 설정을 전담하는 CNI는 여러 종류가 있으며, *모두의 MLOps*에서는 flannel을 사용합니다.

```text
kubectl apply -f https://raw.githubusercontent.com/flannel-io/flannel/v0.13.0/Documentation/kube-flannel.yml
```

쿠버네티스 노드의 종류에는 크게 `마스터 노드`와 `워커 노드`가 있습니다.
안정성을 위하여 `마스터 노드`에는 쿠버네티스 클러스터를 제어하는 작업들만 실행되도록 하는 것이 일반적이지만,
이 매뉴얼에서는 싱글 클러스터를 가정하고 있으므로 마스터 노드에 모든 종류의 작업이 실행될 수 있도록 설정합니다.

```text
kubectl taint nodes --all node-role.kubernetes.io/master-
```

## 3. 쿠버네티스 클라이언트 셋업

## 4. 쿠버네티스 기본 모듈 설치

[Setup Postrequisite]({{< relref "docs/setup/setup-post-requisite.md" >}})을 참고하여 다음 컴포넌트들을 설치해 주시기 바랍니다.

- helm
- kustomize
- CSI plugin
- [Optional] nvidia-docker, nvidia-device-plugin

## 5. 정상 설치 확인

다음 명령어를 통해 노드의 STATUS가 Ready 상태가 되었는지 확인합니다.

```text
kubectl get nodes
NAME     STATUS   ROLES                  AGE     VERSION
ubuntu   Ready    control-plane,master   2m55s   v1.21.7
```

## 6. References

- [kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm)
