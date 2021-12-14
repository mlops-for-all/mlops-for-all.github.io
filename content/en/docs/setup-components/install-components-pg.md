---
title : "4. Prometheus & Grafana"
description: "구성요소 설치 - Prometheus & Grafana"
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

## Prometheus & Grafana

프로메테우스(Prometheus) 와 그라파나(Grafana) 는 모니터링을 위한 도구입니다.  
안정적인 서비스 운영을 위해서는 서비스와 서비스가 운영되고 있는 인프라의 상태를 지속적으로 관찰하고, 관찰한 메트릭을 바탕으로 문제가 생길 경우 빠르게 대응해야 합니다.  
이러한 모니터링을 효율적으로 수행하기 위한 많은 도구 중 *모두의 MLOps*에서는 오픈소스인 프로메테우스와 그라파나를 사용할 예정입니다.

보다 자세한 내용은 [Prometheus 공식 문서](https://prometheus.io/docs/introduction/overview/), [Grafana 공식 문서](https://grafana.com/docs/)를 확인해주시기 바랍니다.

프로메테우스는 다양한 대상으로부터 Metric을 수집하는 도구이며, 그라파나는 모인 데이터를 시각화하는 것을 도와주는 도구입니다. 서로 간의 종속성은 없지만 상호 보완적으로 사용할 수 있어 함께 사용되는 경우가 많습니다.

이번 페이지에서는 쿠버네티스 클러스터에 프로메테우스와 그라파나를 설치한 뒤, Seldon-Core 로 생성한 SeldonDeployment 로 API 요청을 보내, 정상적으로 Metrics 이 수집되는지 확인해보겠습니다.

본 글에서는 seldonio/seldon-core-analytics Helm Chart 1.12.0 버전을 활용해 쿠버네티스 크러스터에 프로메테우스와 그라파나를 설치하고, Seldon-Core 에서 생성한 SeldonDeployment의 Metrics 을 효율적으로 확인하기 위한 대시보드도 함께 설치합니다.

### Helm Repository 추가

```text
helm repo add seldonio https://storage.googleapis.com/seldon-charts
```

다음과 같은 메시지가 출력되면 정상적으로 추가된 것을 의미합니다.

```text
"seldonio" has been added to your repositories
```

### Helm Repository 업데이트

```text
helm repo update
```

다음과 같은 메시지가 출력되면 정상적으로 업데이트된 것을 의미합니다.

```text
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "seldonio" chart repository
...Successfully got an update from the "datawire" chart repository
Update Complete. ⎈Happy Helming!⎈
```

### Helm Install

seldon-core-analytics Helm Chart 1.12.0 버전을 설치합니다.

```text
helm install seldon-core-analytics seldonio/seldon-core-analytics \
  --namespace seldon-system \
  --version 1.12.0
```

다음과 같은 메시지가 출력되어야 합니다.

```text
생략...
NAME: seldon-core-analytics
LAST DEPLOYED: Tue Dec 14 18:29:38 2021
NAMESPACE: seldon-system
STATUS: deployed
REVISION: 1
```

정상적으로 설치되었는지 확인합니다.

```text
kubectl get pod -n seldon-system | grep seldon-core-analytics
```

seldon-system namespace 에 6 개의 seldon-core-analytics 관련 pod 가 Running 이 될 때까지 기다립니다.

```text
seldon-core-analytics-grafana-657c956c88-ng8wn                  2/2     Running   0          114s
seldon-core-analytics-kube-state-metrics-94bb6cb9-svs82         1/1     Running   0          114s
seldon-core-analytics-prometheus-alertmanager-64cf7b8f5-nxbl8   2/2     Running   0          114s
seldon-core-analytics-prometheus-node-exporter-5rrj5            1/1     Running   0          114s
seldon-core-analytics-prometheus-pushgateway-8476474cff-sr4n6   1/1     Running   0          114s
seldon-core-analytics-prometheus-seldon-685c664894-7cr45        2/2     Running   0          114s
```

### 정상 설치 확인

그럼 이제 그라파나에 정상적으로 접속되는지 확인해보겠습니다.

우선 클라이언트 노드에서 접속하기 위해, 포트포워딩을 수행합니다.

```text
kubectl port-forward svc/seldon-core-analytics-grafana -n seldon-system 8090:80
```

웹 브라우저를 열어 [localhost:8090](http://localhost:8090)으로 접속하면 다음과 같은 화면이 출력됩니다.

<p align="center">
  <img src="/images/docs/setup-modules/grafana-install.png" title="grafana-install"/>
</p>

다음과 같은 접속정보를 입력하여 접속합니다.

- Email or username : `admin`
- Password : `password`

로그인하면 다음과 같은 화면이 출력됩니다.

<p align="center">
  <img src="/images/docs/setup-modules/grafana-install.png" title="grafana-install"/>
</p>

좌측의 대시보드 아이콘을 클릭하여, `Manage` 버튼을 클릭합니다.

<p align="center">
  <img src="/images/docs/setup-modules/dashboard-click.png" title="grafana-install"/>
</p>

기본적인 그라파나 대시보드가 포함되어있는 것을 확인할 수 있습니다. 이 중 `Prediction Analytics` 대시보드를 클릭합니다.

<p align="center">
  <img src="/images/docs/setup-modules/dashboard.png" title="grafana"/>
</p>

Seldon Core API Dashboard 가 보이고, 다음과 같이 출력되는 것을 확인할 수 있습니다.

<p align="center">
  <img src="/images/docs/setup-modules/seldon-dashboard.png" title="grafana"/>
</p>

이제, 지난 페이지에서 생성던(relref 걸기) SeldonDeployment 로 API Request 를 반복적으로 수행해보고, 대시보드에 변화가 일어나는지 확인해봅니다.

```text
curl -X POST http://172.25.0.129:32193/seldon/seldon-system/sklearn/api/v1.0/predictions     -H 'Content-Type: application/json'     -d '{ "data": { "ndarray": [[1,2,3,4]] } }'
```

<p align="center">
  <img src="/images/docs/setup-modules/repeat-curl.png" title="grafana"/>
</p>

다음과 같이 Global Request Rate 이 `0 ops` 에서 순간적으로 상승하는 것을 확인할 수 있습니다.

<p align="center">
  <img src="/images/docs/setup-modules/repeat-raise.png" title="grafana"/>
</p>

이렇게 프로메테우스와 그라파나가 정상적으로 설치된 것을 확인할 수 있습니다.

## References

- [Seldon-Core-Analytics Helm Chart](https://github.com/SeldonIO/seldon-core/tree/master/helm-charts/seldon-core-analytics)
