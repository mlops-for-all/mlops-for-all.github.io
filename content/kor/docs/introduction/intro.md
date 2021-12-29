---
title : "1. What is MLOps?"
description: "Introduction to MLOps"
lead: ""
date: 2021-12-03
lastmod: 2021-12-13
draft: false
weight: 101
contributors: ["Jongseob Jeon"]
menu:
  docs:
    parent: "introduction"
---

## Machine Learning Project

2012년 Alexnet 이후 CV, NLP를 비롯하여 데이터가 존재하는 도메인이라면 어디서든 머신러닝과 딥러닝을 도입하고자 하였습니다.  
딥러닝과 머신러닝은 AI라는 단어로 묶이며 불렸고 많은 매체에서 AI의 필요성을 외쳤습니다. 그리고 무수히 많은 기업에서 머신러닝과 딥러닝을 이용한 수많은 프로젝트를 진행하였습니다. 하지만 그 결과는 어떻게 되었을까요?  
엘리먼트 AI의 음병찬 동북아 지역 총괄책임자는 [*"10개 기업에 AI 프로젝트를 시작한다면 그중 9개는 컨셉검증(POC)만 하다 끝난다"*](https://zdnet.co.kr/view/?no=20200611062002)고 말했습니다.

이처럼 많은 프로젝트에서 머신러닝과 딥러닝은 이 문제를 풀 수 있을 것 같다는 가능성만을 보여주고 사라졌습니다. 그리고 이 시기쯤에 [AI에 다시 겨울](https://www.aifutures.org/2021/ai-winter-is-coming/)이 다가오고 있다는 전망도 나오기 시작했습니다.

왜 프로젝트 대부분이 컨셉검증(POC) 단계에서 끝났을까요?  
머신러닝과 딥러닝 코드만으로는 실제 서비스를 운영할 수 없기 때문입니다.

실제 서비스 단계에서 머신러닝과 딥러닝의 코드가 차지하는 부분은 생각보다 크지 않기 때문에, 단순히 모델의 성능만이 아닌 다른 많은 부분을 고려해야 합니다.  
구글은 이런 문제를 2015년 [Hidden Technical Debt in Machine Learning Systems](https://proceedings.neurips.cc/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf)에서 지적한 바 있습니다.  
하지만 이 논문이 나올 당시에는 아직 많은 머신러닝 엔지니어들이 딥러닝과 머신러닝의 가능성을 입증하기 바쁜 시기였기 때문에, 논문이 지적하는 바에 많은 주의를 기울이지는 않았습니다.

그리고 몇 년이 지난 후 머신러닝과 딥러닝은 가능성을 입증해내어, 이제 사람들은 실제 서비스에 적용하고자 했습니다.  
하지만 곧 많은 사람이 실제 서비스는 쉽지 않다는 것을 깨달았습니다.
****

## Before MLOps

사람들은 머신러닝과 딥러닝을 일반적인 소프트웨어와 같은 시선으로 바라보고 기존과 같은 방식으로 운영하고자 했습니다.

일반적인 소프트웨어에서는 어떤 문제가 발생하면 해당 부분을 담당한 소프트웨어 엔지니어가 문제의 원인을 진단하고 이를 해결한 후 다시 배포하는 프로세스를 거칩니다.

<p align="center">
  <img src="/images/docs/introduction/before-mlops.png" title="before-mlops"/>
</p>

따라서 머신러닝 모델을 포함한 서비스를 배포하기 위해서는 머신러닝 엔지니어가 직접 모델을 학습한 뒤, 학습이 완료된 모델 파일들을 배포를 담당하는 소프트웨어 엔지니어에게 전달하였습니다. 이때 두 직군 간의 소통의 매개체는 **학습된 모델**이었습니다.

<p align="center">
  <img src="/images/docs/introduction/cartoon.jpg" title="cartoon" width=50%/>
</p>

다시 말해, 머신러닝 엔지니어와 소프트웨어 엔지니어들은 **모델(*Network 구조와 Weights가 담긴 파일*)** 을 매개체로 서로 소통했습니다.  
머신러닝 엔지니어들은 DB에서 직접 쿼리를 이용해 데이터를 내려받고 모델을 학습 후, 학습된 모델을 소프트웨어 엔지니어에게 전달하였고, 소프트웨어 엔지니어는 전달받은 모델을 로드한 뒤, 정해진 추론(inference) 함수를 제공하는 API Server를 만들어 배포하였습니다.

이 과정에서 소프트웨어 엔지니어는 안정된 서비스 개발 및 배포를 위해, 머신러닝 엔지니어에게 정해진 형식에 맞춰서 구현할 것을 요청합니다. 예를 들면 OS, 파이썬 버전, 사용한 패키지, 클래스 구조 등을 포함합니다.

소프트웨어 엔지니어와 머신러닝 엔지니어는 서로 어떤 환경에서 작업하는지 알지 못하기 때문에, 소통의 과정에서 미리 약속한 형식에서 하나라도 어긋난다면 배포와 성능 재현 문제가 발생합니다.  
예를 들어서 개발 환경에서는 동작했던 코드가 실행 환경에서는 동작하지 않는다든지, 개발 환경과 같은 성능이 재현되지 않는 문제가 발생하게 됩니다.

## After MLOps

<p align="center">
  <img src="/images/docs/introduction/after-mlops.png" title="after-mlops"/>
</p>

MLOps에서는 **파이프라인**을 이용해 서로 소통합니다. 여기서 파이프라인이란 단순히 학습된 모델만이 아닌 모델에 종속된 모든 작업을 포함한 개념입니다.

### Continuous Integration & Deployment

머신러닝 엔지니어는 데이터를 내려받고, 전처리를 수행하며, 모델을 생성하기까지의 모든 과정을 파이프라인의 형태로 작성하여 소프트웨어 엔지니어에게 전달하고, 소프트웨어 엔지니어는 전달받은 파이프라인에서 생성된 모델을 배포합니다.  
머신러닝 엔지니어와 소프트웨어 엔지니어는 같은 파이프라인을 사용하기 때문에 언제 어디서나 같은 성능의 모델을 빌드하고 배포하는 것을 보장할 수 있게 됩니다.

### Continuous Training

머신러닝 모델은 한 번 학습되어 뛰어난 성능을 보였던 모델이라고 하더라도, 시간이 지남에 따라 성능이 저하되는 경우가 자주 발생합니다. 학습 데이터가 충분히 일반적이지 않거나, 실제 배포 환경에서의 테스트 데이터의 분포가 변화하기도 하기 때문입니다.
이 때문에 최신 데이터를 이용해 모델 성능 하락의 원인을 분석하고, 새로운 모델을 개발하거나 재학습하여 성능을 다시 끌어올리는 작업은 자주 수행되어야 합니다. 기존과 같은 모델을 매개체로 하는 소통에서는 머신러닝 엔지니어가 수동으로 학습을 새로 진행한 뒤, 새로 학습된 모델을 소프트웨어 엔지니어에게 전달했다면, 잘 설계된 파이프라인을 사용하여 Continuous Training 프로세스를 자동화할 수 있습니다.