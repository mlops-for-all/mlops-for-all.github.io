---
title : "[Practice] Docker command"
description: "Practice to use docker command."
lead: ""
draft: false
weight: 104
images: []
contributors: ["Jongseob Jeon", "Jaeyeon Kim"]
menu:
  prerequisites:
    parent: "docker"
---

## 1. 정상 설치 확인

```bash
docker run hello-world
```

정상적으로 설치된 경우 다음과 같은 메시지를 확인할 수 있습니다.

```text
Hello from Docker!
This message shows that your installation appears to be working correctly.
....
```

**(For ubuntu)** sudo 없이 사용하고 싶다면 아래 사이트를 참고합니다.

- [https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user](https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user)

## 2. Docker Pull

docker image registry(도커 이미지를 저장하고 공유할 수 있는 저장소)로부터 Docker image 를 가져오는 커맨드입니다.

아래 커맨드를 통해 docker pull에서 사용 가능한 argument들을 확인할 수 있습니다.

```bash
docker pull --help
```

정상적으로 수행되면 아래와 같이 출력됩니다.

```text
Usage:  docker pull [OPTIONS] NAME[:TAG|@DIGEST]

Pull an image or a repository from a registry

Options:
  -a, --all-tags                Download all tagged images in the repository
      --disable-content-trust   Skip image verification (default true)
      --platform string         Set platform if server is multi-platform capable
  -q, --quiet                   Suppress verbose output
```

여기서 알 수 있는 것은 바로 docker pull은 두 개 타입의 argument를 받는다는 것을 알 수 있습니다.

1. `[OPTIONS]`
2. `NAME[:TAG|@DIGEST]`

help에서 나온 `-a`, -`q` 옵션을 사용하기 위해서는 NAME 앞에서 사용해야 합니다.

직접 `ubuntu:18.04` 이미지를 pull 해보겠습니다.

```bash
docker pull ubuntu:18.04
```

위 명령어를 해석하면 `ubuntu` 라는 이름을 가진 이미지 중 `18.04` 태그가 달려있는 이미지를 가져오라는 뜻입니다.

만약, 정상적으로 수행된다면 다음과 비슷하게 출력됩니다.

```text
18.04: Pulling from library/ubuntu
20d796c36622: Pull complete 
Digest: sha256:42cd9143b6060261187a72716906187294b8b66653b50d70bc7a90ccade5c984
Status: Downloaded newer image for ubuntu:18.04
docker.io/library/ubuntu:18.04
```

위의 명령어를 수행하면 [docker.io/library](http://docker.io/library/) 라는 이름의 registry 에서 ubuntu:18.04 라는 image 를 여러분의 노트북에 다운로드 받게됩니다.

- 참고사항
  - 추후 [docker.io](http://docker.io) 나 public 한 docker hub 와 같은 registry 대신에, 특정 **private** 한 registry 에서 docker image 를 가져와야 하는 경우에는, `docker login` 을 통해서 특정 registry 를 바라보도록 한 뒤, docker pull 을 수행하는 형태로 사용합니다.
  - 폐쇄망에서 docker image 를 `.tar` 파일과 같은 형태로 저장하고 공유할 수 있도록 `docker save`, `docker load` 와 같은 명령어도 존재합니다.

## 3. Docker images

로컬에 존재하는 docker image 리스트를 출력하는 커맨드입니다.

```bash
docker images --help
```

docker images에서 사용할 수 있는 argument는 다음과 같습니다.

```text
Usage:  docker images [OPTIONS] [REPOSITORY[:TAG]]

List images

Options:
  -a, --all             Show all images (default hides intermediate images)
      --digests         Show digests
  -f, --filter filter   Filter output based on conditions provided
      --format string   Pretty-print images using a Go template
      --no-trunc        Don't truncate output
  -q, --quiet           Only show image IDs
```

아래 명령어를 이용해 직접 실행해 보겠습니다.

```bash
docker images
```

만약 도커를 최초 설치 후 이 실습을 진행한다면 다음과 비슷하게 출력됩니다.

```text
REPOSITORY   TAG       IMAGE ID       CREATED      SIZE
ubuntu       18.04     29e70752d7b2   2 days ago   56.7MB
```

줄 수 있는 Argument중 `-q`를 사용하면 `IMAGE ID` 만 출력됩니다.

```bash
docker images -q
```

```text
29e70752d7b2
```

## 4. Docker ps

현재 실행 중인 도커 컨테이너 리스트를 출력하는 커맨드입니다.

```bash
docker ps --help
```

docker ps에서 사용할 수 있는 argument는 다음과 같습니다.

```text
Usage:  docker ps [OPTIONS]

List containers

Options:
  -a, --all             Show all containers (default shows just running)
  -f, --filter filter   Filter output based on conditions provided
      --format string   Pretty-print containers using a Go template
  -n, --last int        Show n last created containers (includes all states) (default -1)
  -l, --latest          Show the latest created container (includes all states)
      --no-trunc        Don't truncate output
  -q, --quiet           Only display container IDs
  -s, --size            Display total file sizes
```

아래 명령어를 이용해 직접 실행해 보겠습니다.

```bash
docker ps
```

따로 실행되는 컨테이너가 없다면 다음과 같이 나옵니다.

```text
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

만약 실행되는 컨테이너가 있다면 다음과 비슷하게 나옵니다.

```text
CONTAINER ID   IMAGE     COMMAND        CREATED          STATUS          PORTS     NAMES
c1e8f5e89d8d   ubuntu    "sleep 3600"   13 seconds ago   Up 12 seconds             trusting_newton
```

## 5. Docker run

도커 컨테이너를 실행시키는 커맨드입니다.

```bash
docker run --help
```

docker run을 실행하는 명령어는 다음과 같습니다.

```text
Usage:  docker run [OPTIONS] IMAGE [COMMAND] [ARG...]

Run a command in a new container
```

여기서 우리가 확인해야 하는 것은 바로 docker run은 세 개 타입의 argument를 받는다는 것을 알 수 있습니다.

1. `[OPTIONS]`
2. `[COMMAND]`
3. `[ARG...]`

직접 도커 컨테이너를 실행해 보겠습니다.

```bash
## Usage:  docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
docker run -it --name demo1 ubuntu:18.04 /bin/bash
```

- `-it` : `-i` 옵션 + `-t` 옵션
  - container 를 실행시킴과 동시에 interactive 한 terminal 로 접속시켜주는 옵션
- `--name` : name
  - 컨테이너 id 대신, 구분하기 쉽도록 지정해주는 이름
- `/bin/bash`
  - 컨테이너를 실행시킴과 동시에 실행할 커맨드로, `/bin/bash` 는 bash 쉘을 여는 것을 의미합니다.

실행 후 `exit` 명령어를 통해 컨테이너를 종료합니다.

이 제 앞서 배웠던 `docker ps` 명령어를 치면 다음과 같이 나옵니다.

```text
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

실행되고 있는 컨테이너가 나온다고 했지만 어째서인지 방금 실행한 컨테이너가 보이지 않습니다.
그 이유는 `docker ps`는 기본값으로 현재 동작 중인 컨테이너를 보여주기 때문입니다.

만약 종료된 컨테이너들도 보고 싶다면 `-a` 옵션을 주어야 합니다.

```bash
docker ps -a
```

그러면 다음과 같이 종료된 컨테이너 목록도 나옵니다.

```text
CONTAINER ID   IMAGE          COMMAND       CREATED         STATUS                     PORTS     NAMES
4c1aa74a382a   ubuntu:18.04   "/bin/bash"   2 minutes ago   Exited (0) 2 minutes ago             demo1
```

## 6. Docker exec

Docker 컨테이너 내부에서 명령을 내리거나, 내부로 접속하는 커맨드입니다.

```bash
docker exec --help
```

예를 들어서 다음과 같은 명령어를 실행해 보겠습니다.

```bash
docker run -d --name demo2 ubuntu:18.04 sleep 3600
```

여기서 `-d` 옵션은 도커 컨테이너를 백그라운드에서 실행시켜서, 컨테이너에서 접속 종료를 하더라도, 계속 실행 중이 되도록 하는 커맨드입니다.

`docker ps`를 통해 현재 실행중인지 확인합니다.

다음과 같이 실행 중임을 확인할 수 있습니다.

```text
CONTAINER ID   IMAGE          COMMAND        CREATED         STATUS         PORTS     NAMES
fc88a83e90f0   ubuntu:18.04   "sleep 3600"   4 seconds ago   Up 3 seconds             demo2
```

이제 `docker exec` 명령어를 통해서 실행중인 도커 컨테이너에 접속해 보겠습니다.

```bash
docker exec -it demo2 /bin/bash
```

이 전의 `docker run`과 동일하게 container 내부에 접속할 수 있습니다.

`exit`을 통해 종료합니다.

## 7. Docker logs

도커 컨테이너의 log를 확인하는 커맨드 입니다.

```bash
docker logs --help
```

다음과 같은 컨테이너를 실행시키도록 하겠습니다.

```bash
docker run --name demo3 -d busybox sh -c "while true; do $(echo date); sleep 1; done"
```

위 명령어를 통해서 test 라는 이름의 busybox 컨테이너를 백그라운드에서 도커 컨테이너로 실행하여, 1초에 한 번씩 현재 시간을 출력하도록 했습니다.

이제 아래 명령어를 통해 log를 확인해 보겠습니다.

```bash
docker logs demo3
```

정상적으로 수행되면 아래와 비슷하게 나옵니다.

```text
Sun Mar  6 11:06:49 UTC 2022
Sun Mar  6 11:06:50 UTC 2022
Sun Mar  6 11:06:51 UTC 2022
Sun Mar  6 11:06:52 UTC 2022
Sun Mar  6 11:06:53 UTC 2022
Sun Mar  6 11:06:54 UTC 2022
```

그런데 이렇게 사용할 경우 여태까지 찍힌 log 밖에 확인할 수 없습니다.  
이 때 `-f` 옵션을 이용해 계속 watch 하며 출력할 수 있습니다.

```bash
docker logs demo3 -f    
```

## 8. Docker stop

실행 중인 도커 컨테이너를 중단시키는 커맨드입니다.

```bash
docker stop --help
```

`docker ps`를 통해 현재 실행 중인 컨테이너를 확인하면 다음과 같습니다.

```text
CONTAINER ID   IMAGE          COMMAND                  CREATED              STATUS              PORTS     NAMES
730391669c39   busybox        "sh -c 'while true; …"   About a minute ago   Up About a minute             demo3
fc88a83e90f0   ubuntu:18.04   "sleep 3600"             4 minutes ago        Up 4 minutes                  demo2
```

이제 `docker stop` 을 통해 도커를 정지해 보겠습니다.

```bash
docker stop demo2
```

실행 후 `docker ps`를 다시 입력합니다.

```text
CONTAINER ID   IMAGE     COMMAND                  CREATED         STATUS         PORTS     NAMES
730391669c39   busybox   "sh -c 'while true; …"   2 minutes ago   Up 2 minutes             demo3
```

위의 결과와 비교했을 때 demo2 컨테이터가 없어진 것을 확인할 수 있습니다.

나머지 컨테이터도 종료합니다.

```bash
docker stop demo3
```

## 9. Docker rm

도커 컨테이너를 삭제하는 커맨드입니다.

```bash
docker rm --help
```

도커 컨테이너는 기본적으로 종료가 된 상태로 있습니다. 그래서 `docker ps -a`를 통해서 종료된 컨테이너도 볼 수 있습니다.
그런데 종료된 컨테이너는 왜 지워야 할까요?  
종료되어 있는 도커에는 이전에 사용한 데이터가 아직 컨테이너 내부에 남아있습니다.
그래서 restart 등을 통해서 컨테이너를 재시작할 수 있습니다.
그런데 이 과정에서 disk를 사용하게 됩니다.

그래서 완전히 사용하지 않는 컨테이너를 지우기 위해서는 `docker rm` 명령어를 사용해야 합니다.

우선 현재 컨테이너들을 확인합니다.

```text
docker ps -a
```

다음과 같이 3개의 컨테이너가 있습니다.

```text
CONTAINER ID   IMAGE          COMMAND                  CREATED          STATUS                            PORTS     NAMES
730391669c39   busybox        "sh -c 'while true; …"   4 minutes ago    Exited (137) About a minute ago             demo3
fc88a83e90f0   ubuntu:18.04   "sleep 3600"             7 minutes ago    Exited (137) 2 minutes ago                  demo2
4c1aa74a382a   ubuntu:18.04   "/bin/bash"              10 minutes ago   Exited (0) 10 minutes ago                   demo1
```

아래 명령어를 통해 `demo3` 컨테이너를 삭제해 보겠습니다.

```bash
docker rm demo3
```

`docker ps -a` 명령어를 치면 다음과 같이 2개로 줄었습니다.

```text
CONTAINER ID   IMAGE          COMMAND        CREATED          STATUS                       PORTS     NAMES
fc88a83e90f0   ubuntu:18.04   "sleep 3600"   13 minutes ago   Exited (137) 8 minutes ago             demo2
4c1aa74a382a   ubuntu:18.04   "/bin/bash"    16 minutes ago   Exited (0) 16 minutes ago              demo1
```

나머지 컨테이너들도 삭제합니다.

```text
docker rm demo2
docker rm demo1
```

## 10. Docker rmi

도커 이미지를 삭제하는 커맨드입니다.

```bash
docker rmi --help
```

아래 명령어를 통해 현재 어떤 이미지들이 로컬에 있는지 확인합니다.

```bash
docker images
```

다음과 같이 출력됩니다.

```bash
REPOSITORY   TAG       IMAGE ID       CREATED        SIZE
busybox      latest    a8440bba1bc0   32 hours ago   1.41MB
ubuntu       18.04     29e70752d7b2   2 days ago     56.7MB
```

`busybox` 이미지를 삭제해 보겠습니다.

```bash
docker rmi busybox
```

다시 `docker images`를 칠 경우 다음과 같이 나옵니다.

```bash
REPOSITORY   TAG       IMAGE ID       CREATED        SIZE
ubuntu       18.04     29e70752d7b2   2 days ago     56.7MB
```

## References

- [https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
