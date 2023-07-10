---
title: "1. Install Python virtual environment"
sidebar_position: 1
---

## Python virtual environment

When working with Python, there may be cases where you want to use multiple versions of Python environments or manage package versions separately for different projects.

To easily manage Python environments or Python package environments in a virtualized manner, there are tools available such as pyenv, conda, virtualenv, and venv.

Among these, *MLOps for ALL* covers the installation of [pyenv](https://github.com/pyenv/pyenv) and [pyenv-virtualenv](https://github.com/pyenv/pyenv-virtualenv).  
pyenv helps manage Python versions, while pyenv-virtualenv is a plugin for pyenv that helps manage Python package environments.

## Installing pyenv

### Prerequisites

Prerequisites vary depending on the operating system. Please refer to the [following page](https://github.com/pyenv/pyenv/wiki#suggested-build-environment) and install the required packages accordingly.

### Installation - macOS

1. Install pyenv, pyenv-virtualenv

```bash
brew update
brew install pyenv
brew install pyenv-virtualenv
```

2. Set pyenv

For macOS, assuming the use of zsh since the default shell has changed to zsh in Catalina version and later, setting up pyenv.

```bash
echo 'eval "$(pyenv init -)"' >> ~/.zshrc
echo 'eval "$(pyenv virtualenv-init -)"' >> ~/.zshrc
source ~/.zshrc
```

Check if the pyenv command is executed properly.

```bash
pyenv --help
```

```bash
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

### Installation - Ubuntu

1. Install pyenv and pyenv-virtualenv

```bash
curl https://pyenv.run | bash
```

If the following content is output, it means that the installation is successful.

```bash
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:--   0     0    0     0    0     0      0      0 --:--:-- --:--:-- 100   270  100   270    0     0    239      0  0:00:01  0:00:01 --:--:--   239
Cloning into '/home/mlops/.pyenv'...
r
...
Skip...
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

2. Set pyenv

Assuming the use of bash shell as the default shell, configure pyenv and pyenv-virtualenv to be used in bash.

```bash
sudo vi ~/.bashrc
```

Enter the following string and save it.

```bash
export PATH="$HOME/.pyenv/bin:$PATH"
eval "$(pyenv init -)"
eval "$(pyenv virtualenv-init -)"
```

Restart the shell.

```bash
exec $SHELL
```

Check if the pyenv command is executed properly.

```bash
pyenv --help
```

If the following message is displayed, it means that the settings have been configured correctly.

```bash
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

## Using pyenv

### Install python version

Using the `pyenv install <Python-Version>` command, you can install the desired Python version.  
In this page, we will install the Python 3.7.12 version that is used by Kubeflow by default as an example.

```bash
pyenv install 3.7.12
```

If installed normally, the following message will be printed.

```bash
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

### Create python virtual environment

Create a Python virtual environment with the `pyenv virtualenv <Installed-Python-Version> <Virtual-Environment-Name>` command to create a Python virtual environment with the desired Python version.

For example, let's create a Python virtual environment called `demo` with Python 3.7.12 version.
```bash
pyenv virtualenv 3.7.12 demo
```

```bash
$ pyenv virtualenv 3.7.12 demo
Looking in links: /tmp/tmpffqys0gv
Requirement already satisfied: setuptools in /home/mlops/.pyenv/versions/3.7.12/envs/demo/lib/python3.7/site-packages (47.1.0)
Requirement already satisfied: pip in /home/mlops/.pyenv/versions/3.7.12/envs/demo/lib/python3.7/site-packages (20.1.1)
```

### Activating python virtual environment

Use the `pyenv activate <environment name>` command to use the virtual environment created in this way.

For example, we will use a Python virtual environment called `demo`.

```bash
pyenv activate demo
```


You can see that the information of the current virtual environment is printed at the front of the shell.

  Before

  ```bash
  mlops@ubuntu:~$ pyenv activate demo
  ```

  After

  ```bash
  pyenv-virtualenv: prompt changing will be removed from future release. configure `export PYENV_VIRTUALENV_DISABLE_PROMPT=1' to simulate the behavior.
  (demo) mlops@ubuntu:~$ 
  ```

### Deactivating python virtual environment

You can deactivate the currently active virtualenv by using the command `source deactivate`.

```bash
source deactivate
```

  Before

  ```bash
  (demo) mlops@ubuntu:~$ source deactivate
  ```

  After

  ```bash
  mlops@ubuntu:~$ 
  ```
