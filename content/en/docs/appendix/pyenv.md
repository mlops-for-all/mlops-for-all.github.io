---
title: "1. Python 가상환경 설치"
draft: false
images: []
menu:
  docs:
    parent: "appendix"
weight: 8001
toc: true
---

## 파이썬 가상환경

Python 환경을 사용하다 보면 여러 버전의 Python 환경을 사용하고 싶은 경우나, 여러 프로젝트별 패키지 버전을 따로 관리하고 싶은 경우가 발생합니다.

이처럼 Python 환경 혹은 Python Package 환경을 가상화하여 관리하는 것을 쉽게 도와주는 도구로는 pyenv, conda, virtualenv, venv 등이 존재합니다.

이 중 *모두의 MLOps*에서는 [pyenv](https://github.com/pyenv/pyenv)와 [pyenv-virtualenv](https://github.com/pyenv/pyenv-virtualenv)를 설치하는 방법을 다룹니다.  
pyenv는 Python 버전을 관리하는 것을 도와주며, pyenv-virtualenv는 pyenv의 plugin으로써 Python 패키지 환경을 관리하는 것을 도와줍니다.

## pyenv 설치

### Prerequisites

운영체제별로 Prerequisites가 다릅니다. [다음 페이지](https://github.com/pyenv/pyenv/wiki#suggested-build-environment)를 참고하여 필수 패키지들을 설치해주시기 바랍니다.

### 설치 - macOS

1. pyenv, pyenv-virtualenv 설치

```text
brew update
brew install pyenv
brew install pyenv-virtualenv
```

2. pyenv 설정

기본 shell로 zsh을 사용하는 경우를 가정하였습니다.

```text
echo 'eval "$(pyenv init -)"' >> ~/.zshrc
echo 'eval "$(pyenv virtualenv-init -)"' >> ~/.zshrc
source ~/.zshrc
```

pyenv 명령이 정상적으로 수행되는지 확인합니다.

```text
pyenv --help
```

```text
$ pyenv --help
Usage: pyenv <command> [<args>]

Some useful pyenv commands are:
   --version   Display the version of pyenv
   activate    Activate virtual environment
   commands    List all available pyenv commands
   deactivate   Deactivate virtual environment
   exec        Run an executable with the selected Python version
   global      Set or show the global Python version(s)
   help        Display help for a command
   hooks       List hook scripts for a given pyenv command
   init        Configure the shell environment for pyenv
   install     Install a Python version using python-build
   local       Set or show the local application-specific Python version(s)
   prefix      Display prefix for a Python version
   rehash      Rehash pyenv shims (run this after installing executables)
   root        Display the root directory where versions and shims are kept
   shell       Set or show the shell-specific Python version
   shims       List existing pyenv shims
   uninstall   Uninstall a specific Python version
   version     Show the current Python version(s) and its origin
   version-file   Detect the file that sets the current pyenv version
   version-name   Show the current Python version
   version-origin   Explain how the current Python version is set
   versions    List all Python versions available to pyenv
   virtualenv   Create a Python virtualenv using the pyenv-virtualenv plugin
   virtualenv-delete   Uninstall a specific Python virtualenv
   virtualenv-init   Configure the shell environment for pyenv-virtualenv
   virtualenv-prefix   Display real_prefix for a Python virtualenv version
   virtualenvs   List all Python virtualenvs found in `$PYENV_ROOT/versions/*'.
   whence      List all Python versions that contain the given executable
   which       Display the full path to an executable

See `pyenv help <command>' for information on a specific command.
For full documentation, see: https://github.com/pyenv/pyenv#readme
```

### 설치 - Ubuntu

1. pyenv, pyenv-virtualenv 설치

```text
curl https://pyenv.run | bash
```

다음과 같은 내용이 출력되면 정상적으로 설치된 것을 의미합니다.

```text
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:--   0     0    0     0    0     0      0      0 --:--:-- --:--:-- 100   270  100   270    0     0    239      0  0:00:01  0:00:01 --:--:--   239
Cloning into '/home/mlops/.pyenv'...
r
...
중략...
...
remote: Enumerating objects: 10, done.
remote: Counting objects: 100% (10/10), done.
remote: Compressing objects: 100% (6/6), done.
remote: Total 10 (delta 1), reused 6 (delta 0), pack-reused 0
Unpacking objects: 100% (10/10), 2.92 KiB | 2.92 MiB/s, done.

WARNING: seems you still have not added 'pyenv' to the load path.


# See the README for instructions on how to set up
# your shell environment for Pyenv.

# Load pyenv-virtualenv automatically by adding
# the following to ~/.bashrc:

eval "$(pyenv virtualenv-init -)"

```

2. pyenv 설정

기본 shell로 bash shell을 사용하는 경우를 가정하였습니다.
bash에서 pyenv와 pyenv-virtualenv 를 사용할 수 있도록 설정합니다.

```text
sudo vi ~/.bashrc
```

다음 문자열을 입력한 후 저장합니다.

```text
export PATH="$HOME/.pyenv/bin:$PATH"
eval "$(pyenv init -)"
eval "$(pyenv virtualenv-init -)"
```

shell을 restart 합니다.

```text
exec $SHELL
```

pyenv 명령이 정상적으로 수행되는지 확인합니다.

```text
pyenv --help
```

다음과 같은 메시지가 출력되면 정상적으로 설정된 것을 의미합니다.

```text
$ pyenv
pyenv 2.2.2
Usage: pyenv <command> [<args>]

Some useful pyenv commands are:
   --version   Display the version of pyenv
   activate    Activate virtual environment
   commands    List all available pyenv commands
   deactivate   Deactivate virtual environment
   doctor      Verify pyenv installation and development tools to build pythons.
   exec        Run an executable with the selected Python version
   global      Set or show the global Python version(s)
   help        Display help for a command
   hooks       List hook scripts for a given pyenv command
   init        Configure the shell environment for pyenv
   install     Install a Python version using python-build
   local       Set or show the local application-specific Python version(s)
   prefix      Display prefix for a Python version
   rehash      Rehash pyenv shims (run this after installing executables)
   root        Display the root directory where versions and shims are kept
   shell       Set or show the shell-specific Python version
   shims       List existing pyenv shims
   uninstall   Uninstall a specific Python version
   version     Show the current Python version(s) and its origin
   version-file   Detect the file that sets the current pyenv version
   version-name   Show the current Python version
   version-origin   Explain how the current Python version is set
   versions    List all Python versions available to pyenv
   virtualenv   Create a Python virtualenv using the pyenv-virtualenv plugin
   virtualenv-delete   Uninstall a specific Python virtualenv
   virtualenv-init   Configure the shell environment for pyenv-virtualenv
   virtualenv-prefix   Display real_prefix for a Python virtualenv version
   virtualenvs   List all Python virtualenvs found in `$PYENV_ROOT/versions/*'.
   whence      List all Python versions that contain the given executable
   which       Display the full path to an executable

See `pyenv help <command>' for information on a specific command.
For full documentation, see: https://github.com/pyenv/pyenv#readme
```

## pyenv 사용

### Python 버전 설치

`pyenv install <Python-Version>` 명령을 통해 원하는 파이썬 버전을 설치할 수 있습니다.
이번 페이지에서는 예시로 kubeflow에서 기본으로 사용하는 파이썬 3.7.12 버전을 설치하겠습니다.

```text
pyenv install 3.7.12
```

정상적으로 설치되면 다음과 같은 메시지가 출력됩니다.

```text
$ pyenv install 3.7.12
Downloading Python-3.7.12.tar.xz...
-> https://www.python.org/ftp/python/3.7.12/Python-3.7.12.tar.xz
Installing Python-3.7.12...
patching file Doc/library/ctypes.rst
patching file Lib/test/test_unicode.py
patching file Modules/_ctypes/_ctypes.c
patching file Modules/_ctypes/callproc.c
patching file Modules/_ctypes/ctypes.h
patching file setup.py
patching file 'Misc/NEWS.d/next/Core and Builtins/2020-06-30-04-44-29.bpo-41100.PJwA6F.rst'
patching file Modules/_decimal/libmpdec/mpdecimal.h
Installed Python-3.7.12 to /home/mlops/.pyenv/versions/3.7.12
```

### Python 가상환경 생성

`pyenv virtualenv <Installed-Python-Version> <가상환경-이름>` 명령을 통해 원하는 파이썬 버전의 파이썬 가상환경을 생성할 수 있습니다.

예시로 Python 3.7.12 버전의 `demo`라는 이름의 Python 가상환경을 생성하겠습니다.

```text
pyenv virtualenv 3.7.12 demo
```

```text
mlops@ubuntu:~$ pyenv virtualenv 3.7.12 demo
Looking in links: /tmp/tmpffqys0gv
Requirement already satisfied: setuptools in /home/mlops/.pyenv/versions/3.7.12/envs/demo/lib/python3.7/site-packages (47.1.0)
Requirement already satisfied: pip in /home/mlops/.pyenv/versions/3.7.12/envs/demo/lib/python3.7/site-packages (20.1.1)
```

### Python 가상환경 사용

`pyenv activate <가상환경 이름>` 명령을 통해 위와 같은 방식으로 생성한 가상환경을 사용할 수 있습니다.

예시로는 `demo`라는 이름의 Python 가상환경을 사용하겠습니다.

```text
pyenv activate demo
```

다음과 같이 현재 가상환경의 정보가 shell의 맨 앞에 출력되는 것을 확인할 수 있습니다.

  Before

  ```text
  mlops@ubuntu:~$ pyenv activate demo
  ```

  After

  ```text
  pyenv-virtualenv: prompt changing will be removed from future release. configure `export PYENV_VIRTUALENV_DISABLE_PROMPT=1' to simulate the behavior.
  (demo) mlops@ubuntu:~$ 
  ```

### Python 가상환경 비활성화

`source deactivate` 명령을 통해 현재 사용 중인 가상환경을 비활성화할 수 있습니다.

```text
source deactivate
```

  Before

  ```text
  (demo) mlops@ubuntu:~$ source deactivate
  ```

  After

  ```text
  mlops@ubuntu:~$ 
  ```
