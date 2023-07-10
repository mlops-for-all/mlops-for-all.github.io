---
title : "2. Setup Kubernetes"
description: "Setup Kubernetes"
sidebar_position: 2
date: 2021-12-13
lastmod: 2021-12-13
contributors: ["Jaeyeon Kim"]
---

## Setup Kubernetes Cluster

For those learning Kubernetes for the first time, the first barrier to entry is setting up a Kubernetes practice environment.

The official tool that supports building a production-level Kubernetes cluster is kubeadm, but there are also tools such as kubespray and kops that help users set up more easily, and tools such as k3s, minikube, microk8s, and kind that help you set up a compact Kubernetes cluster easily for learning purposes.

Each tool has its own advantages and disadvantages, so considering the preferences of each user, this article will use three tools: kubeadm, k3s, and minikube to set up a Kubernetes cluster.
For detailed comparisons of each tool, please refer to the official Kubernetes [documentation](https://kubernetes.io/ko/docs/tasks/tools/).

*MLOps for ALL* recommends **k3s** as a tool that is easy to use when setting up a Kubernetes cluster.

If you want to use all the features of Kubernetes and configure the nodes, we recommend **kubeadm**.  
**minikube** has the advantage of being able to easily install other Kubernetes in an add-on format, in addition to the components we describe.

In this *MLOps for ALL*, in order to use the components that will be built for MLOps smoothly, there are additional settings that must be configured when building the Kubernetes cluster using each of the tools.

The scope of this **Setup Kubernetes** section is to build a k8s cluster on a desktop that already has Ubuntu OS installed and to confirm that external client nodes can access the Kubernetes cluster.

The detailed setup procedure is composed of the following flow, as each of the three tools has its own setup procedure.
```bash
3. Setup Prerequisite
4. Setup Kubernetes
  4.1. with k3s
  4.2. with minikube
  4.3. with kubeadm
5. Setup Kubernetes Modules
```

Let's now build a Kubernetes cluster by using each of the tools. You don't have to use all the tools, and you can use the tools that you are familiar with.
