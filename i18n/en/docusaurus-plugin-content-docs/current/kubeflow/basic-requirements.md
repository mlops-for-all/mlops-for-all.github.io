---
title : "3. Install Requirements"
description: ""
sidebar_position: 3
contributors: ["Jongseob Jeon"]
---

The recommended Python version for practice is python>=3.7. For those unfamiliar with the Python environment, please refer to [Appendix 1. Python Virtual Environment](../appendix/pyenv) and install the packages on the **client node**.

The packages and versions required for the practice are as follows:

- requirements.txt

  ```bash
  kfp==1.8.9
  scikit-learn==1.0.1
  mlflow==1.21.0
  pandas==1.3.4
  dill==0.3.4
  ```

Activate the [Python virtual environment](../appendix/pyenv.md#python-가상환경-생성) created in the previous section.

```bash
pyenv activate demo
```

We are proceeding with the package installation.

```bash
pip3 install -U pip
pip3 install kfp==1.8.9 scikit-learn==1.0.1 mlflow==1.21.0 pandas==1.3.4 dill==0.3.4
```
