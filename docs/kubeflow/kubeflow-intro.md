---
title : "1. Kubeflow Introduction"
description: ""
sidebar_position: 1
contributors: ["Jongseob Jeon"]
---

Kubeflow를 사용하기 위해서는 컴포넌트(Component)와 파이프라인(Pipeline)을 작성해야 합니다.

*모두의 MLOps*에서 설명하는 방식은 [Kubeflow Pipeline 공식 홈페이지](https://www.kubeflow.org/docs/components/pipelines/overview/quickstart/)에서 설명하는 방식과는 다소 차이가 있습니다. 여기에서는 Kubeflow Pipeline을 워크플로(Workflow)가 아닌 앞서 설명한 [MLOps를 구성하는 요소](../kubeflow/kubeflow-concepts.md#component-contents) 중 하나의 컴포넌트로 사용하기 때문입니다.

그럼 이제 컴포넌트와 파이프라인은 무엇이며 어떻게 작성할 수 있는지 알아보도록 하겠습니다.
