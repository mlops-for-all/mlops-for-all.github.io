---
title : "Seldon-Core"
description: "구성요소 설치 - Seldon-Core"
date: 2021-12-13
lastmod: 2021-12-13
draft: false
weight: 255
contributors: ["Jaeyeon Kim"]
menu:
  docs:
    parent: "setup-components"
images: []
---

## Seldon-Core

Seldon-Core는 쿠버네티스 환경에 수많은 머신러닝 모델을 배포하고 관리할 수 있는 오픈소스 프레임워크 중 하나입니다.  
보다 자세한 내용은 Seldon-Core 의 공식 [제품 설명 페이지](https://www.seldon.io/tech/products/core/) 와 [깃헙](https://github.com/SeldonIO/seldon-core) 그리고 API Deployment 파트를 참고해주시기 바랍니다.

## Selon-Core 설치

Seldon-Core를 사용하기 위해서는 쿠버네티스의 인그레스(Ingress)를 담당하는 Ambassador 와 Istio 와 같은 [모듈이 필요합니다](https://docs.seldon.io/projects/seldon-core/en/latest/workflow/install.html).  
Seldon-Core 에서는 Ambassador 와 Istio 만을 공식적으로 지원하며, *모두의 MLOps*에서는 Ambassador를 사용해 Seldon-core를 사용하므로 Ambassador를 설치하겠습니다.

### Ambassador - Helm Repository 추가

```text
helm repo add datawire https://www.getambassador.io
```

다음과 같은 메시지가 출력되면 정상적으로 추가된 것을 의미합니다.

```text
"datawire" has been added to your repositories
```

### Ambassador - Helm Repository 업데이트

```text
helm repo update
```

다음과 같은 메시지가 출력되면 정상적으로 업데이트된 것을 의미합니다.

```text
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "datawire" chart repository
Update Complete. ⎈Happy Helming!⎈
```

### Ambassador - Helm Install

ambassador Chart 6.9.3 버전을 설치합니다.

```text
helm install ambassador datawire/ambassador \
  --namespace seldon-system \
  --create-namespace \
  --set image.repository=quay.io/datawire/ambassador \
  --set enableAES=false \
  --set crds.keep=false \
  --version 6.9.3
```

다음과 같은 메시지가 출력되어야 합니다.

```text
생략...

W1206 17:01:36.026326   26635 warnings.go:70] rbac.authorization.k8s.io/v1beta1 Role is deprecated in v1.17+, unavailable in v1.22+; use rbac.authorization.k8s.io/v1 Role
W1206 17:01:36.029764   26635 warnings.go:70] rbac.authorization.k8s.io/v1beta1 RoleBinding is deprecated in v1.17+, unavailable in v1.22+; use rbac.authorization.k8s.io/v1 RoleBinding
NAME: ambassador
LAST DEPLOYED: Mon Dec  6 17:01:34 2021
NAMESPACE: seldon-system
STATUS: deployed
REVISION: 1
NOTES:
-------------------------------------------------------------------------------
  Congratulations! You've successfully installed Ambassador!

-------------------------------------------------------------------------------
To get the IP address of Ambassador, run the following commands:
NOTE: It may take a few minutes for the LoadBalancer IP to be available.
     You can watch the status of by running 'kubectl get svc -w  --namespace seldon-system ambassador'

  On GKE/Azure:
  export SERVICE_IP=$(kubectl get svc --namespace seldon-system ambassador -o jsonpath='{.status.loadBalancer.ingress[0].ip}')

  On AWS:
  export SERVICE_IP=$(kubectl get svc --namespace seldon-system ambassador -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')

  echo http://$SERVICE_IP:

For help, visit our Slack at http://a8r.io/Slack or view the documentation online at https://www.getambassador.io.
```

seldon-system 에 4 개의 pod 가 Running 이 될 때까지 기다립니다.

```text
kubectl get pod -n seldon-system
```

```text
ambassador-7f596c8b57-4s9xh                  1/1     Running   0          7m15s
ambassador-7f596c8b57-dt6lr                  1/1     Running   0          7m15s
ambassador-7f596c8b57-h5l6f                  1/1     Running   0          7m15s
ambassador-agent-77bccdfcd5-d5jxj            1/1     Running   0          7m15s
```

### Seldon-Core - Helm Install

seldon-core-operator Chart 1.11.2 버전을 설치합니다.

```text
helm install seldon-core seldon-core-operator \
    --repo https://storage.googleapis.com/seldon-charts \
    --namespace seldon-system \
    --set usageMetrics.enabled=true \
    --set ambassador.enabled=true \
    --version 1.11.2
```

다음과 같은 메시지가 출력되어야 합니다.

```text
생략...

W1206 17:05:38.336391   28181 warnings.go:70] admissionregistration.k8s.io/v1beta1 ValidatingWebhookConfiguration is deprecated in v1.16+, unavailable in v1.22+; use admissionregistration.k8s.io/v1 ValidatingWebhookConfiguration
NAME: seldon-core
LAST DEPLOYED: Mon Dec  6 17:05:34 2021
NAMESPACE: seldon-system
STATUS: deployed
REVISION: 1
TEST SUITE: None
```

seldon-system namespace 에 1 개의 seldon-controller-manager pod 가 Running 이 될 때까지 기다립니다.

```text
kubectl get pod -n seldon-system | grep seldon-controller
```

```text
seldon-controller-manager-8457b8b5c7-r2frm   1/1     Running   0          2m22s
```

# TODO (jaeyeon.kim) Seldon Deployment 생성 후, prometheus, grafana 연동 스크린샷

