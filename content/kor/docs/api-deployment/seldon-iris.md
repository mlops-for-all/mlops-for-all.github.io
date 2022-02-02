---
title : "2. Deploy SeldonDeployment"
description: ""
lead: ""
date: 2021-12-22
lastmod: 2021-12-22
draft: false
weight: 411
contributors: ["Youngcheol Jang", "SeungTae Kim"]
menu:
  docs:
    parent: "api-deployment"
images: []
---

## SeldonDeployment를 통해 배포하기

이번에는 학습된 모델이 있을 때 SeldonDeployment를 통해 API Deployment를 해보겠습니다.
SeldonDeployment는 쿠버네티스(Kubernetes)에 모델을 REST/gRPC 서버의 형태로 배포하기 위해 정의된 CRD(CustomResourceDefinition)입니다.

### 1. Prerequisites

SeldonDeployment 관련된 실습은 seldon-deploy라는 새로운 네임스페이스(namespace)에서 진행하도록 하겠습니다.
네임스페이스를 생성한 뒤, seldon-deploy를 현재 네임스페이스로 설정합니다.

```text
kubectl create namespace seldon-deploy
kubectl config set-context --current --namespace=seldon-deploy
```

### 2. 스펙 정의

SeldonDeployment를 배포하기 위한 yaml 파일을 생성합니다.
이번 페이지에서는 공개된 iris model을 사용하도록 하겠습니다.
이 iris model은 sklearn 프레임워크를 통해 학습되었기 때문에 SKLEARN_SERVER를 사용합니다.

```text
cat <<EOF > iris-sdep.yaml
apiVersion: machinelearning.seldon.io/v1alpha2
kind: SeldonDeployment
metadata:
  name: sklearn
  namespace: seldon-deploy
spec:
  name: iris
  predictors:
  - graph:
      children: []
      implementation: SKLEARN_SERVER
      modelUri: gs://seldon-models/v1.12.0-dev/sklearn/iris
      name: classifier
    name: default
    replicas: 1
EOF
```

yaml 파일을 배포합니다.

```text
kubectl apply -f iris-sdep.yaml
```

다음 명령어를 통해 정상적으로 배포가 되었는지 확인합니다.

```text
kubectl get pods --selector seldon-app=sklearn-default -n seldon-deploy
```

모두 Running 이 되면 다음과 비슷한 결과가 출력됩니다.

```text
NAME                                            READY   STATUS    RESTARTS   AGE
sklearn-default-0-classifier-5fdfd7bb77-ls9tr   2/2     Running   0          5m
```

## Ingress URL

이제 배포된 모델에 추론 요청(predict request)를 보내서 추론 결괏값을 받아옵니다.
배포된 API는 다음과 같은 규칙으로 생성됩니다.
`http://{NODE_IP}:{NODE_PORT}/seldon/{namespace}/{seldon-deployment-name}/api/v1.0/{method-name}/`

### NODE_IP / NODE_PORT

[Seldon Core 설치 시, Ambassador를 Ingress Controller로 설정하였으므로]({{< relref "docs/setup-components/install-components-seldon.md" >}}), SeldonDeployment로 생성된 API 서버는 모두 Ambassador의 Ingress gateway를 통해 요청할 수 있습니다.

따라서 우선 Ambassador Ingress Gateway의 url을 환경 변수로 설정합니다.

```text
export NODE_IP=$(kubectl get nodes -o jsonpath='{ $.items[*].status.addresses[?(@.type=="InternalIP")].address }')
export NODE_PORT=$(kubectl get service ambassador -n seldon-system -o jsonpath="{.spec.ports[0].nodePort}")
```

설정된 url을 확인합니다.

```text
echo "NODE_IP"=$NODE_IP
echo "NODE_PORT"=$NODE_PORT
```

다음과 비슷하게 출력되어야 하며, 클라우드 등을 통해 설정할 경우, internal ip 주소가 설정되는 것을 확인할 수 있습니다.

```text
NODE_IP=192.168.0.19
NODE_PORT=30486
```

### namespace / seldon-deployment-name

SeldonDeployment가 배포된 `namespace`와 `seldon-deployment-name`를 의미합니다.
이는 스펙을 정의할 때 metadata에 정의된 값을 사용합니다.

```text
metadata:
  name: sklearn
  namespace: seldon-deploy
```

위의 예시에서는 `namespace`는 seldon-deploy, `seldon-deployment-name`은 sklearn 입니다.

### method-name

SeldonDeployment에서 주로 사용하는 `method-name`은 두 가지가 있습니다.

1. doc
2. predictions

각각의 method의 자세한 사용 방법은 아래에서 설명합니다.

## Use Swagger

우선 doc method를 사용하는 방법입니다. doc method를 이용하면 seldon에서 생성한 swagger에 접속할 수 있습니다.

### 1. Swagger 접속

위에서 설명한 ingress url 규칙에 따라 아래 주소를 통해 swagger에 접근할 수 있습니다.  
`http://192.168.0.19:30486/seldon/seldon-deploy/sklearn/api/v1.0/doc/`

<p>
  <img src="/images/docs/api-deployment/iris-swagger1.png" title="iris-swagger1"/>
</p>

### 2. Swagger Predictions 메뉴 선택

UI에서 `/seldon/seldon-deploy/sklearn/api/v1.0/predictions` 메뉴를 선택합니다.

<p>
  <img src="/images/docs/api-deployment/iris-swagger2.png" title="iris-swagger2"/>
</p>

### 3. *Try it out* 선택

<p>
  <img src="/images/docs/api-deployment/iris-swagger3.png" title="iris-swagger3"/>
</p>

### 4. Request body에 data 입력

<p>
  <img src="/images/docs/api-deployment/iris-swagger4.png" title="iris-swagger4"/>
</p>

다음 데이터를 입력합니다.

```text
{
  "data": {
    "ndarray":[[1.0, 2.0, 5.0, 6.0]]
  }
}
```

### 5. 추론 결과 확인

`Execute` 버튼을 눌러서 추론 결과를 확인할 수 있습니다.

<p>
  <img src="/images/docs/api-deployment/iris-swagger5.png" title="iris-swagger5"/>
</p>

정상적으로 수행되면 다음과 같은 추론 결과를 얻습니다.

```text
{
  "data": {
    "names": [
      "t:0",
      "t:1",
      "t:2"
    ],
    "ndarray": [
      [
        9.912315378486697e-7,
        0.0007015931307746079,
        0.9992974156376876
      ]
    ]
  },
  "meta": {
    "requestPath": {
      "classifier": "seldonio/sklearnserver:1.11.2"
    }
  }
}
```

## Using CLI

또한, curl과 같은 http client CLI 도구를 활용해서도 API 요청을 수행할 수 있습니다.

예를 들어, 다음과 같이 `/predictions`를 요청하면

```text
curl -X POST http://$NODE_IP:$NODE_PORT/seldon/seldon-deploy/sklearn/api/v1.0/predictions \
-H 'Content-Type: application/json' \
-d '{ "data": { "ndarray": [[1,2,3,4]] } }'
```

아래와 같은 응답이 정상적으로 출력되는 것을 확인할 수 있습니다.

```text
{"data":{"names":["t:0","t:1","t:2"],"ndarray":[[0.0006985194531162835,0.00366803903943666,0.995633441507447]]},"meta":{"requestPath":{"classifier":"seldonio/sklearnserver:1.11.2"}}}
```
