---
title : "[Basic Usage] Deploy SeldonDeployment"
description: ""
lead: ""
# date: 2020-10-06T08:48:23+00:00
# lastmod: 2020-10-06T08:48:23+00:00
draft: false
weight: 420
contributors: ["Youngcheol Jang"]
menu:
  docs:
    parent: "api-deployment"
images: []
---

## 학습한 모델 SeldonDeployment를 통해 배포하기

이번에는 학습된 모델이 있을 때 SeldonDeployment를 통해 API deployment를 해 보겠습니다.
SeldonDeployment는 쿠버네티스(Kubernetes)에 모델을 REST/gRPC 서버의 형태로 배포하기 위해 정의된 CRD(CustomResourceDefinition)입니다.

SeldonDeployment 관련된 실습은 seldon-deploy라는 새로운 네임스페이스(namespace)에서 진행하도록 하겠습니다.
네임스페이스를 생성한 뒤, seldon-deploy를 현재 네임스페이스로 설정합니다.

```text
kubectl create namespace seldon-deploy
kubectl config set-context --current --namespace=seldon-deploy
```

### 공개되어 있는 모델을 SeldonDeployment를 통해 배포하기

SeldonDeployment를 배포하기 위한 yaml 파일을 생성합니다.
지금은 공개되어 있는 iris model을 사용하도록 하겠습니다.

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

yaml 파일을 배포한 후 정상적으로 배포가 되었는지 확인합니다.

```text
kubectl apply -f iris-sdep.yaml

kubectl get pods --selector seldon-app=sklearn-default -n seldon-deploy
NAME                                            READY   STATUS    RESTARTS   AGE
sklearn-default-0-classifier-5fdfd7bb77-ls9tr   2/2     Running   0          5m
```

이제 배포된 모델에 추론 요청(predict request)를 보내서 추론 결과값을 받아옵니다.
ambassador ingress gateway를 통해 추론 요청을 보내기 위해 ingress url을 알아내야 합니다.

```text
export NODE_IP=$(kubectl get nodes -o jsonpath='{ $.items[*].status.addresses[?(@.type=="InternalIP")].address }')
export NODE_PORT=$(kubectl get service ambassador -n seldon-system -o jsonpath="{.spec.ports[0].nodePort}")
```

이제 ingress url을 이용해서 추론 요청을 보내 봅시다.

```text
curl -X POST -H "Content-Type: application/json" \
  -d '{"data": {"ndarray":[[1.0, 2.0, 5.0, 6.0]]}}' \
  http://$NODE_IP:$NODE_PORT/seldon/seldon-deploy/sklearn/api/v1.0/predictions
{"data":{"names":["t:0","t:1","t:2"],"ndarray":[[9.912315378486697e-07,0.0007015931307746079,0.9992974156376876]]},"meta":{"requestPath":{"classifier":"seldonio/sklearnserver:1.11.2"}}}
```

방금 사용한 url의 각 경로의 의미를 살펴보겠습니다.
*seldon/seldon-deploy/sklearn/api/v1.0/predictions*

- seldon: seldon-core에 의해 생성된 url임을 의미합니다.
- seldon-deploy: SeldonDeploument가 배포되어 있는 네임스페이스를 의미합니다.
- sklearn: 배포되어 있는 SeldonDeployment의 이름을 의미합니다.
