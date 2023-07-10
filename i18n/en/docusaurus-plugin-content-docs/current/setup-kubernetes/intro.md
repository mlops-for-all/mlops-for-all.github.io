---
title: "1. Introduction"
description: "Setup Introduction"
sidebar_position: 1
date: 2021-12-13
lastmod: 2021-12-13
contributors: ["Jaeyeon Kim", "Jongsun Shinn", "Youngdon Tae", "SeungTae Kim"]
---

## Build MLOps System

The biggest barrier when studying MLOps is the difficulty of setting up and using an MLOps system. Using public cloud platforms like AWS or GCP, or commercial tools like Weights & Biases or neptune.ai, can be costly, and starting from scratch to build the entire environment can be overwhelming and confusing.

To address these challenges and help those who haven't been able to start with MLOps, *MLOps for ALL* will guide you on how to build and use an MLOps system from scratch, requiring only a desktop with Ubuntu installed.

For those who cannot prepare a Ubuntu desktop environment, use virtual machines to set up the environment.

> If you are using Windows or an Intel-based Mac for the *MLOps for ALL* practical exercises, you can prepare an Ubuntu desktop environment using virtual machine software such as VirtualBox or VMware. Please make sure to meet the recommended specifications when creating the virtual machine.
> However, for those using an M1 Mac, as of the date of writing (February 2022), VirtualBox and VMware are not available. ([Check if macOS apps are optimized for M1 Apple Silicon Mac](https://isapplesiliconready.com/kr))
> Therefore, if you are not using a cloud environment, you can install UTM, Virtual machines for Mac, to use virtual machines. 
> (Purchasing and downloading software from the App Store is a form of donation-based payment. The free version is sufficient as it only differs in automatic updates.)
> This virtual machine software supports the *Ubuntu 20.04.3 LTS* practice operating system, enabling you to perform the exercises on an M1 Mac.


However, since it is not possible to use all the elements described in the [Components of MLOps](../introduction/component.md), *MLOps for ALL* will mainly focus on installing the representative open source software and connecting them to each other.

It is not meant that installing open source software in *MLOps for ALL* is a standard, and we recommend choosing the appropriate tool that fits your situation.

## Components

The components of the MLOps system that we will make in this article and each version have been verified in the following environment.

To facilitate smooth testing, I will explain the setup of the **Cluster** and **Client** as separate entities.

The **Cluster** refers to a single desktop with Ubuntu installed.  
The **Client** is recommended to be a different desktop, such as a laptop or another desktop with access to the Cluster or Kubernetes installation. However, if you only have one machine available, you can use the same desktop for both Cluster and Client purposes.

### Cluster

#### 1. Software

Below is the list of software that needs to be installed on the Cluster:

| Software        | Version     |
| --------------- | ----------- |
| Ubuntu          | 20.04.3 LTS |
| Docker (Server) | 20.10.11    |
| NVIDIA Driver   | 470.86      |
| Kubernetes      | v1.21.7     |
| Kubeflow        | v1.4.0      |
| MLFlow          | v1.21.0     |

#### 2. Helm Chart

Below is the list of third-party software that needs to be installed using Helm:

| Helm Chart Repo Name          | Version |
| ----------------------------- | ------- |
| datawire/ambassador           | 6.9.3   |
| seldonio/seldon-core-operator | 1.11.2  |

### Client

The Client has been validated on MacOS (Intel CPU) and Ubuntu 20.04.

| Software        | Version  |
| --------------- | ----------|
| kubectl         | v1.21.7   |
| helm            | v3.7.1    |
| kustomize       | v3.10.0   |

### Minimum System Requirements

It is recommended that the Cluster meet the following specifications, which are dependent on the recommended specifications for Kubernetes and Kubeflow:

- CPU: 6 cores
- RAM: 12GB
- DISK: 50GB
- GPU: NVIDIA GPU (optional)
