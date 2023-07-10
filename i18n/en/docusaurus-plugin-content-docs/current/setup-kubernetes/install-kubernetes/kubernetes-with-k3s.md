---
title: "4.1. K3s"
description: ""
sidebar_position: 1
date: 2021-12-13
lastmod: 2021-12-20
draft: false
weight: 221
contributors: ["Jongseob Jeon"]
menu:
  docs:
    parent:../setup-kubernetes"
images: []
---

## 1. Prerequisite

Before setting up a Kubernetes cluster, install the necessary components on the **cluster**.

Please refer to [Install Prerequisite](../../setup-kubernetes/install-prerequisite.md) to install the necessary components on the **cluster** before installing Kubernetes.

k3s uses containerd as the backend by default.
However, we need to use docker as the backend to use GPU, so we will install the backend with the `--docker` option.

```text
curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION=v1.21.7+k3s1 sh -s - server --disable traefik --disable servicelb --disable local-storage --docker
```

After installing k3s, check the k3s config.

```text
sudo cat /etc/rancher/k3s/k3s.yaml
```

If installed correctly, the following items will be output. (Security related keys are hidden with <...>.)

```text
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data:
    <...>
    server: https://127.0.0.1:6443
  name: default
contexts:
- context:
    cluster: default
    user: default
  name: default
current-context: default
kind: Config
preferences: {}
users:
- name: default
  user:
    client-certificate-data:
    <...>
    client-key-data:
    <...>
```

## 2. Setup Kubernetes Cluster

Set up the Kubernetes cluster by copying the k3s config to be used as the cluster’s kubeconfig.

```text
mkdir .kube
sudo cp /etc/rancher/k3s/k3s.yaml .kube/config
```

Grant user access permission to the copied config file.

```text
sudo chown $USER:$USER .kube/config
```

## 3. Setup Kubernetes Client

Now move the kubeconfig configured in the cluster to the local.
Set the path to `~/.kube/config` on the local.

The config file copied at first has the server ip set to `https://127.0.0.1:6443`. 
Modify this value to match the ip of the cluster. 
(We modified it to `https://192.168.0.19:6443` to match the ip of the cluster used in this page.)

```text
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data:
    <...>
    server: https://192.168.0.19:6443
  name: default
contexts:
- context:
    cluster: default
    user: default
  name: default
current-context: default
kind: Config
preferences: {}
users:
- name: default
  user:
    client-certificate-data:
    <...>
    client-key-data:
    <...>
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
kubectl get nodes -o wide
```

If you see the following message, it means that the installation was successful.

```text
NAME    STATUS   ROLES                  AGE   VERSION        INTERNAL-IP    EXTERNAL-IP   OS-IMAGE             KERNEL-VERSION     CONTAINER-RUNTIME
ubuntu   Ready    control-plane,master   11m   v1.21.7+k3s1   192.168.0.19   <none>        Ubuntu 20.04.3 LTS   5.4.0-91-generic   docker://20.10.11
```

## 6. References

- [https://rancher.com/docs/k3s/latest/en/installation/install-options/](https://rancher.com/docs/k3s/latest/en/installation/install-options/)
