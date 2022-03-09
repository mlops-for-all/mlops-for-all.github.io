---
title : "Install Docker"
description: "Install docker to start."
lead: ""
draft: false
weight: 101
images: []
contributors: ["Jongseob Jeon", "Jaeyeon Kim"]
menu:
  prerequisites:
    parent: "docker"
---

## Docker

도커 실습을 위해 도커를 설치해야 합니다.  
도커 설치는 어떤 OS를 사용하는지에 따라 달라집니다.  
각 환경에 맞는 도커 설치는 [공식 홈페이지](https://www.docker.com/get-started)를 참고해주세요.

## 설치 확인

`docker run hello-world` 가 정상적으로 수행되는 OS, 터미널 환경이 필요합니다.

| OS      | Docker Engine  | Terminal           |
| ------- | -------------- | ------------------ |
| MacOS   | Docker Desktop | zsh                |
| Windows | Docker Desktop | Powershell or WSL2 |
| Ubuntu  | Docker Engine  | bash               |

## 들어가기 앞서서..

MLOps를 사용하기 위해 필요한 도커 사용법을 설명하니 많은 비유와 예시가 MLOps 쪽으로 치중되어 있을 수 있습니다.
