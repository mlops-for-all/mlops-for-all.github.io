---
title : "3. Install Requirements"
description: ""
sidebar_position: 3
contributors: ["Jongseob Jeon"]
---

실습을 위해 권장하는 파이썬 버전은 python>=3.7입니다. 파이썬 환경에 익숙하지 않은 분들은 다음 [Appendix 1. 파이썬 가상환경](../appendix/pyenv)을 참고하여 **클라이언트 노드**에 설치해주신 뒤 패키지 설치를 진행해주시기를 바랍니다.

실습을 진행하기에서 필요한 패키지들과 버전은 다음과 같습니다.

- requirements.txt

  ```text
  kfp==1.8.9
  scikit-learn==1.0.1
  mlflow==1.21.0
  pandas==1.3.4
  dill==0.3.4
  ```

[앞에서 만든 파이썬 가상환경](../appendix/pyenv.md#python-가상환경-생성)을 활성화합니다.

```text
pyenv activate demo
```

패키지 설치를 진행합니다.

```text
pip3 install -U pip
pip3 install kfp==1.8.9 scikit-learn==1.0.1 mlflow==1.21.0 pandas==1.3.4 dill==0.3.4
```
