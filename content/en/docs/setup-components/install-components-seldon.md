---
title : "3. Seldon-Core"
description: "구성요소 설치 - Seldon-Core"
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

### 정상 설치 확인

Sample SeldonDeployment이 생성되는지 확인해보는 것으로 정상 설치되었는지 확인합니다.

새로운 파일을 생성합니다.

```text
vi sample-sklearn.yaml
```

다음 내용을 해당 파일에 복사한 뒤, 저장합니다.

```text
apiVersion: machinelearning.seldon.io/v1alpha2
kind: SeldonDeployment
metadata:
  name: sklearn
  namespace: seldon-system
spec:
  predictors:
  - graph:
      name: classifier
      implementation: SKLEARN_SERVER
      modelUri: gs://seldon-models/v1.13.0-dev/sklearn/iris
    name: default
    replicas: 1
    svcOrchSpec:
      env:
      - name: SELDON_LOG_LEVEL
        value: DEBUG
```

SeldonDeployment 를 배포합니다.

```text
kubectl apply -f sample-sklearn.yaml
```

seldon-system namespace 에 1 개의 `sklearn-defulat-xxx` 라는 이름의 pod 가 Running 이 될 때까지 기다립니다.

```text
NAME                                                            READY   STATUS    RESTARTS   AGE
ambassador-7f596c8b57-k8sxq                                     1/1     Running   0          4h53m
ambassador-7f596c8b57-q4zsf                                     1/1     Running   0          4h53m
ambassador-7f596c8b57-tgxcr                                     1/1     Running   0          4h53m
ambassador-agent-77bccdfcd5-jx789                               1/1     Running   0          4h53m
seldon-controller-manager-8457b8b5c7-cf58w                      1/1     Running   0          4h52m
seldon-core-analytics-grafana-657c956c88-ng8wn                  2/2     Running   0          8m13s
seldon-core-analytics-kube-state-metrics-94bb6cb9-svs82         1/1     Running   0          8m13s
seldon-core-analytics-prometheus-alertmanager-64cf7b8f5-nxbl8   2/2     Running   0          8m13s
seldon-core-analytics-prometheus-node-exporter-5rrj5            1/1     Running   0          8m13s
seldon-core-analytics-prometheus-pushgateway-8476474cff-sr4n6   1/1     Running   0          8m13s
seldon-core-analytics-prometheus-seldon-685c664894-7cr45        2/2     Running   0          8m13s
sklearn-default-0-classifier-9df66d44f-xxprt                    2/2     Running   0          3m33s
```

SeldonDeployment 로 API Request 를 보내기 위해, ambassador 서비스의 IP 를 확인합니다.

```text
kubectl get svc -n seldon-system
```

```text
NAME                                             TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)                      AGE
ambassador                                       LoadBalancer   10.98.241.143    <pending>     80:32193/TCP,443:30875/TCP   4h54m
ambassador-admin                                 ClusterIP      10.105.233.154   <none>        8877/TCP,8005/TCP            4h54m
seldon-core-analytics-grafana                    ClusterIP      10.103.205.237   <none>        80/TCP                       9m5s
seldon-core-analytics-kube-state-metrics         ClusterIP      10.111.64.38     <none>        8080/TCP                     9m5s
seldon-core-analytics-prometheus-alertmanager    ClusterIP      10.104.100.234   <none>        80/TCP                       9m5s
seldon-core-analytics-prometheus-node-exporter   ClusterIP      None             <none>        9100/TCP                     9m5s
seldon-core-analytics-prometheus-pushgateway     ClusterIP      10.97.106.255    <none>        9091/TCP                     9m5s
seldon-core-analytics-prometheus-seldon          ClusterIP      10.101.12.152    <none>        80/TCP                       9m5s
seldon-webhook-service                           ClusterIP      10.103.13.214    <none>        443/TCP                      4h53m
sklearn-default                                  ClusterIP      10.98.139.98     <none>        8000/TCP,5001/TCP            4m
sklearn-default-classifier                       ClusterIP      10.103.231.187   <none>        9000/TCP,9500/TCP            4m25s
```

ambassador 라는 이름의 서비스가 LoadBalancer 타입으로 생성되어있으며, PORT 에 80:<SOME_PORT> 으로 매핑이 되어있음을 확인할 수 있습니다.(위의 예시에서는 <SOME_PORT> == 32193 입니다.)

`<클러스터의 IP>:<SOME_PORT>/seldon/seldon-system/sklearn/api/v1.0/doc/` 주소로 접속합니다. 본 문서에서 검증한 환경에서는 `http://172.25.0.129:32193/seldon/seldon-system/sklearn/api/v1.0/doc/` 주소로 접속하겠습니다.

다음과 같은 Swagger UI 화면이 생성되어있는 것을 확인할 수 있습니다.

<p align="center">
  <img src="/images/docs/setup-modules/seldon-api.png" title="seldon-api"/>
</p>

그럼 이제 방금 생성한 SeldonDeployment 로 API Request 를 요청해봅니다. 아래 예시의 `172.25.0.129:32193` 부분을 여러분의 `<클러스터의 IP>:<SOME_PORT>`로 변경해주시기 바랍니다.

```text
curl -X POST http://172.25.0.129:32193/seldon/seldon-system/sklearn/api/v1.0/predictions     -H 'Content-Type: application/json'     -d '{ "data": { "ndarray": [[1,2,3,4]] } }'
```

다음과 같은 응답이 오면 Seldon-Core 가 정상적으로 설치된 것을 의미합니다.

```text
{"data":{"names":["t:0","t:1","t:2"],"ndarray":[[0.0006985194531162835,0.00366803903943666,0.995633441507447]]},"meta":{"requestPath":{"classifier":"seldonio/sklearnserver:1.11.2"}}}
```

## References

- [Example Model Servers with Seldon](https://docs.seldon.io/projects/seldon-core/en/latest/examples/server_examples.html#examples-server-examples--page-root)
