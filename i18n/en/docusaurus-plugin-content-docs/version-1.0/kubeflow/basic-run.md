---
title : "7. Pipeline - Run"
description: ""
sidebar_position: 7
contributors: ["Jongseob Jeon"]
---

## Run Pipeline

Now we will run the uploaded pipeline.

## Before Run

### 1. Create Experiment

Experiments in Kubeflow are units that logically manage runs executed within them.

When you first enter the namespace in Kubeflow, there are no Experiments created. Therefore, you must create an Experiment beforehand in order to run the pipeline. If an Experiment already exists, you can go to [Run Pipeline](../kubeflow/basic-run.md#run-pipeline-1).

Experiments can be created via the Create Experiment button.

![run-0.png](./img/run-0.png)

### 2. Name 입력

![run-1.png](./img/run-1.png)

## Run Pipeline

### 1. Select Create Run

![run-2.png](./img/run-2.png)

### 2. Select Experiment

![run-9.png](./img/run-9.png)

![run-10.png](./img/run-10.png)

### 3. Enter Pipeline Config

Fill in the values of the Config provided when creating the pipeline. The uploaded pipeline requires input values for `number_1` and `number_2`.

![run-3.png](./img/run-3.png)

### 4. Start

Click the Start button after entering the values. The pipeline will start running.

![run-4.png](./img/run-4.png)

## Run Result

The executed pipelines can be viewed in the Runs tab.
Clicking on a run provides detailed information related to the executed pipeline.

![run-5.png](./img/run-5.png)

Upon clicking, the following screen appears. Components that have not yet executed are displayed in gray.

![run-6.png](./img/run-6.png)

When a component has completed execution, it is marked with a green checkmark.

![run-7.png](./img/run-7.png)

If we look at the last component, we can see that it has outputted the sum of the input values, which in this case is 8 (the sum of 3 and 5).

![run-8.png](./img/run-8.png)
