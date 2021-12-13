---
title: "3. Setup Prerequisite"
description: "Install docker"
date: 2021-12-13
lastmod: 2021-12-13
draft: false
weight: 210
contributors: ["Jaeyeon Kim"]
menu:
  docs:
    parent: "setup"
images: []
---


이 페이지에서는 쿠버네티스를 설치하기에 앞서, **클러스터**와 **클라이언트**에 설치 혹은 설정해두어야 하는 컴포넌트들에 대한 매뉴얼을 설명합니다.

## Install apt packages

추후 클라이언트와 클러스터의 원활한 통신을 위해서는 Port-Forwarding 을 수행해야 할 일이 있습니다.
Port-forwarding 을 위해서는 **클러스터**에 다음 패키지를 설치해주어야 합니다.

```text
sudo apt-get update
sudo apt-get install -y socat
```

## Install Docker

1. 도커 설치에 필요한 APT 패키지들을 설치합니다.

   ```text
   sudo apt-get update && sudo apt-get install ca-certificates curl gnupg lsb-release
   ```

2. 도커의 공식 GPG key 를 추가합니다.

   ```text
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
   ```

3. apt 패키지 매니저로 도커를 설치할 때, stable Repository 에서 받아오도록 설정합니다.

   ```text
   echo \
   "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
   ```

4. 현재 설치 가능한 도커 버전을 확인합니다.

   ```text
   apt-cache madison docker-ce
   ```

5. `5:20.10.11~3-0~ubuntu-focal` 버전이 있는지 확인하고, 해당 버전의 도커를 설치합니다.

   ```text
   sudo apt-get install containerd.io docker-ce=5:20.10.11~3-0~ubuntu-focal docker-ce-cli=5:20.10.11~3-0~ubuntu-focal
   ```

6. 도커가 정상적으로 설치된 것을 확인합니다.

   ```text
   sudo docker run hello-world
   ```

   명령어 실행 후 다음과 같은 메시지가 보이면 정상적으로 설치된 것을 의미합니다.

   ```text
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

6. docker 관련 command를 sudo 키워드 없이 사용할 수 있도록 하기 위해 다음 명령어를 통해 권한을 추가합니다.

   ```text
   sudo groupadd docker
   sudo usermod -aG docker $USER
   newgrp docker
   ```

7. sudo 키워드 없이 docker command를 사용할 수 있게 된 것을 확인하기 위해, 다시 한 번 docker run을 실행합니다.

   ```text
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

kubelet 이 정상적으로 동작하게 하기 위해서는 **클러스터** 노에 swap이라고 불리는 가상메모리를 꺼 두어야 합니다. 다음 명령어를 통해 swap을 꺼 둡니다.  
**(클러스터와 클라이언트를 동일한 데스크탑에서 사용할 때 swap 메모리를 종료할 경우 속도의 저하가 있을 수 있습니다.)**  

```text
sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab
sudo swapoff -a
```

## Install Kubectl

kubectl 은 쿠버네티스 클러스터에게 API 를 요청할 때 사용하는 클라이언트 툴 입니다. **클라이언트** 노드에 설치해두어야 합니다.

1. 현재 폴더에 kubectl v1.21.7 버전을 다운받습니다.

   ```text
   curl -LO https://dl.k8s.io/release/v1.21.7/bin/linux/amd64/kubectl
   ```

2. kubectl 을 사용할 수 있도록 파일의 권한과 위치를 변경합니다.

   ```text
   sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
   ```

3. 정상적으로 설치되었는지 확인합니다.

   ```text
   kubectl --help
   ```

   다음과 같은 메시지가 보이면 정상적으로 설치된 것을 의미합니다.

   ```text
   kubectl controls the Kubernetes cluster manager.

   Find more information at:
   https://kubernetes.io/docs/reference/kubectl/overview/

   Basic Commands (Beginner):
   create        Create a resource from a file or from stdin
   expose        Take a replication controller, service, deployment or pod and
   expose it as a new Kubernetes service
   run           Run a particular image on the cluster
   set           Set specific features on objects
   ...
   ```

4. 여러 개의 쿠버네티스 클러스터를 사용하는 경우, 여러 개의 kubeconfig 파일을 관리해야 하는 경우가 있습니다.  
여러 개의 kubeconfig 파일 혹은 여러 개의 kube-context 를 효율적으로 관리하는 방법은 다음과 같은 문서를 참고하시기 바랍니다.

   - [https://dev.to/aabiseverywhere/configuring-multiple-kubeconfig-on-your-machine-59eo](https://dev.to/aabiseverywhere/configuring-multiple-kubeconfig-on-your-machine-59eo)
   - [https://github.com/ahmetb/kubectx](https://github.com/ahmetb/kubectx))

## References

- [Install Docker Engine on Ubuntu](https://docs.docker.com/engine/install/ubuntu/)
- [리눅스에 kubectl 설치 및 설정](https://kubernetes.io/ko/docs/tasks/tools/install-kubectl-linux/)
