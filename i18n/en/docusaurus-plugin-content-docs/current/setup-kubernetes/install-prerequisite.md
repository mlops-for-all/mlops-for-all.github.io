---
title: "3. Install Prerequisite"
description: "Install docker"
sidebar_position: 3
date: 2021-12-13
lastmod: 2021-12-20
contributors: ["Jaeyeon Kim", "Jongsun Shinn", "Sangwoo Shim"]
---

On this page, we describe the components that need to be installed or configured on the **Cluster** and **Client** prior to installing Kubernetes.

## Install apt packages

In order to enable smooth communication between the Client and the Cluster, Port-Forwarding needs to be performed. To enable Port-Forwarding, the following packages need to be installed on the **Cluster**.
```bash
sudo apt-get update
sudo apt-get install -y socat
```

## Install Docker

1. Install apt packages for docker.

   ```bash
   sudo apt-get update && sudo apt-get install -y ca-certificates curl gnupg lsb-release
   ```

2. add docker official GPG key.

   ```bash
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
   ```

3. When installing Docker using the apt package manager, configure it to retrieve from the stable repository:

   ```bash
   echo \
   "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
   ```

4. Check the currently available Docker versions for installation:

   ```bash
   sudo apt-get update && apt-cache madison docker-ce
   ```

   Verify if the version `5:20.10.11~3-0~ubuntu-focal` is listed among the output:

   ```bash
   apt-cache madison docker-ce | grep 5:20.10.11~3-0~ubuntu-focal
   ```

   If the addition was successful, the following output will be displayed:

   ```bash
   docker-ce | 5:20.10.11~3-0~ubuntu-focal | https://download.docker.com/linux/ubuntu focal/stable amd64 Packages
   ```

5. Install Docker version `5:20.10.11~3-0~ubuntu-focal`:

   ```bash
   sudo apt-get install -y containerd.io docker-ce=5:20.10.11~3-0~ubuntu-focal docker-ce-cli=5:20.10.11~3-0~ubuntu-focal

   ```

6. Check docker is installed.

   ```bash
   sudo docker run hello-world
   ```


   If added successfully, it will output as follows:

   ```bash
   mlops@ubuntu:~$ sudo docker run hello-world

   Hello from Docker!
   This message shows that your installation appears to be working correctly.

   To generate this message, Docker took the following steps:
   1. The Docker client contacted the Docker daemon.
   2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
      (amd64)
   3. The Docker daemon created a new container from that image which runs the
      executable that produces the output you are currently reading.
   4. The Docker daemon streamed that output to the Docker client, which sent it
      to your terminal.

   To try something more ambitious, you can run an Ubuntu container with:
   $ docker run -it ubuntu bash

   Share images, automate workflows, and more with a free Docker ID:
   https://hub.docker.com/

   For more examples and ideas, visit:
   https://docs.docker.com/get-started/
   ```
      
7. Add permissions to use Docker commands without the `sudo` keyword by executing the following commands:

   ```bash
   sudo groupadd docker
   sudo usermod -aG docker $USER
   newgrp docker
   ```

8. To verify that you can now use Docker commands without `sudo`, run the `docker run` command again:

   ```bash
   docker run hello-world
   ```

   If you see the following message after executing the command, it means that the permissions have been successfully added:

   ```bash
   mlops@ubuntu:~$ docker run hello-world

   Hello from Docker!
   This message shows that your installation appears to be working correctly.

   To generate this message, Docker took the following steps:
   1. The Docker client contacted the Docker daemon.
   2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
      (amd64)
   3. The Docker daemon created a new container from that image which runs the
      executable that produces the output you are currently reading.
   4. The Docker daemon streamed that output to the Docker client, which sent it
      to your terminal.

   To try something more ambitious, you can run an Ubuntu container with:
   $ docker run -it ubuntu bash

   Share images, automate workflows, and more with a free Docker ID:
   https://hub.docker.com/

   For more examples and ideas, visit:
   https://docs.docker.com/get-started/
   ```

## Turn off Swap Memory

In order for kubelet to work properly, **cluster** nodes must turn off the virtual memory called swap. The following command turns off the swap.  
**(When using cluster and client on the same desktop, turning off swap memory may result in a slowdown in speed)**

```bash
sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab
sudo swapoff -a
```

## Install Kubectl

kubectl is a client tool used to make API requests to a Kubernetes cluster. It needs to be installed on the client node.

1. Download kubectl version v1.21.7 to the current folder:

   ```bash
   curl -LO https://dl.k8s.io/release/v1.21.7/bin/linux/amd64/kubectl
   ```

2. Change the file permissions and move it to the appropriate location to make kubectl executable:

   ```bash
   sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
   ```

3. Verify that kubectl is installed correctly:

   ```bash
   kubectl version --client
   ```

   If you see the following message, it means that kubectl is installed successfully:

   ```bash
   Client Version: version.Info{Major:"1", Minor:"21", GitVersion:"v1.21.7", GitCommit:"1f86634ff08f37e54e8bfcd86bc90b61c98f84d4", GitTreeState:"clean", BuildDate:"2021-11-17T14:41:19Z", GoVersion:"go1.16.10", Compiler:"gc", Platform:"linux/amd64"}
   ```

4. If you work with multiple Kubernetes clusters and need to manage multiple kubeconfig files or kube-contexts efficiently, you can refer to the following resources:

   - [Configuring Multiple kubeconfig on Your Machine](https://dev.to/aabiseverywhere/configuring-multiple-kubeconfig-on-your-machine-59eo)
   - [kubectx - Switch between Kubernetes contexts easily](https://github.com/ahmetb/kubectx)

## References

- [Install Docker Engine on Ubuntu](https://docs.docker.com/engine/install/ubuntu/)
- [Install and Set Up kubectl on Linux](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)
