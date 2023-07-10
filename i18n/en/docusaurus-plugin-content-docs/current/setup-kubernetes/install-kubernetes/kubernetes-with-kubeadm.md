---
title: "4.3. Kubeadm"
description: ""
sidebar_position: 3
date: 2021-12-13
lastmod: 2021-12-20
contributors: ["Youngcheol Jang"]
---

## 1. Prerequisite

Before building a Kubernetes cluster, install the necessary components to the **cluster**.

Please refer to [Install Prerequisite](../../setup-kubernetes/install-prerequisite.md) and install the necessary components to the **cluster**.

Change the configuration of the network for Kubernetes.

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

## 2. Setup Kubernetes Cluster

- kubeadm : Automates the installation process by registering kubelet as a service and issuing certificates for communication between cluster components.
- kubelet : Container handler responsible for starting and stopping container resources.
- kubectl : CLI tool used to interact with and manage Kubernetes clusters from the terminal.

Install kubeadm, kubelet, and kubectl using the following commands. It's important to prevent accidental changes to the versions of these components, as it can lead to unexpected issues.

```text
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl &&
sudo curl -fsSLo /usr/share/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg &&
echo "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list &&
sudo apt-get update
sudo apt-get install -y kubelet=1.21.7-00 kubeadm=1.21.7-00 kubectl=1.21.7-00 &&
sudo apt-mark hold kubelet kubeadm kubectl
```

Check if kubeadm, kubelet, and kubectl are installed correctly.

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

Now we will use kubeadm to install Kubernetes.

```text
kubeadm config images list
kubeadm config images pull

sudo kubeadm init --pod-network-cidr=10.244.0.0/16
```

Through kubectl, copy the admin certificate to the path $HOME/.kube/config to control the Kubernetes cluster.

```text
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

Install CNI. There are various kinds of CNI, which is responsible for setting up the network inside Kubernetes, and in *MLOps for All*, flannel is used.

```text
kubectl apply -f https://raw.githubusercontent.com/flannel-io/flannel/v0.13.0/Documentation/kube-flannel.yml
```

There are two types of Kubernetes nodes: `Master Node` and `Worker Node`. For stability, it is generally recommended that only tasks to control the Kubernetes cluster are run on the `Master Node`, however this manual assumes a single cluster, so all types of tasks can be run on the Master Node.

```text
kubectl taint nodes --all node-role.kubernetes.io/master-
```

## 3. Setup Kubernetes Client

Copy the kubeconfig file created in the cluster to the **client** to control the cluster through kubectl.

```text
mkdir -p $HOME/.kube
scp -p {CLUSTER_USER_ID}@{CLUSTER_IP}:~/.kube/config ~/.kube/config
```

## 4. Install Kubernetes Default Modules

Please refer to [Setup Kubernetes Modules](../../setup-kubernetes/install-kubernetes-module.md) to install the following components:

- helm
- kustomize
- CSI plugin
- [Optional] nvidia-docker, nvidia-device-plugin

## 5. Verify Successful Installation

Finally, check if the nodes are Ready and verify the OS, Docker, and Kubernetes versions.

```text
kubectl get nodes
```

When the node is in the "Ready" state, the output will be similar to the following:

```text
NAME     STATUS   ROLES                  AGE     VERSION
ubuntu   Ready    control-plane,master   2m55s   v1.21.7
```

## 6. References

- [kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm)
