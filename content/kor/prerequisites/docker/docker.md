---
title : "What is Docker?"
description: "Introduction to Docker."
lead: ""
draft: false
weight: 103
images: []
contributors: ["Jongseob Jeon", "Jaeyeon Kim"]
menu:
  prerequisites:
    parent: "docker"
---


## 컨테이너

- 컨테이너 가상화
  - 어플리케이션을 어디에서나 동일하게 실행하는 기술
- 컨테이너 이미지
  - 어플리케이션을 실행시키기 위해 필요한 모든 파일들의 집합
  - → 붕어빵 틀
- 컨테이너란?
  - 컨테이너 이미지를 기반으로 실행된 한 개의 프로세스
  - → 붕어빵 틀로 찍어낸 붕어빵

## 도커

도커는 **컨테이너를 관리**하고 사용할 수 있게 해주는 플랫폼입니다.  
이러한 도커의 슬로건은 바로 **Build Once, Run Anywhere** 로 어디에서나 동일한 실행 결과를 보장합니다.

도커 내부에서 동작하는 과정을 보자면 실제로 container 를 위한 리소스를 분리하고, lifecycle 을 제어하는 기능은 linux kernel 의 cgroup 등이 수행합니다.
하지만 이러한 인터페이스를 바로 사용하는 것은 **너무 어렵기 때문에** 다음과 같은 추상화 layer를 만들게 됩니다.

<p align="center">
  <img src="/images/prerequisites/docker/docker-layer.png" title="docker-layer" width=70%/>
</p>

이를 통해 사용자는 사용자 친화적인 API 인 **Docker CLI** 만으로 쉽게 컨테이너를 제어할 수 있습니다.

## Layer 해석

위에서 나온 layer들의 역할은 다음과 같습니다.

1. runC: linux kernel 의 기능을 직접 사용해서, container 라는 하나의 프로세스가 사용할 네임스페이스와 cpu, memory, filesystem 등을 격리시켜주는 기능을 수행합니다.
2. containerd: runC(OCI layer) 에게 명령을 내리기 위한 추상화 단계이며, 표준화된 인터페이스(OCI)를 사용합니다.
3. dockerd: containerd 에게 명령을 내리는 역할만 합니다.
4. docker cli: 사용자는 docker cli 로 dockerd (Docker daemon)에게 명령을 내리기만 하면 됩니다.
    - 이 통신 과정에서 unix socket 을 사용하기 때문에 가끔 도커 관련 에러가 나면 `/var/run/docker.sock` 가 사용 중이다, 권한이 없다 등등의 에러 메시지가 나오는 것입니다.

이처럼 도커는 많은 단계를 감싸고 있지만, 흔히 도커라는 용어를 사용할 때는 Docker CLI 를 말할 때도 있고, Dockerd 를 말할 때도 있고 Docker Container 하나를 말할 때도 있어서 혼란이 생길 수 있습니다.  
앞으로 나오는 글에서도 도커가 여러가지 의미로 쓰일 수 있습니다.

## For ML Engineer

머신러닝 엔지니어가 도커를 사용하는 이유는 다음과 같습니다.

1. 나의 ML 학습/추론 코드를 OS, python version, python 환경, 특정 python package 버전에 independent 하도록 해야 한다.
2. 그래서 코드 뿐만이 아닌 **해당 코드가 실행되기 위해 필요한 모든 종속적인 패키지, 환경 변수, 폴더명 등등을 하나의 패키지로** 묶을 수 있는 기술이 컨테이너화 기술이다.
3. 이 기술을 쉽게 사용하고 관리할 수 있는 소프트웨어 중 하나가 도커이며, 패키지를 도커 이미지라고 부른다.
