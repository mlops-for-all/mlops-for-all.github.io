---
title : "1. What is API Deployment?"
description: ""
sidebar_position: 1
date: 2021-12-22
lastmod: 2021-12-22
contributors: ["Youngcheol Jang"]
---

## API Deployment란?

머신러닝 모델을 학습한 뒤에는 어떻게 사용해야 할까요?  
머신러닝을 학습할 때는 더 높은 성능의 모델이 나오기를 기대하지만, 학습된 모델을 사용하여 추론을 할 때는 빠르고 쉽게 추론 결과를 받아보고 싶을 것입니다.

모델의 추론 결과를 확인하고자 할 때 주피터 노트북이나 파이썬 스크립트를 통해 학습된 모델을 로드한 뒤 추론할 수 있습니다.  
그렇지만 이런 방법은 모델이 클수록 모델을 불러오는 데 많은 시간을 소요하게 되어서 비효율적입니다. 또한 이렇게 이용하면 많은 사람이 모델을 이용할 수 없고 학습된 모델이 있는 환경에서밖에 사용할 수 없습니다.

그래서 실제 서비스에서 머신러닝이 사용될 때는 API를 이용해서 학습된 모델을 사용합니다. 모델은 API 서버가 구동되는 환경에서 한 번만 로드가 되며, DNS를 활용하여 외부에서도 쉽게 추론 결과를 받을 수 있고 다른 서비스와 연동할 수 있습니다.

하지만 모델을 API로 만드는 작업에는 생각보다 많은 부수적인 작업이 필요합니다.  
그래서 API로 만드는 작업을 더 쉽게 하기 위해서 Tensorflow와 같은 머신러닝 프레임워크 진영에서는 추론 엔진(Inference engine)을 개발하였습니다.

추론 엔진들을 이용하면 해당 머신러닝 프레임워크로 개발되고 학습된 모델을 불러와 추론이 가능한 API(REST 또는 gRPC)를 생성합니다.  
이러한 추론 엔진을 활용하여 구축한 API 서버로 추론하고자 하는 데이터를 담아 요청을 보내면, 추론 엔진이 추론 결과를 응답에 담아 전송하는 것입니다.

대표적으로 다음과 같은 오픈소스 추론 엔진들이 개발되었습니다.

- [Tensorflow : Tensorflow Serving](https://github.com/tensorflow/serving)
- [PyTorch : Torchserve](https://github.com/pytorch/serve)
- [Onnx : Onnx Runtime](https://github.com/microsoft/onnxruntime)

오프소스에서 공식적으로 지원하지는 않지만, 많이 쓰이는 sklearn, xgboost 프레임워크를 위한 추론 엔진도 개발되어 있습니다.

이처럼 모델의 추론 결과를 API의 형태로 받아볼 수 있도록 배포하는 것을 **API Deployment**라고 합니다.

## Serving Framework

위에서 다양한 추론 엔진들이 개발되었다는 사실을 소개해 드렸습니다.
쿠버네티스 환경에서 이러한 추론 엔진들을 사용하여 API Deployment를 한다면 어떤 작업이 필요할까요?
추론 엔진을 배포하기 위한 Deployment, 추론 요청을 보낼 Endpoint를 생성하기 위한 Service,
외부에서의 추론 요청을 추론 엔진으로 보내기 위한 Ingress 등 많은 쿠버네티스 리소스를 배포해 주어야 합니다.
이것 이외에도, 많은 추론 요청이 들어왔을 경우의 스케일 아웃(scale-out), 추론 엔진 상태에 대한 모니터링, 개선된 모델이 나왔을 경우 버전 업데이트 등 추론 엔진을 운영할 때의 요구사항은 한두 가지가 아닙니다.

이러한 많은 요구사항을 처리하기 위해 추론 엔진들을 쿠버네티스 환경 위에서 한 번 더 추상화한 **Serving Framework**들이 개발되었습니다.

개발된 Serving Framework들은 다음과 같은 오픈소스들이 있습니다.

- [Seldon Core](https://github.com/SeldonIO/seldon-core)
- [Kserve](https://github.com/kserve)
- [BentoML](https://github.com/bentoml/BentoML)

*모두의 MLOps*에서는 Seldon Core를 사용하여 API Deployment를 하는 과정을 다루어 보도록 하겠습니다.
