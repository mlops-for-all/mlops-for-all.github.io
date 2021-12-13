---
title: "Setup Prerequisite"
description: "Install docker"
date: 2021-12-13T13:45:04+09:00
lastmod: 2021-12-13T13:45:04+09:00
draft: false
weight: 220
contributors: ["Jaeyeon Kim"]
menu:
  docs:
    parent: "setup"
images: []
---


이 페이지에서는 쿠버네티스를 설치하기에 앞서, **서버에** 설치해 두어야 하는 컴포넌트들에 대한 설치 매뉴얼을 설명합니다.

### Install Docker

apt 패키지 매니저를 업데이트하고, Prerequisite 패키지들을 설치합니다.

```text
sudo apt-get update && sudo apt-get install ca-certificates curl gnupg lsb-release
```

도커의 공식 GPG key 를 추가합니다.

```text
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```

apt 패키지 매니저로 도커를 설치할 때, stable Repository 에서 받아오도록 설정합니다.

```text
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

현재 설치 가능한 도커 버전을 확인합니다.

```text
apt-cache madison docker-ce
```

`5:20.10.11~3-0~ubuntu-focal` 버전이 있는지 확인하고, 해당 버전의 도커를 설치합니다.

```text
sudo apt-get install containerd.io docker-ce=5:20.10.11~3-0~ubuntu-focal docker-ce-cli=5:20.10.11~3-0~ubuntu-focal
```

도커가 정상적으로 설치된 것을 확인합니다.

```text
sudo docker run hello-world
```

다음과 같은 메시지가 보이면 정상적으로 설치된 것을 의미합니다.

```text
mlops@ubuntu:~$ sudo docker run hello-world
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
2db29710123e: Pull complete 
Digest: sha256:cc15c5b292d8525effc0f89cb299f1804f3a725c8d05e158653a563f15e4f685
Status: Downloaded newer image for hello-world:latest

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

docker 관련 command를 sudo 키워드 없이 사용할 수 있도록 하기 위해 다음 명령어를 통해 권한을 추가합니다.

```text
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker
```

sudo 키워드 없이 docker command를 사용할 수 있게 된 것을 확인하기 위해, 다시 한 번 docker run을 실행합니다.

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

### 기본적인 apt 패키지

추후 클라이언트와 서버의 원활한 통신을 위해서는 Port-Forwarding 을 수행해야 할 일이 있습니다.
Port-forwarding 을 위해서는 서버에 다음 패키지를 설치해주어야 합니다.

```text
apt-get install -y socat
```

## References

- [Install Docker Engine on Ubuntu](https://docs.docker.com/engine/install/ubuntu/)
