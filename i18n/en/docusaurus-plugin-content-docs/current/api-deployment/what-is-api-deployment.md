---
title : "1. What is API Deployment?"
description: ""
sidebar_position: 1
date: 2021-12-22
lastmod: 2021-12-22
contributors: ["Youngcheol Jang"]
---

## What is API Deployment?

After training a machine learning model, how should it be used? When training a machine learning model, you expect a model with higher performance to come out, but when you infer with the trained model, you want to get the inference results quickly and easily.

When you want to check the inference results of the model, you can load the trained model and infer through a Jupyter notebook or a Python script. However, this method becomes inefficient as the model gets bigger, and you can only use the model in the environment where the trained model exists and cannot be used by many people.

Therefore, when machine learning is used in actual services, it uses an API to use the trained model. The model is loaded only once in the environment where the API server is running, and you can easily get the inference results using DNS, and you can also link it with other services.

However, there is a lot of ancillary work necessary to make the model into an API. In order to make it easier to make an API, machine learning frameworks such as Tensorflow have developed inference engines.

Using inference engines, we can create APIs (REST or gRPC) that can load and infer from machine learning models developed and trained in the corresponding frameworks. When we send a request with the data we want to infer to an API server built using these inference engines, the engine performs the inference and sends back the results in the response.

Some well-known open-source inference engines include:

- [Tensorflow: Tensorflow Serving](https://github.com/tensorflow/serving)
- [PyTorch: Torchserve](https://github.com/pytorch/serve)
- [ONNX: ONNX Runtime](https://github.com/microsoft/onnxruntime)

While not officially supported in open-source, there are also inference engines developed for popular frameworks like sklearn and XGBoost.

Deploying and serving the model's inference results through an API is called **API deployment**.

## Serving Framework

I introduced the fact that various inference engines have been developed. Now, if we want to deploy these inference engines in a Kubernetes environment for API deployment, what steps are involved? We need to deploy various Kubernetes resources such as Deployments for the inference engines, Services to create endpoints for sending inference requests, and Ingress to forward external inference requests to the inference engines. Additionally, we may need to handle requirements such as scaling out when there is a high volume of inference requests, monitoring the status of the inference engines, and updating the version when an improved model is available. There are many considerations when operating an inference engine, and it goes beyond just a few tasks.

To address these requirements, serving frameworks have been developed to further abstract the deployment of inference engines in a Kubernetes environment.

Some popular serving frameworks include:

- [Seldon Core](https://github.com/SeldonIO/seldon-core)
- [Kserve](https://github.com/kserve)
- [BentoML](https://github.com/bentoml/BentoML)

In *MLOps for ALL*, we use Seldon Core to demonstrate the process of API deployment.
