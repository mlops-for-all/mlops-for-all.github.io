---
title : "3. Components of MLOps"
description: "Describe MLOps Components"
sidebar_position: 3
date: 2021-12-03
lastmod: 2021-12-10
contributors: ["Youngcheol Jang"]
---

Google's white paper [Practitioners guide to MLOps: A framework for continuous delivery and automation of machine learning] published in May 2021 mentions the following core functionalities of MLOps: 
![mlops-component](./img/mlops-component.png)
Let's look at what each feature does.

- 데이터를 인식하고 정규화하기 위한 데이터 적재 기능 제공
- 데이터 전처리를 위한 데이터 정제 기능 제공
- 데이터 생성 및 샘플링 기능 제공

Experimentation is a feature which provides machine learning engineers with the ability to analyze data and create prototype models to implement learning functions such as integrated notebook (Jupyter Notebook) environments with version control tools such as Git, experiment tracking functions which include used data, hyperparameters and evaluation metrics, and analysis and visualization capabilities for data and models.

Data Processing is a feature which provides a large amount of data available for use in
- 데이터 세트의 전처리를 간편하게 하기 위한 도구 제공
- 데이터 세트를 분할하고 트레이닝 및 테스트 데이터로 나누기 위한 도구 제공
- 모델을 학습하기 위한 옵티마이저(Optimizer)의 사용과 조정을 제공
- 학습이 진행되는 동안 모니
- 다수의 GPU/ 분산 학습 사용을 위한 분산 학습 환경 제공
- 하이퍼 파라미터 튜닝과 최적화 기능 제공

English Translation: Model evaluation provides the following functions to observe the performance of a model operating in an experimental environment and in a commercial environment: 

- Model performance evaluation on evaluation data
- Tracking of predictive performance for different continual learning runs
- Comparison and visualization of the performance of different models
- Provision of model output interpretation using interpretable AI techniques
- Provision of distributed learning environment for the use of multiple GPUs/distributed learning
- Provision of hyperparameter tuning and optimization features

Model serving provides the following functions for deploying and serving models in production environments: 
- Low latency and high availability inference capabilities
- Support for multiple ML model serving frameworks (Tensorflow Serving, TorchServe, NVIDIA Triton, Scikit-learn, XGGoost, etc)
- Capability to handle complex inference routines, such as preprocessing or postprocessing, or the use of multiple models for the final result
- Autoscaling to handle spikes in inference requests
- Logging of inference requests and results

Online experimentation provides a function to verify how well a new model will perform when it is deployed. This function must be integrated with the Model Registry in order to deploy the new model. Model Monitoring provides a function to monitor if a model deployed in a production environment is operating normally. For example, it provides information on whether an update is required due to a decrease in the model's performance.

Machine Learning Pipeline (ML Pipeline) provides the following features to configure, control, and automate complex ML training and inference tasks in production environments: features for pipeline execution through a source of various events, machine learning metadata tracking and integration for managing pipeline parameters and generated outputs, support for native components for general machine learning tasks and support for user-implemented components, and capabilities for providing different execution environments.

Model Registry provides functions to centrally manage the lifecycle of machine learning models. It offers features such as registration, tracking, and versioning of trained models and models deployed for distribution, and storing information about the data and runtime packages needed for deployment. It also provides a dataset and feature repository with features for sharing, searching, reusing, and versioning data, real-time processing and low latency serving for event streaming and online inference tasks, and support for various forms of data such as photos, text, and tables.

At each stage of MLOps, a variety of artifacts are generated. ML metadata refers to the information about such artifacts. ML metadata and artifact tracking provide the following features to manage the location, type, attributes, and associated experiments of the artifacts:

- History management feature for ML artifacts
- Tracking and sharing of experiment and pipeline parameter settings
- Provision of storage, access, visualization, and download features for ML artifacts
- Integration with other MLOps features


