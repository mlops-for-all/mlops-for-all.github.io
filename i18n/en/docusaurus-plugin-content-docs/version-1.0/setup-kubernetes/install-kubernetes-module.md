---
title: "5. Install Kubernetes Modules"
description: "Install Helm, Kustomize"
sidebar_position: 5
date: 2021-12-13
lastmod: 2021-12-20
contributors: ["Jaeyeon Kim"]
---

## Setup Kubernetes Modules


On this page, we will explain how to install the modules that will be used on the cluster from the client nodes.  
All the processes introduced here will be done on the **client nodes**.

## Helm

Helm is one of the package management tools that helps to deploy and manage resources related to Kubernetes packages at once.

1. Download Helm version 3.7.1 into the current folder.

- For Linux amd64

  ```bash
  wget https://get.helm.sh/helm-v3.7.1-linux-amd64.tar.gz
  ```

- Other OS refer to the [official website](https://github.com/helm/helm/releases/tag/v3.7.1) for the download path of the binary that matches the OS and CPU of your client node.

2. Unzip the file to use helm and move the file to its desired location.

  ```bash
  tar -zxvf helm-v3.7.1-linux-amd64.tar.gz
  sudo mv linux-amd64/helm /usr/local/bin/helm
  ```

3. Check to see if the installation was successful:
  ```bash
  helm help
  ```

  If you see the following message, it means that it has been installed normally. 

  ```bash
  The Kubernetes package manager

  Common actions for Helm:

  - helm search:    search for charts
  - helm pull:      download a chart to your local directory to view
  - helm install:   upload the chart to Kubernetes
  - helm list:      list releases of charts

  Environment variables:

  | Name                     | Description                                                         |
  |--------------------------|---------------------------------------------------------------------|
  | $HELM_CACHE_HOME         | set an alternative location for storing cached files.               |
  | $HELM_CONFIG_HOME        | set an alternative location for storing Helm configuration.         |
  | $HELM_DATA_HOME          | set an alternative location for storing Helm data.                  |

  ...
  ```

## Kustomize

Kustomize is one of the package management tools that helps to deploy and manage multiple Kubernetes resources at once.

1. Download the binary version of kustomize v3.10.0 in the current folder.

- For Linux amd64

  ```bash
  wget https://github.com/kubernetes-sigs/kustomize/releases/download/kustomize%2Fv3.10.0/kustomize_v3.10.0_linux_amd64.tar.gz
  ```

- Other OS can be downloaded from [kustomize/v3.10.0](https://github.com/kubernetes-sigs/kustomize/releases/tag/kustomize%2Fv3.10.0) after checking.

2. Unzip to use kustomize, and change the file location. 

  ```bash
  tar -zxvf kustomize_v3.10.0_linux_amd64.tar.gz
  sudo mv kustomize /usr/local/bin/kustomize
  ```

3. Check if it is installed correctly.

  ```bash
  kustomize help
  ```

  If you see the following message, it means that it has been installed normally.

  ```bash
  Manages declarative configuration of Kubernetes.
  See https://sigs.k8s.io/kustomize

  Usage:
    kustomize [command]

  Available Commands:
    build                     Print configuration per contents of kustomization.yaml
    cfg                       Commands for reading and writing configuration.
    completion                Generate shell completion script
    create                    Create a new kustomization in the current directory
    edit                      Edits a kustomization file
    fn                        Commands for running functions against configuration.
  ...
  ```

## CSI Plugin : Local Path Provisioner

1. The CSI Plugin is a module that is responsible for storage within Kubernetes. Install the CSI Plugin, Local Path Provisioner, which is easy to use in single node clusters.

  ```bash
  kubectl apply -f https://raw.githubusercontent.com/rancher/local-path-provisioner/v0.0.20/deploy/local-path-storage.yaml
  ```

  If you see the following messages, it means that the installation was successful: 

  ```bash
  namespace/local-path-storage created
  serviceaccount/local-path-provisioner-service-account created
  clusterrole.rbac.authorization.k8s.io/local-path-provisioner-role created
  clusterrolebinding.rbac.authorization.k8s.io/local-path-provisioner-bind created
  deployment.apps/local-path-provisioner created
  storageclass.storage.k8s.io/local-path created
  configmap/local-path-config created
  ```

2. Also, check if the provisioner pod in the local-path-storage namespace is Running by executing the following command:

  ```bash
  kubectl -n local-path-storage get pod
  ```

If successful, it will display the following output:

  ```bash
  NAME                                     READY     STATUS    RESTARTS   AGE
  local-path-provisioner-d744ccf98-xfcbk   1/1       Running   0          7m
  ```

4. Execute the following command to change the default storage class:

  ```bash
  kubectl patch storageclass local-path -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'
  ```

  If the command is successful, the following output will be displayed:

  ```bash
  storageclass.storage.k8s.io/local-path patched
  ```

5. Verify that the default storage class has been set:

  ```bash
  kubectl get sc
  ```

  Check if there is a storage class with the name `local-path (default)` in the NAME column:

  ```bash
  NAME                   PROVISIONER             RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
  local-path (default)   rancher.io/local-path   Delete          WaitForFirstConsumer   false                  2h
  ```
