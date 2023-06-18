---
title: "4.3. Kubeadm"
description: ""
sidebar_position: 3
date: 2021-12-13
lastmod: 2021-12-20
contributors: ["Youngcheol Jang"]
---

## 1. Prerequisite

쿠버네티스 클러스터를 구축하기에 앞서, 필요한 구성 요소들을 **클러스터에** 설치합니다.

[Install Prerequisite](../../setup-kubernetes/install-prerequisite.md)을 참고하여 Kubernetes를 설치하기 전에 필요한 요소들을 **클러스터에** 설치해 주시기 바랍니다.

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

## 2. 쿠버네티스 클러스터 셋업

- kubeadm : kubelet을 서비스에 등록하고, 클러스터 컴포넌트들 사이의 통신을 위한 인증서 발급 등 설치 과정 자동화
- kubelet : container 리소스를 실행, 종료를 해 주는 컨테이너 핸들러
- kubectl : 쿠버네티스 클러스터를 터미널에서 확인, 조작하기 위한 CLI 도구

다음 명령어를 통해 kubeadm, kubelet, kubectl을 설치합니다.
실수로 이 컴포넌트들의 버전이 변경하면, 예기치 않은 장애를 낳을 수 있으므로 컴포넌트들이 변경되지 않도록 설정합니다.

```text
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl &&
sudo curl -fsSLo /usr/share/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg &&
echo "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list &&
sudo apt-get update
sudo apt-get install -y kubelet=1.21.7-00 kubeadm=1.21.7-00 kubectl=1.21.7-00 &&
sudo apt-mark hold kubelet kubeadm kubectl
```

kubeadm, kubelet, kubectl 이 잘 설치되었는지 확인합니다.

```text
mlops@ubuntu:~$ kubeadm version
kubeadm version: &version.Info{Major:"1", Minor:"21", GitVersion:"v1.21.7", GitCommit:"1f86634ff08f37e54e8bfcd86bc90b61c98f84d4", GitTreeState:"clean", BuildDate:"2021-11-17T14:40:08Z", GoVersion:"go1.16.10", Compiler:"gc", Platform:"linux/amd64"}
```

```text
mlops@ubuntu:~$ kubelet --version
Kubernetes v1.21.7
```

```text
mlops@ubuntu:~$ kubectl version --client
Client Version: version.Info{Major:"1", Minor:"21", GitVersion:"v1.21.7", GitCommit:"1f86634ff08f37e54e8bfcd86bc90b61c98f84d4", GitTreeState:"clean", BuildDate:"2021-11-17T14:41:19Z", GoVersion:"go1.16.10", Compiler:"gc", Platform:"linux/amd64"}
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
안정성을 위하여 `마스터 노드`에는 쿠버네티스 클러스터를 제어하는 작업만 실행되도록 하는 것이 일반적이지만,
이 매뉴얼에서는 싱글 클러스터를 가정하고 있으므로 마스터 노드에 모든 종류의 작업이 실행될 수 있도록 설정합니다.

```text
kubectl taint nodes --all node-role.kubernetes.io/master-
```

## 3. 쿠버네티스 클라이언트 셋업

클러스터에 생성된 kubeconfig 파일을 **클라이언트**에 복사하여 kubectl을 통해 클러스터를 제어할 수 있도록 합니다.

```text
mkdir -p $HOME/.kube
scp -p {CLUSTER_USER_ID}@{CLUSTER_IP}:~/.kube/config ~/.kube/config
```

## 4. 쿠버네티스 기본 모듈 설치

[Setup Kubernetes Modules](../../setup-kubernetes/install-kubernetes-module.md)을 참고하여 다음 컴포넌트들을 설치해 주시기 바랍니다.


- helm
- kustomize
- CSI plugin
- [Optional] nvidia-docker, nvidia-device-plugin

## 5. 정상 설치 확인

다음 명령어를 통해 노드의 STATUS가 Ready 상태가 되었는지 확인합니다.

```text
kubectl get nodes
```

Ready 가 되면 다음과 비슷한 결과가 출력됩니다.

```text
NAME     STATUS   ROLES                  AGE     VERSION
ubuntu   Ready    control-plane,master   2m55s   v1.21.7
```

## 6. References

- [kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm)
