---
title : "Install Components - Kubeflow"
description: "구성요소 설치 - Kubeflow"
date: 2020-12-03T08:48:23+00:00
lastmod: 2020-12-03T08:48:23+00:00
draft: false
weight: 221
contributors: ["Jaeyeon Kim"]
menu:
  docs:
    parent: "setup"
images: []
---

## 설치 파일 준비

kubeflow v1.4.0 버전을 설치하기 위해서, 설치에 필요한 manifests 파일들을 준비합니다.

```sh
# kubeflow/manifests repo clone
git clone git@github.com:kubeflow/manifests.git

# kubeflow/manifests 폴더로 이동
cd manifests

# v1.4.0 태그로 checkout
git checkout tags/v1.4.0
```

## 각 구성요소별 설치

kubeflow/manifests Repository 에 각 구성요소별 설치 커맨드가 적혀져있지만, 설치하며 발생할 수 있는 이슈 혹은 정상적으로 설치되었는지 확인할 수 있는 방법 등이 적혀져있지 않아 처음 설치하는 경우 어려움을 겪는 경우가 많습니다.
따라서, 각 구성요소별로 정상적으로 설치되었는지 확인하는 방법을 함께 작성합니다.
또한, 본 문서에서는 **모두의 MLOps** 에서 다루지 않는 구성요소인 Knative, KFServing, MPI Operator 의 설치는 리소스의 효율적 사용을 위해 따로 설치하지 않습니다.

### cert-manager

cert-manager 를 배포합니다.

```sh
kustomize build common/cert-manager/cert-manager/base | kubectl apply -f -
```

cert-manager namespace 의 3 개의 pod 가 모두 Running 이 될 때까지 기다립니다.

```sh
kubectl get pod -n cert-manager
```

모두 Running 이 되면 다음과 비슷한 결과가 출력됩니다.

```text
NAME                                       READY   STATUS    RESTARTS   AGE
cert-manager-7dd5854bb4-7nmpd              1/1     Running   0          2m10s
cert-manager-cainjector-64c949654c-2scxr   1/1     Running   0          2m10s
cert-manager-webhook-6b57b9b886-7q6g2      1/1     Running   0          2m10s
```

kubeflow-issuer 를 배포합니다.

```sh
kustomize build common/cert-manager/kubeflow-issuer/base | kubectl apply -f -
```

- cert-manager-webhook deployment 가 Running 이 아닌 경우, 다음과 비슷한 에러가 발생하며 kubeflow-issuer가 배포되지 않을 수 있음에 주의하기시 바랍니다. 해당 에러가 발생한 경우, cert-manager 의 3 개의 pod 가 모두 Running 이 되는 것을 확인한 이후 다시 명령어를 수행하시기 바랍니다.

```text
Error from server: error when retrieving current configuration of:
Resource: "cert-manager.io/v1alpha2, Resource=clusterissuers", GroupVersionKind: "cert-manager.io/v1alpha2, Kind=ClusterIssuer"
Name: "kubeflow-self-signing-issuer", Namespace: ""
from server for: "STDIN": conversion webhook for cert-manager.io/v1, Kind=ClusterIssuer failed: Post "https://cert-manager-webhook.cert-manager.svc:443/convert?timeout=30s": dial tcp 10.101.177.157:443: connect: connection refused
```

### Istio

istio 관련 Custom Resource Definition(CRD) 를 배포합니다.

```sh
kustomize build common/istio-1-9/istio-crds/base | kubectl apply -f -
```

istio namespace 를 배포합니다.

```sh
kustomize build common/istio-1-9/istio-namespace/base | kubectl apply -f -
```

istio 를 배포합니다.

```sh
kustomize build common/istio-1-9/istio-install/base | kubectl apply -f -
```

istio-system namespace 의 2 개의 pod 가 모두 Running 이 될 때까지 기다립니다.

```sh
kubectl get po -n istio-system
```

모두 Running 이 되면 다음과 비슷한 결과가 출력됩니다.

```text
NAME                                   READY   STATUS    RESTARTS   AGE
istio-ingressgateway-79b665c95-xm22l   1/1     Running   0          16s
istiod-86457659bb-5h58w                1/1     Running   0          16s
```

### Dex

dex 를 배포합니다.

```sh
kustomize build common/dex/overlays/istio | kubectl apply -f -
```

auth namespace 의 1 개의 pod 가 모두 Running 이 될 때까지 기다립니다.

```sh
kubectl get po -n auth
```

모두 Running 이 되면 다음과 비슷한 결과가 출력됩니다.

```text
NAME                   READY   STATUS    RESTARTS   AGE
dex-5ddf47d88d-458cs   1/1     Running   1          12s
```

### OIDC AuthService

OIDC AuthService 를 배포합니다.

```sh
kustomize build common/oidc-authservice/base | kubectl apply -f -
```

istio-system namespace 에 authservice-0 pod 가 Running 이 될 때까지 기다립니다.

```sh
kubectl get po -n istio-system -w
```

모두 Running 이 되면 다음과 비슷한 결과가 출력됩니다.

```text
NAME                                   READY   STATUS    RESTARTS   AGE
authservice-0                          1/1     Running   0          14s
istio-ingressgateway-79b665c95-xm22l   1/1     Running   0          2m37s
istiod-86457659bb-5h58w                1/1     Running   0          2m37s
```

### Kubeflow Namespace

kubeflow namespace 를 생성합니다.

```sh
kustomize build common/kubeflow-namespace/base | kubectl apply -f -
```

kubeflow namespace 를 조회합니다.

```sh
kubectl get ns kubeflow
```

정상적으로 생성되면 다음과 비슷한 결과가 출력됩니다.

```text
NAME       STATUS   AGE
kubeflow   Active   8s
```

### Kubeflow Roles

kubeflow-roles 를 배포합니다.

```sh
kustomize build common/kubeflow-roles/base | kubectl apply -f -
```

방금 생성한 kubeflow roles 를 조회합니다.

```sh
kubectl get clusterrole | grep kubeflow
```

다음과 같이 총 6 개의 clusterrole 이 출력됩니다.

```text
kubeflow-admin                                                         2021-12-03T08:51:36Z
kubeflow-edit                                                          2021-12-03T08:51:36Z
kubeflow-kubernetes-admin                                              2021-12-03T08:51:36Z
kubeflow-kubernetes-edit                                               2021-12-03T08:51:36Z
kubeflow-kubernetes-view                                               2021-12-03T08:51:36Z
kubeflow-view                                                          2021-12-03T08:51:36Z
```

### Kubeflow Istio Resources

kubeflow-istio-resources 를 배포합니다.

```sh
kustomize build common/istio-1-9/kubeflow-istio-resources/base | kubectl apply -f -
```

방금 생성한 kubeflow roles 를 조회합니다.

```sh
kubectl get clusterrole | grep kubeflow-istio
```

다음과 같이 총 3 개의 clusterrole 이 출력됩니다.

```text
kubeflow-istio-admin                                                   2021-12-03T08:53:17Z
kubeflow-istio-edit                                                    2021-12-03T08:53:17Z
kubeflow-istio-view                                                    2021-12-03T08:53:17Z
```

kubeflow namespace 에 gateway 가 정상적으로 설치되었는지 확인합니다.

```sh
kubectl get gateway -n kubeflow
```

정상적으로 생성되면 다음과 비슷한 결과가 출력됩니다.

```text
NAME               AGE
kubeflow-gateway   31s
```

### Kubeflow Pipelines

kubeflow pipelines 를 배포합니다.

```sh
kustomize build apps/pipeline/upstream/env/platform-agnostic-multi-user | kubectl apply -f -
```

위 명령어는 여러 resources 를 한 번에 설치하고 있지만, 설치 순서의 의존성이 있는 리소스가 존재합니다.
따라서 경우에 따라 다음과 비슷한 에러가 발생할 수 있습니다.

```text
"error: unable to recognize "STDIN": no matches for kind "CompositeController" in version "metacontroller.k8s.io/v1alpha1"" 
```

위와 비슷한 에러가 발생한다면, 10 초 정도 기다린 뒤 다시 위의 명령을 수행합니다.

```sh
kustomize build apps/pipeline/upstream/env/platform-agnostic-multi-user | kubectl apply -f -
```

정상적으로 설치되었는지 확인합니다.

```text
kubectl get po -n kubeflow
```

다음과 같이 총 16 개의 pod 가 모두 Running 이 될 때까지 기다립니다.

```text
NAME                                                     READY   STATUS    RESTARTS   AGE
cache-deployer-deployment-79fdf9c5c9-bjnbg               2/2     Running   1          5m3s
cache-server-5bdf4f4457-48gbp                            2/2     Running   0          5m3s
kubeflow-pipelines-profile-controller-7b947f4748-8d26b   1/1     Running   0          5m3s
metacontroller-0                                         1/1     Running   0          5m3s
metadata-envoy-deployment-5b4856dd5-xtlkd                1/1     Running   0          5m3s
metadata-grpc-deployment-6b5685488-kwvv7                 2/2     Running   3          5m3s
metadata-writer-548bd879bb-zjkcn                         2/2     Running   1          5m3s
minio-5b65df66c9-k5gzg                                   2/2     Running   0          5m3s
ml-pipeline-8c4b99589-85jw6                              2/2     Running   1          5m3s
ml-pipeline-persistenceagent-d6bdc77bd-ssxrv             2/2     Running   0          5m3s
ml-pipeline-scheduledworkflow-5db54d75c5-zk2cw           2/2     Running   0          5m2s
ml-pipeline-ui-5bd8d6dc84-j7wqr                          2/2     Running   0          5m2s
ml-pipeline-viewer-crd-68fb5f4d58-mbcbg                  2/2     Running   1          5m2s
ml-pipeline-visualizationserver-8476b5c645-wljfm         2/2     Running   0          5m2s
mysql-f7b9b7dd4-xfnw4                                    2/2     Running   0          5m2s
workflow-controller-5cbbb49bd8-5zrwx                     2/2     Running   1          5m2s
```

추가적으로 ml-pipeline UI 가 정상적으로 접속되는지 확인합니다.

```sh
kubectl port-forward svc/ml-pipeline-ui -n kubeflow 8888:80
```

웹 브라우저를 열어 `http://localhost:8888/pipelines/` 경로에 접속합니다.

다음과 같은 화면이 출력되는 것을 확인합니다.

<img src="/images/docs/setup/pipeline-ui.png" title="pipeline-ui"/>

### Katib

Katib 를 배포합니다.

```sh
kustomize build apps/katib/upstream/installs/katib-with-kubeflow | kubectl apply -f -
```

정상적으로 설치되었는지 확인합니다.

```sh
kubectl get po -n kubeflow | grep katib
```

다음과 같이 총 4 개의 pod 가 Running 이 될 때까지 기다립니다.

```text
katib-controller-68c47fbf8b-b985z                        1/1     Running   0          82s
katib-db-manager-6c948b6b76-2d9gr                        1/1     Running   0          82s
katib-mysql-7894994f88-scs62                             1/1     Running   0          82s
katib-ui-64bb96d5bf-d89kp                                1/1     Running   0          82s
```

추가적으로 katib UI 가 정상적으로 접속되는지 확인합니다.

```sh
kubectl port-forward svc/katib-ui -n kubeflow 8081:80
```

웹 브라우저를 열어 `http://localhost:8081/katib/` 경로에 접속합니다.

다음과 같은 화면이 출력되는 것을 확인합니다.

<img src="/images/docs/setup/katib-ui.png" title="katib-ui"/>

#### Central Dashboard

Dashboard 를 배포합니다.

```sh
kustomize build apps/centraldashboard/upstream/overlays/istio | kubectl apply -f -
```

정상적으로 설치되었는지 확인합니다.

```sh
kubectl get po -n kubeflow | grep centraldashboard
```

kubeflow namespace 에 centraldashboard 관련 1 개의 pod 가 Running 이 될 때까지 기다립니다.

```text
centraldashboard-8fc7d8cc-xl7ts                          1/1     Running   0          52s
```

추가적으로 Central Dashboard UI 가 정상적으로 접속되는지 확인합니다.

```sh
kubectl port-forward svc/centraldashboard -n kubeflow 8082:80
```

웹 브라우저를 열어 `http://localhost:8082/` 경로에 접속합니다.

다음과 같은 화면이 출력되는 것을 확인합니다.

<img src="/images/docs/setup/central-dashboard.png" title="central-dashboard"/>

#### Admission Webhook

```sh
kustomize build apps/admission-webhook/upstream/overlays/cert-manager | kubectl apply -f -
```

정상적으로 설치되었는지 확인합니다.

```sh
kubectl get po -n kubeflow | grep admission-webhook
```

1 개의 pod 가 Running 이 될 때까지 기다립니다.

```text
admission-webhook-deployment-667bd68d94-2hhrx            1/1     Running   0          11s
```

#### Notebooks & Jupyter Web App

Notebook controller 를 배포합니다.

```sh
kustomize build apps/jupyter/notebook-controller/upstream/overlays/kubeflow | kubectl apply -f -
```

정상적으로 설치되었는지 확인합니다.

```sh
kubectl get po -n kubeflow | grep notebook-controller
```

1 개의 pod 가 Running 이 될 때까지 기다립니다.

```text
notebook-controller-deployment-75b4f7b578-w4d4l          1/1     Running   0          105s
```

Jupyter Web App 을 배포합니다.

```sh
kustomize build apps/jupyter/jupyter-web-app/upstream/overlays/istio | kubectl apply -f -
```

정상적으로 설치되었는지 확인합니다.

```sh
kubectl get po -n kubeflow | grep jupyter-web-app
```

1 개의 pod 가 Running 이 될 때까지 기다립니다.

```text
jupyter-web-app-deployment-6f744fbc54-p27ts              1/1     Running   0          2m
```

#### Profiles + KFAM

Profile Controller 를 배포합니다.

```sh
kustomize build apps/profiles/upstream/overlays/kubeflow | kubectl apply -f -
```

정상적으로 설치되었는지 확인합니다.

```sh
kubectl get po -n kubeflow | grep profiles-deployment
```

1 개의 pod 가 Running 이 될 때까지 기다립니다.

```text
profiles-deployment-89f7d88b-qsnrd                       2/2     Running   0          42s
```

#### Volumes Web App

Volumes Web App 을 배포합니다.

```sh
kustomize build apps/volumes-web-app/upstream/overlays/istio | kubectl apply -f -
```

정상적으로 설치되었는지 확인합니다.

```sh
kubectl get po -n kubeflow | grep volumes-web-app
```

1 개의 pod 가 Running 이 될 때까지 기다립니다.

```text
volumes-web-app-deployment-8589d664cc-62svl              1/1     Running   0          27s
```

#### Tensorboard & Tensorboard Web App

Tensorboard Web App 를 배포합니다.

```sh
kustomize build apps/tensorboard/tensorboards-web-app/upstream/overlays/istio | kubectl apply -f -
```

정상적으로 설치되었는지 확인합니다.

```sh
kubectl get po -n kubeflow | grep tensorboards-web-app
```

1 개의 pod 가 Running 이 될 때까지 기다립니다.

```text
tensorboards-web-app-deployment-6ff79b7f44-qbzmw            1/1     Running             0          22s
```

Tensorboard Controller 를 배포합니다.

```sh
kustomize build apps/tensorboard/tensorboard-controller/upstream/overlays/kubeflow | kubectl apply -f -
```

정상적으로 설치되었는지 확인합니다.

```sh
kubectl get po -n kubeflow | grep tensorboard-controller
```

1 개의 pod 가 Running 이 될 때까지 기다립니다.

```text
tensorboard-controller-controller-manager-954b7c544-vjpzj   3/3     Running   1          73s
```

#### Training Operator

Training Operator 를 배포합니다.

```sh
kustomize build apps/training-operator/upstream/overlays/kubeflow | kubectl apply -f -
```

정상적으로 설치되었는지 확인합니다.

```sh
kubectl get po -n kubeflow | grep training-operator
```

1 개의 pod 가 Running 이 될 때까지 기다립니다.

```text
training-operator-7d98f9dd88-6887f                          1/1     Running   0          28s
```

#### User Namespace

Kubeflow 사용을 위해, 사용할 User 의 Kubeflow Profile 을 생성합니다.

```sh
kustomize build common/user-namespace/base | kubectl apply -f -
```

kubeflow-user-example-com profile 이 생성된 것을 확인합니다.

```sh
kubectl get profile
```

```text
kubeflow-user-example-com   37s
```

### 정상 설치 확인

kubeflow central dashboard 에 web browser 로 접속하기 위해 port-forward 합니다.

```sh
kubectl port-forward svc/istio-ingressgateway -n istio-system 8080:80
```

Web Browser 를 열어 http://localhost:8080 으로 접속하여, 다음과 같은 화면이 출력되는 것을 확인합니다.

<img src="/images/docs/setup/login-after-install.png" title="login-ui"/>
<br>
<br>

다음 접속 정보를 입력하여 접속합니다.

- Email Address: `user@example.com`
- Password: `12341234`

<img src="/images/docs/setup/after-login.png" title="central-dashboard"/>
