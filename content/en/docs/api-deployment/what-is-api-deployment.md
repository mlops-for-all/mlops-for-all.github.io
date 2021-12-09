---
title : "What is API deployment"
description: ""
lead: ""
# date: 2020-10-06T08:48:23+00:00
# lastmod: 2020-10-06T08:48:23+00:00
draft: false
weight: 401
contributors: ["Youngcheol Jang"]
menu:
  docs:
    parent: "api-deployment"
images: []
---

## API deployment 란?

머신러닝 모델을 학습한 뒤에는 어떻게 사용해야 할까요?
머신러닝을 학습할 때에는 더 높은 성능의 모델이 나오기를 기대하지만, 학습된 모델을 사용하여 추론을 할 때에는 빠르고 쉽게 추론 결과를 받아보고 싶을 것입니다. 
이런 작업을 보다 더 쉽게 하기 위해서, 많은 머신러닝 프레임워크 진영에서 Inference engine이라고 부르는 추론 시스템을 개발하였습니다. 이 추론 시스템들은 해당 머신러닝 프레임워크를 사용하여 학습된 모델을 불러와 REST 또는 gRPC의 프로토콜을 사용하여 추론 API를 제공합니다. 추론을 하고자 하는 데이터를 담아 요청을 보내면, 추론 시스템이 추론 결과를 응답에 담아 전송하는 것입니다.
그렇다면 공개된 추론 시스템은 어떤 것들이 있을까요? 다음과 같은 추론 시스템들이 개발되었습니다.

- [Tenworflow : Tensorflow Serving](https://github.com/tensorflow/serving)
- [PyTorch : Torchserve](https://github.com/pytorch/serve)
- [Onnx : Onnx Runtime](https://github.com/microsoft/onnxruntime)

이것 이외에도 sklearn, xgboost 프레임워크를 위한 추론 엔진이 오픈소스 진영에서 개발되었습니다.

이렇게 API의 형태로 추론 요청을 보낼 수 있는 형태로 모델을 배포하는 것을 **API deployment**라고 합니다.

## 많은 프레임워크, 많은 부담

이거 힘들었어, 
그래서 추상화를 지


학습한 뒤라는 것은 모델의 성능이 충분히 확보되어 더 이상 모델의 변경이 필요하지 않다는 말이기도 합니다. 이 덕분에 
