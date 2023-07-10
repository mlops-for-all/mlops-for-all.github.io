---
title : "[Practice] Docker images"
description: "Practice to use docker image."
sidebar_position: 5
contributors: ["Jongseob Jeon", "Jaeyeon Kim"]
---

- `docker commit`
  - running container 를 docker image 로 만드는 방법
  - `docker commit -m "message" -a "author" <container-id> <image-name>`
  - `docker commit` 을 사용하면, 수동으로 Dockerfile 을 만들지 않고도 도커 이미지를 만들 수 있습니다.
    ```
    touch Dockerfile
    ```

3. Move to the docker-practice folder.

4. Create an empty file called Dockerfile.

1. 이미지에 특정 패키지를 설치하는 명령어는 무엇입니까?

Answer: `RUN`

Translation: Let's look at the basic commands that can be used in Dockerfile one by one. FROM is a command that specifies which image to use as a base image for Dockerfile. When creating a Docker image, instead of creating the environment I intend from scratch, I can use a pre-made image such as `python:3.9`, `python-3.9-alpine`, etc. as the base and install pytorch and add my source code.
```docker
FROM <image>[:<tag>] [AS <name>]

# 예시
FROM ubuntu
FROM ubuntu:18.04
FROM nginx:latest AS ngx
```

The command to copy files or directories from the `<src>` path on the host (local) to the `<dest>` path inside the container.
```docker
COPY <src>... <dest>

# 예시
COPY a.txt /some-directory/b.txt
COPY my-directory /some-directory-2
```

ADD is similar to COPY but it has additional features.
```docker
# 1 - 호스트에 압축되어있는 파일을 풀면서 컨테이너 내부로 copy 할 수 있음
ADD scripts.tar.gz /tmp
# 2 - Remote URLs 에 있는 파일을 소스 경로로 지정할 수 있음
ADD http://www.example.com/script.sh /tmp

# 위 두 가지 기능을 사용하고 싶을 경우에만 COPY 대신 ADD 를 사용하는 것을 권장
```

The command to run the specified command inside a Docker container. 
Docker images maintain the state in which the commands are executed.
```docker
RUN <command>
RUN ["executable-command", "parameter1", "parameter2"]

# 예시
RUN pip install torch
RUN pip install -r requirements.txt
```

CMD specifies a command that the Docker container will **run when it starts**. There is a similar command called **ENTRYPOINT**. The difference between them will be discussed **later**. Note that only one **CMD** can be run in one Docker image, which is different from **RUN** command.
```docker
CMD <command>
CMD ["executable-command", "parameter1", "parameter2"]
CMD ["parameter1", "parameter2"] # ENTRYPOINT 와 함께 사용될 때

# 예시
CMD python main.py
```

WORKDIR is a command that specifies which directory inside the container to perform future additional commands. If the directory does not exist, it will be created.
```docker
WORKDIR /path/to/workdir

# 예시
WORKDIR /home/demo
RUN pwd # /home/demo 가 출력됨
```

This is a command to set the value of environment variables that will be used continuously inside the container.
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

You can specify the port/protocol to be opened from the container. If `<protocol>` is not specified, TCP is set as the default.
```docker
EXPOSE <port>
EXPOSE <port>/<protocol>

# 예시
EXPOSE 8080
```
Write a simple Dockerfile by using `vim Dockerfile` or an editor like vscode and write the following:
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

Use the `docker build` command to create a Docker Image from a Dockerfile.
```bash
docker build --help
```

Run the following command from the path where the Dockerfile is located.
```bash
docker build -t my-image:v1.0.0 .
```

The command above means to build an image with the name "my-image" and the tag "v1.0.0" from the Dockerfile in the current path. Let's check if the image was built successfully.
```bash
# grep : my-image 가 있는지를 잡아내는 (grep) 하는 명령어
docker images | grep my-image
```
If performed normally, it will output as follows.
```text
my-image     v1.0.0    143114710b2d   3 seconds ago   87.9MB
```

Let's now **run** a docker container with the `my-image:v1.0.0` image that we just built.
```bash
docker run my-image:v1.0.0
```

If performed normally, it will result in the following.
```text
hello
```

Let's run a docker container and change the value of the `TEST` env var at the time of running the `my-image:v1.0.0` image we just built.
```bash
docker run -e TEST=bye my-image:v1.0.0
```
If performed normally, it will be as follows.
```text
bye
```


