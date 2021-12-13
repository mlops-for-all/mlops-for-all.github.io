---
title : "Prometheus & Grafana"
description: "구성요소 설치 - Prometheus & Grafana"
date: 2021-12-13
lastmod: 2021-12-13
draft: false
weight: 254
contributors: ["Jaeyeon Kim"]
menu:
  docs:
    parent: "setup-components"
images: []
---

## Prometheus & Grafana

프로메테우스(Prometheus) 와 그라파나(Grafana) 는 모니터링을 위한 도구입니다.  
안정적인 서비스 운영을 위해서는 서비스와 서비스가 운영되고 있는 인프라의 상태를 지속적으로 관찰하고, 관찰한 메트릭을 바탕으로 문제가 생길 경우 빠르게 대응해야 합니다.  
이러한 모니터링을 효율적으로 수행하기 위한 많은 도구 중 *모두의 MLOps*에서는 오픈소스인 프로메테우스와 그라파나를 사용할 예정입니다.

보다 자세한 내용은 [Prometheus 공식 문서](https://prometheus.io/docs/introduction/overview/), [Grafana 공식 문서](https://grafana.com/docs/)를 확인해주시기 바랍니다.

프로메테우스는 다양한 대상으로부터 Metric 을 수집하는 도구이며, 그라파나는 모인 데이터를 시각화하는 것을 도와주는 도구입니다. 서로 간의 종속성은 없지만 상호 보완적으로 사용할 수 있어 함께 사용되는 경우가 많습니다.

본 글에서는 kube-prometheus-stack Helm Chart 21.0.0 버전을 활용해 쿠버네티스 크러스터에 프로메테우스와 그라파나를 함께 설치하겠습니다.

### Helm Repository 추가

```text
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
```

다음과 같은 메시지가 출력되면 정상적으로 추가된 것을 의미합니다.

```text
"prometheus-community" has been added to your repositories
```

### Helm Repository 업데이트

```text
helm repo update
```

다음과 같은 메시지가 출력되면 정상적으로 업데이트된 것을 의미합니다.

```text
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "prometheus-community" chart repository
...Successfully got an update from the "datawire" chart repository
Update Complete. ⎈Happy Helming!⎈
```

### Helm Install

kube-prometheus-stack Chart 21.0.0 버전을 설치합니다.

```text
helm install prom-stack prometheus-community/kube-prometheus-stack \
  --namespace monitoring-system \
  --create-namespace
  --version 21.0.0
```

다음과 같은 메시지가 출력되어야 합니다.

```text
생략...
W1206 17:17:04.153330   30670 warnings.go:70] policy/v1beta1 PodSecurityPolicy is deprecated in v1.21+, unavailable in v1.25+
NAME: prom-stack
LAST DEPLOYED: Mon Dec  6 17:16:45 2021
NAMESPACE: monitoring-system
STATUS: deployed
REVISION: 1
NOTES:
kube-prometheus-stack has been installed. Check its status by running:
  kubectl --namespace monitoring-system get pods -l "release=prom-stack"

Visit https://github.com/prometheus-operator/kube-prometheus for instructions on how to create & configure Alertmanager and Prometheus instances using the Operator.
```

정상적으로 설치되었는지 확인합니다.

```text
kubectl get pod -n monitoring-system | grep prom-stack
```

monitoring-system namespace 에 6 개의 prom-stack 관련 pod 가 Running 이 될 때까지 기다립니다.

```text
alertmanager-prom-stack-kube-prometheus-alertmanager-0   2/2     Running   0          62s
prom-stack-grafana-c8bb58f98-hfrz2                       2/2     Running   0          84s
prom-stack-kube-prometheus-operator-68f7d9cd9f-gkbb7     1/1     Running   0          84s
prom-stack-kube-state-metrics-596d7cdf8c-pndsk           1/1     Running   0          84s
prom-stack-prometheus-node-exporter-zkwq9                1/1     Running   0          84s
prometheus-prom-stack-kube-prometheus-prometheus-0       2/2     Running   0          61s
```

#### TODO(jaeyeon.kim) 정상 설치 확인 UI 스크린샷 추가
