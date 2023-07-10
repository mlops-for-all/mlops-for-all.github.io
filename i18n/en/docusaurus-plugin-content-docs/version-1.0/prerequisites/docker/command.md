---
title : "[Practice] Docker command"
description: "Practice to use docker command."
sidebar_position: 4
contributors: ["Jongseob Jeon", "Jaeyeon Kim"]
---

## 1. Normal installation confirmation

```bash
docker run hello-world
```

If installed correctly, you should be able to see the following message.

```text
Hello from Docker!
This message shows that your installation appears to be working correctly.
....
```


**(For ubuntu)** If you want to use without sudo, please refer to the following site.

- [https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user](https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user)

## 2. Docker Pull

Docker pull is a command to download Docker images from a Docker image registry (a repository where Docker images are stored and shared).

You can check the arguments available in docker pull using the command below.

```bash
docker pull --help
```

If performed normally, it prints out as follows.

```text
Usage:  docker pull [OPTIONS] NAME[:TAG|@DIGEST]

Pull an image or a repository from a registry

Options:
  -a, --all-tags                Download all tagged images in the repository
      --disable-content-trust   Skip image verification (default true)
      --platform string         Set platform if server is multi-platform capable
  -q, --quiet                   Suppress verbose output
```

It can be seen here that docker pull takes two types of arguments. 

1. `[OPTIONS]`
2. `NAME[:TAG|@DIGEST]`

In order to use the `-a` and `-q` options from help, they must be used before the NAME. 
Let's try and pull the `ubuntu:18.04` image directly.

```bash
docker pull ubuntu:18.04
```

If interpreted correctly, the command means to pull an image with the tag `18.04` from an image named `ubuntu`.

If performed successfully, it will produce an output similar to the following.

```text
18.04: Pulling from library/ubuntu
20d796c36622: Pull complete 
Digest: sha256:42cd9143b6060261187a72716906187294b8b66653b50d70bc7a90ccade5c984
Status: Downloaded newer image for ubuntu:18.04
docker.io/library/ubuntu:18.04
```

If you perform the above command, you will download the image called 'ubuntu:18.04' from a registry named [docker.io/library](http://docker.io/library/) to your laptop.

- Note that 
  - in the future, if you need to get a docker image from a certain **private** registry instead of docker.io or public docker hub, you can use [`docker login`](https://docs.docker.com/engine/reference/commandline/login/) to point to the certain registry, then use `docker pull`. Alternatively, you can set up an [insecure registry]((https://stackoverflow.com/questions/42211380/add-insecure-registry-to-docker)). 
  - Also note that [`docker save`](https://docs.docker.com/engine/reference/commandline/save/) and [`docker load`](https://docs.docker.com/engine/reference/commandline/load/) commands are available to store and share docker images in the form of `.tar` file in an intranet.


## 3. Docker images

This is the command to list the Docker images that exist locally.

```bash
docker images --help
```

The arguments available for use in docker images are as follows.

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

Let's try executing the command below directly.

```bash
docker images
```

If you install Docker and proceed with this practice, it will output something similar to this.

```text
REPOSITORY   TAG       IMAGE ID       CREATED      SIZE
ubuntu       18.04     29e70752d7b2   2 days ago   56.7MB
```

If you use the `-q` argument among the possible arguments, only the `IMAGE ID` will be printed.

```bash
docker images -q
```

```text
29e70752d7b2
```

## 4. Docker ps

Command to output the list of currently running Docker containers.

```bash
docker ps --help
```

Use the following arguments can be used with 'docker ps':

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

Let's try running the command below directly.

```bash
docker ps
```

If there are no currently running containers, it will be as follows.

```text
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

If there is a container running, it will look similar to this.

```text
CONTAINER ID   IMAGE     COMMAND        CREATED          STATUS          PORTS     NAMES
c1e8f5e89d8d   ubuntu    "sleep 3600"   13 seconds ago   Up 12 seconds             trusting_newton
```

## 5. Docker run

Command to run a Docker container.

```bash
docker run --help
```

The command to run docker run is as follows.

```text
Usage:  docker run [OPTIONS] IMAGE [COMMAND] [ARG...]

Run a command in a new container
```

What we need to confirm here is that the docker run command takes three types of arguments. 

1. `[OPTIONS]`
2. `[COMMAND]`
3. `[ARG...]`

Let's try running a docker container ourselves.

```bash
## Usage:  docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
docker run -it --name demo1 ubuntu:18.04 /bin/bash
```

- `-it`: Combination of `-i` and `-t` options
  - Runs the container and connects it to an interactive terminal
- `--name`: Assigns a name to the container for easier identification instead of using the container ID
- `/bin/bash`: Specifies the command to be executed in the container upon startup, where `/bin/bash` opens a bash shell.

After running the command, you can exit the container by using the `exit` command.

When you enter the previously learned `docker ps` command, the following output will be displayed.
```text
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

It was said that the container being executed was coming out, but for some reason the container that was just executed does not appear. The reason is that `docker ps` shows the currently running containers by default. If you want to see the stopped containers too, you must give the `-a` option.
```bash
docker ps -a
```

Then the list of terminated containers will also be displayed.

```text
CONTAINER ID   IMAGE          COMMAND       CREATED         STATUS                     PORTS     NAMES
4c1aa74a382a   ubuntu:18.04   "/bin/bash"   2 minutes ago   Exited (0) 2 minutes ago             demo1
```

## 6. Docker exec

Docker exec is a command that is used to issue commands or access the inside of a Docker container.

```bash
docker exec --help
```
For example, let's try running the following command.

```bash
docker run -d --name demo2 ubuntu:18.04 sleep 3600
```

Here, the `-d` option is a command that allows the Docker container to run in the background so that even if the connection ends to the container, it continues to run.

Use `docker ps` to check if it is currently running.

It can be confirmed that it is running as follows.

```text
CONTAINER ID   IMAGE          COMMAND        CREATED         STATUS         PORTS     NAMES
fc88a83e90f0   ubuntu:18.04   "sleep 3600"   4 seconds ago   Up 3 seconds             demo2
```

Now let's connect to the running docker container through the `docker exec` command.

```bash
docker exec -it demo2 /bin/bash
```

This is the same as the previous `docker run` command, allowing you to access the inside of the container.
 
You can exit using `exit`.
## 7. Docker logs

```bash
docker logs --help
```

I will have the following container be executed.

```bash
docker run --name demo3 -d busybox sh -c "while true; do $(echo date); sleep 1; done"
```

By using the above command, we have set up a busybox container named "test" as a Docker container in the background and printed the current time once every second.

Now let's check the log with the command below.

```bash
docker logs demo3
```

If performed normally, it will be similar to below.

```text
Sun Mar  6 11:06:49 UTC 2022
Sun Mar  6 11:06:50 UTC 2022
Sun Mar  6 11:06:51 UTC 2022
Sun Mar  6 11:06:52 UTC 2022
Sun Mar  6 11:06:53 UTC 2022
Sun Mar  6 11:06:54 UTC 2022
```
However, if used this way, you can only check the logs taken so far.  
In this case, you can use the `-f` option to keep watching and outputting.

```bash
docker logs demo3 -f    
```

## 8. Docker stop

Command to stop a running Docker container.

```bash
docker stop --help
```

Through `docker ps`, you can check the containers currently running, as follows.

```text
CONTAINER ID   IMAGE          COMMAND                  CREATED              STATUS              PORTS     NAMES
730391669c39   busybox        "sh -c 'while true; …"   About a minute ago   Up About a minute             demo3
fc88a83e90f0   ubuntu:18.04   "sleep 3600"             4 minutes ago        Up 4 minutes                  demo2
```
Now let's try to stop Docker with `docker stop`.

```bash
docker stop demo2
```

After executing, type `docker ps` again.

```text
CONTAINER ID   IMAGE     COMMAND                  CREATED         STATUS         PORTS     NAMES
730391669c39   busybox   "sh -c 'while true; …"   2 minutes ago   Up 2 minutes             demo3
```

Comparing with the above result, you can see that the demo2 container has disappeared from the list of currently running containers.
The rest of the containers will also be stopped.

```bash
docker stop demo3
```

Docker rm: Command to delete a Docker container.

```bash
docker rm --help
```

Docker containers are in a stopped state by default. That's why you can see stopped containers using `docker ps -a`.
But why do we have to delete the stopped containers?  
Even when stopped, the data used in the Docker remains in the container.
So you can restart the container through restarting. But this process will use disk.
So
 in order to delete the containers that are not used at all, we should use the `docker rm` command.
 
 First, let's check the current containers.

```text
docker ps -a
```

There are three containers as follows.

```text
CONTAINER ID   IMAGE          COMMAND                  CREATED          STATUS                            PORTS     NAMES
730391669c39   busybox        "sh -c 'while true; …"   4 minutes ago    Exited (137) About a minute ago             demo3
fc88a83e90f0   ubuntu:18.04   "sleep 3600"             7 minutes ago    Exited (137) 2 minutes ago                  demo2
4c1aa74a382a   ubuntu:18.04   "/bin/bash"              10 minutes ago   Exited (0) 10 minutes ago                   demo1
```

Let's try to delete the 'demo3' container through the following command.

```bash
docker rm demo3
```

The command `docker ps -a` reduced it to two lines as follows.

```text
CONTAINER ID   IMAGE          COMMAND        CREATED          STATUS                       PORTS     NAMES
fc88a83e90f0   ubuntu:18.04   "sleep 3600"   13 minutes ago   Exited (137) 8 minutes ago             demo2
4c1aa74a382a   ubuntu:18.04   "/bin/bash"    16 minutes ago   Exited (0) 16 minutes ago              demo1
```

Delete the remaining containers as well.

```text
docker rm demo2
docker rm demo1
```

## 10. Docker rmi

Command to delete a Docker image.

```bash
docker rmi --help
```

Use the following commands to check which images are currently on the local.

```bash
docker images
```

The following is output.

```bash
REPOSITORY   TAG       IMAGE ID       CREATED        SIZE
busybox      latest    a8440bba1bc0   32 hours ago   1.41MB
ubuntu       18.04     29e70752d7b2   2 days ago     56.7MB
```

I will try to delete the `busybox` image.

```bash
docker rmi busybox
```

If you type `docker images` again, the following will appear.

```bash
REPOSITORY   TAG       IMAGE ID       CREATED        SIZE
ubuntu       18.04     29e70752d7b2   2 days ago     56.7MB
```

## References

- [https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
