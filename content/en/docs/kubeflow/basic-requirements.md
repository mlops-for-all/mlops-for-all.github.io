---
title : "Install Requirements"
description: ""
lead: ""
draft: false
weight: 311
contributors: ["Jongseob Jeon"]
menu:
  docs:
    parent: "kubeflow"
---

실습을 위해 권장하는 파이썬 버전은 python>=3.7 입니다.

실습을 진행하기에서 필요한 패키지들과 버전은 다음과 같습니다.

- requirements.txt

  ```text
  kfp
  scikit-learn
  mlflow
  pandas
  dill
  ```

패키지 설치를 진행합니다.

```bash
pip3 install -U pip
pip3 install  kfp scikit-learn mlflow pandas dill
```
