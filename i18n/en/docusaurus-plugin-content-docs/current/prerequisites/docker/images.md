---
title : "[Practice] Docker images"
description: "Practice to use docker image."
sidebar_position: 5
contributors: ["Jongseob Jeon", "Jaeyeon Kim"]
---

## 1. Dockerfile 만들기

도커 이미지를 만드는 가장 쉬운 방법은 도커에서 제공하는 템플릿인 Dockerfile을 사용하는 것입니다.  
이외에는 running container 를 docker image 로 만드는 `docker commit` 등을 활용하는 방법이 있습니다.

- `Dockerfile`
  - 사용자가 도커 이미지를 쉽게 만들 수 있도록, 제공하는 템플릿
  - 파일명은 꼭 `Dockerfile` 이 아니어도 상관없지만, `docker build` 수행 시, default 로 사용하는 파일명이 `Dockerfile` 입니다.
  - 도커 이미지를 만드는 `docker build` 를 수행할 때, `-f` 옵션을 주면 다른 파일명으로도 사용 가능합니다.
    - ex) `docker build -f dockerfile-asdf .` 도 가능

1. 실습을 위해서 편한 디렉토리로 이동합니다.

    ```bash
    cd <SOME-DIRECTORY>
    ```

2. docker-practice 라는 이름의 폴더를 생성합니다.

    ```bash
    mkdir docker-practice
    ```

3. docker-practice 폴더로 이동합니다.

    ```bash
    cd docker-practice
    ```

4. Dockerfile 이라는 빈 파일을 생성합니다.

    ```bash
    touch Dockerfile
    ```

5. 정상적으로 생성되었는지 확인합니다.

    ```bash
    ls
    ```

## 2. Dockerfile 내장 명령어

Dockerfile 에서 사용할 수 있는 기본적인 명령어에 대해서 하나씩 알아보겠습니다.

### FROM

Dockerfile 이 base image 로 어떠한 이미지를 사용할 것인지를 명시하는 명령어입니다.  
도커 이미지를 만들 때, 아무것도 없는 빈 환경에서부터 하나하나씩 제가 의도한 환경을 만들어가는게 아니라, python 3.9 버전이 설치된 환경을 베이스로해두고, 저는 pytorch 를 설치하고, 제 소스코드만 넣어두는 형태로 활용할 수가 있습니다.  
이러한 경우에는 `python:3.9`, `python-3.9-alpine`, ... 등의 잘 만들어진 이미지를 베이스로 활용합니다.

```docker
FROM <image>[:<tag>] [AS <name>]

# 예시
FROM ubuntu
FROM ubuntu:18.04
FROM nginx:latest AS ngx
```

### COPY

**host(로컬)에서의 `<src>`** 경로의 파일 혹은 디렉토리를 **container 내부에서의 `<dest>`** 경로에 복사하는 명령어입니다.

```docker
COPY <src>... <dest>

# 예시
COPY a.txt /some-directory/b.txt
COPY my-directory /some-directory-2
```

`ADD` 는 `COPY` 와 비슷하지만 추가적인 기능을 품고 있습니다.

```docker
# 1 - 호스트에 압축되어있는 파일을 풀면서 컨테이너 내부로 copy 할 수 있음
ADD scripts.tar.gz /tmp
# 2 - Remote URLs 에 있는 파일을 소스 경로로 지정할 수 있음
ADD http://www.example.com/script.sh /tmp

# 위 두 가지 기능을 사용하고 싶을 경우에만 COPY 대신 ADD 를 사용하는 것을 권장
```

### RUN

명시한 커맨드를 도커 컨테이너 내부에서 실행하는 명령어입니다.  
도커 이미지는 해당 커맨드들이 실행된 상태를 유지합니다.

```docker
RUN <command>
RUN ["executable-command", "parameter1", "parameter2"]

# 예시
RUN pip install torch
RUN pip install -r requirements.txt
```

### CMD

명시한 커맨드를 도커 컨테이너가 **시작될 때**, 실행하는 것을 명시하는 명령어입니다.  
비슷한 역할을 하는 명령어로 **ENTRYPOINT** 가 있습니다. 이 둘의 차이에 대해서는 **뒤에서** 다룹니다.  
하나의 도커 이미지에서는 하나의 **CMD** 만 실행할 수 있다는 점에서 **RUN** 명령어와 다릅니다.

```docker
CMD <command>
CMD ["executable-command", "parameter1", "parameter2"]
CMD ["parameter1", "parameter2"] # ENTRYPOINT 와 함께 사용될 때

# 예시
CMD python main.py
```

### WORKDIR

이후 추가될 명령어를 컨테이너 내의 어떤 디렉토리에서 수행할 것인지를 명시하는 명령어입니다.  
만약, 해당 디렉토리가 없다면 생성합니다.

```docker
WORKDIR /path/to/workdir

# 예시
WORKDIR /home/demo
RUN pwd # /home/demo 가 출력됨
```

### ENV

컨테이너 내부에서 지속적으로 사용될 environment variable 의 값을 설정하는 명령어입니다.

```docker
ENV <KEY> <VALUE>
ENV <KEY>=<VALUE>

# 예시
# default 언어 설정
RUN locale-gen ko_KR.UTF-8
ENV LANG ko_KR.UTF-8
ENV LANGUAGE ko_KR.UTF-8
ENV LC_ALL ko_KR.UTF-8
```

### EXPOSE

컨테이너에서 뚫어줄 포트/프로토콜을 지정할 수 있습니다.  
`<protocol>` 을 지정하지 않으면 TCP 가 디폴트로 설정됩니다.

```docker
EXPOSE <port>
EXPOSE <port>/<protocol>

# 예시
EXPOSE 8080
```

## 3. 간단한 Dockerfile 작성해보기

`vim Dockerfile` 혹은 vscode 등 본인이 사용하는 편집기로 `Dockerfile` 을 열어 다음과 같이 작성해줍니다.

```docker
# base image 를 ubuntu 18.04 로 설정합니다.
FROM ubuntu:18.04

# apt-get update 명령을 실행합니다.
RUN apt-get update

# TEST env var의 값을 hello 로 지정합니다.
ENV TEST hello

# DOCKER CONTAINER 가 시작될 때, 환경변수 TEST 의 값을 출력합니다.
CMD echo $TEST
```

## 4. Docker build from Dockerfile

`docker build` 명령어로 Dockerfile 로부터 Docker Image 를 만들어봅니다.

```bash
docker build --help
```

Dockerfile 이 있는 경로에서 다음 명령을 실행합니다.

```bash
docker build -t my-image:v1.0.0 .
```

위 커맨드를 설명하면 다음과 같습니다.

- `.` : **현재 경로**에 있는 Dockerfile 로부터
- `-t` : my-image 라는 **이름**과 v1.0.0 이라는 **태그**로 **이미지**를
- 빌드하겠다라는 명령어

정상적으로 이미지 빌드되었는지 확인해 보겠습니다.

```bash
# grep : my-image 가 있는지를 잡아내는 (grep) 하는 명령어
docker images | grep my-image
```

정상적으로 수행된다면 다음과 같이 출력됩니다.

```text
my-image     v1.0.0    143114710b2d   3 seconds ago   87.9MB
```

## 5. Docker run from Dockerfile

그럼 이제 방금 빌드한 `my-image:v1.0.0` 이미지로 docker 컨테이너를 **run** 해보겠습니다.

```bash
docker run my-image:v1.0.0
```

정상적으로 수행된다면 다음과 같이 나옵니다.

```text
hello
```

## 6. Docker run with env

이번에는 방금 빌드한 `my-image:v1.0.0` 이미지를 실행하는 시점에, `TEST` env var 의 값을 변경하여 docker 컨테이너를 run 해보겠습니다.

```bash
docker run -e TEST=bye my-image:v1.0.0
```

정상적으로 수행된다면 다음과 같이 나옵니다.

```text
bye
```
