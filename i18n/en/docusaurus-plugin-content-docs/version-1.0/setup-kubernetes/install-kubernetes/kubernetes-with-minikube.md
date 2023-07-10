---
title: "4.2. Minikube"
description: ""
sidebar_position: 2
date: 2021-12-13
lastmod: 2021-12-20
contributors: ["Jaeyeon Kim"]
---

## 1. Prerequisite

Before setting up a Kubernetes cluster, install the necessary components on the **cluster**.

Please refer to [Install Prerequisite](../../setup-kubernetes/install-prerequisite.md) to install the necessary components on the **cluster** before installing Kubernetes.

### Minikube binary

Install the v1.24.0 version of the Minikube binary to use Minikube.

```bash
wget https://github.com/kubernetes/minikube/releases/download/v1.24.0/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

Check if it is installed properly.

```bash
minikube version
```

If this message appears, it means the installation was successful.

```bash
mlops@ubuntu:~$ minikube version
minikube version: v1.24.0
commit: 76b94fb3c4e8ac5062daf70d60cf03ddcc0a741b
```

## 2. Setup Kubernetes Cluster

Now let's build the Kubernetes cluster using Minikube.
To facilitate the smooth use of GPUs and communication between cluster and client, Minikube is run using the `driver=none` option. Please note that this option must be run as root user. 

Switch to root user.

```bash
sudo su
```

Run `minikube start` to build the Kubernetes cluster for Kubeflow's smooth operation, specifying the Kubernetes version as v1.21.7 and adding `--extra-config`.

```bash
minikube start --driver=none \
  --kubernetes-version=v1.21.7 \
  --extra-config=apiserver.service-account-signing-key-file=/var/lib/minikube/certs/sa.key \
  --extra-config=apiserver.service-account-issuer=kubernetes.default.svc
```

### Disable default addons

When installing Minikube, there are default addons that are installed. We will disable any addons that we do not intend to use.

```bash
minikube addons disable storage-provisioner
minikube addons disable default-storageclass
```

Confirm that all addons are disabled.

```bash
minikube addons list
```

If the following message appears, it means that the installation was successful.

```bash
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

### 3. Setup Kubernetes Client

Now, let's install the necessary tools for smooth usage of Kubernetes on the **client** machine. If the **client** and **cluster** nodes are not separated, please note that you need to perform all the operations as the root user.

If the **client** and **cluster** nodes are separated, first, we need to retrieve the Kubernetes administrator credentials from the **cluster** to the **client**.

1. Check the config on the **cluster**:

  ```bash
  # Cluster node
  minikube kubectl -- config view --flatten
  ```

2. The following information will be displayed:

  ```bash
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

3. Create the `.kube` folder on the **client** node:

  ```bash
  # Client node
  mkdir -p /home/$USER/.kube
  ```

4. Paste the information obtained from Step 2 into the file and save it:

  ```bash
  vi /home/$USER/.kube/config
  ```

## 4. Install Kubernetes Default Modules

Please refer to [Setup Kubernetes Modules](../../setup-kubernetes/install-kubernetes-module.md) to install the following components:

- helm
- kustomize
- CSI plugin
- [Optional] nvidia-docker, nvidia-device-plugin

## 5. Verify Successful Installation

Finally, check that the node is Ready, and check the OS, Docker, and Kubernetes versions.

```bash
kubectl get nodes -o wide
```

If this message appears, it means that the installation has completed normally.

```bash
NAME     STATUS   ROLES                  AGE     VERSION   INTERNAL-IP    EXTERNAL-IP   OS-IMAGE             KERNEL-VERSION     CONTAINER-RUNTIME
ubuntu   Ready    control-plane,master   2d23h   v1.21.7   192.168.0.75   <none>        Ubuntu 20.04.3 LTS   5.4.0-91-generic   docker://20.10.11
```
