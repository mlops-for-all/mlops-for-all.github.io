---
title : "1. Central Dashboard"
description: ""
lead: ""
draft: false
weight: 271
contributors: ["Jaeyeon Kim", "SeungTae Kim"]
menu:
  docs:
    parent: kubeflow-ui-guide
---

[Kubeflow 설치]({{< relref "docs/setup-components/install-components-kf.md" >}})를 완료하면, 다음 커맨드를 통해 대시보드에 접속할 수 있습니다.

```text
kubectl port-forward --address 0.0.0.0 svc/istio-ingressgateway -n istio-system 8080:80
```

<p align="center">
  <img src="/images/docs/setup/after-login.png" title="after-login"/>
</p>

Central Dashboard는 Kubeflow에서 제공하는 모든 기능을 통합하여 제공하는 UI입니다. Central Dashboard에서 제공하는 기능은 크게 왼쪽의 탭을 기준으로 구분할 수 있습니다.

<p align="center">
  <img src="/images/docs/kubeflow-dashboard-guide/left-tabs.png" title="left-tabs"/>
</p>

- Home
- Notebooks
- Tensorboards
- Volumes
- Models
- Experiments(AutoML)
- Experiments(KFP)
- Pipelines
- Runs
- Recurring Runs
- Artifacts
- Executions

그럼 이제 기능별 간단한 사용법을 알아보겠습니다.
