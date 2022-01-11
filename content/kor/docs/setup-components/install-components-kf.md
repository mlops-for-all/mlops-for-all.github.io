---
title : "1. Kubeflow"
description: "구성요소 설치 - Kubeflow"
date: 2021-12-13
lastmod: 2021-12-20
draft: false
weight: 252
contributors: ["Jaeyeon Kim", "SeungTae Kim"]
menu:
  docs:
    parent: "setup-components"
images: []
---

## 설치 파일 준비

Kubeflow **v1.4.0** 버전을 설치하기 위해서, 설치에 필요한 manifests 파일들을 준비합니다.

[kubeflow/manifests Repository](https://github.com/kubeflow/manifests) 를 **v1.4.0** 태그로 깃 클론한 뒤, 해당 폴더로 이동합니다.

```text
git clone -b v1.4.0 https://github.com/kubeflow/manifests.git
cd manifests
```

## 각 구성 요소별 설치

kubeflow/manifests Repository 에 각 구성 요소별 설치 커맨드가 적혀져 있지만, 설치하며 발생할 수 있는 이슈 혹은 정상적으로 설치되었는지 확인하는 방법이 적혀져 있지 않아 처음 설치하는 경우 어려움을 겪는 경우가 많습니다.  
따라서, 각 구성 요소별로 정상적으로 설치되었는지 확인하는 방법을 함께 작성합니다.  

또한, 본 문서에서는 **모두의 MLOps** 에서 다루지 않는 구성요소인 Knative, KFServing, MPI Operator 의 설치는 리소스의 효율적 사용을 위해 따로 설치하지 않습니다.

### cert-manager

1. cert-manager 를 설치합니다.

  ```text
  kustomize build common/cert-manager/cert-manager/base | kubectl apply -f -
  ```

  cert-manager namespace 의 3 개의 pod 가 모두 Running 이 될 때까지 기다립니다.

  ```text
  kubectl get pod -n cert-manager
  ```

  모두 Running 이 되면 다음과 비슷한 결과가 출력됩니다.

  ```text
  NAME                                       READY   STATUS    RESTARTS   AGE
  cert-manager-7dd5854bb4-7nmpd              1/1     Running   0          2m10s
  cert-manager-cainjector-64c949654c-2scxr   1/1     Running   0          2m10s
  cert-manager-webhook-6b57b9b886-7q6g2      1/1     Running   0          2m10s
  ```

2. kubeflow-issuer 를 설치합니다.

  ```text
  kustomize build common/cert-manager/kubeflow-issuer/base | kubectl apply -f -
  ```

  정상적으로 설치되면 다음과 같이 출력됩니다.

  ```text
  namespace/cert-manager created
  customresourcedefinition.apiextensions.k8s.io/certificaterequests.cert-manager.io created
  customresourcedefinition.apiextensions.k8s.io/certificates.cert-manager.io created
  customresourcedefinition.apiextensions.k8s.io/challenges.acme.cert-manager.io created
  customresourcedefinition.apiextensions.k8s.io/clusterissuers.cert-manager.io created
  customresourcedefinition.apiextensions.k8s.io/issuers.cert-manager.io created
  customresourcedefinition.apiextensions.k8s.io/orders.acme.cert-manager.io created
  serviceaccount/cert-manager created
  serviceaccount/cert-manager-cainjector created
  serviceaccount/cert-manager-webhook created
  role.rbac.authorization.k8s.io/cert-manager-webhook:dynamic-serving created
  role.rbac.authorization.k8s.io/cert-manager-cainjector:leaderelection created
  role.rbac.authorization.k8s.io/cert-manager:leaderelection created
  clusterrole.rbac.authorization.k8s.io/cert-manager-cainjector created
  clusterrole.rbac.authorization.k8s.io/cert-manager-controller-approve:cert-manager-io created
  clusterrole.rbac.authorization.k8s.io/cert-manager-controller-certificates created
  clusterrole.rbac.authorization.k8s.io/cert-manager-controller-challenges created
  clusterrole.rbac.authorization.k8s.io/cert-manager-controller-clusterissuers created
  clusterrole.rbac.authorization.k8s.io/cert-manager-controller-ingress-shim created
  clusterrole.rbac.authorization.k8s.io/cert-manager-controller-issuers created
  clusterrole.rbac.authorization.k8s.io/cert-manager-controller-orders created
  clusterrole.rbac.authorization.k8s.io/cert-manager-edit created
  clusterrole.rbac.authorization.k8s.io/cert-manager-view created
  clusterrole.rbac.authorization.k8s.io/cert-manager-webhook:subjectaccessreviews created
  rolebinding.rbac.authorization.k8s.io/cert-manager-webhook:dynamic-serving created
  rolebinding.rbac.authorization.k8s.io/cert-manager-cainjector:leaderelection created
  rolebinding.rbac.authorization.k8s.io/cert-manager:leaderelection created
  clusterrolebinding.rbac.authorization.k8s.io/cert-manager-cainjector created
  clusterrolebinding.rbac.authorization.k8s.io/cert-manager-controller-approve:cert-manager-io created
  clusterrolebinding.rbac.authorization.k8s.io/cert-manager-controller-certificates created
  clusterrolebinding.rbac.authorization.k8s.io/cert-manager-controller-challenges created
  clusterrolebinding.rbac.authorization.k8s.io/cert-manager-controller-clusterissuers created
  clusterrolebinding.rbac.authorization.k8s.io/cert-manager-controller-ingress-shim created
  clusterrolebinding.rbac.authorization.k8s.io/cert-manager-controller-issuers created
  clusterrolebinding.rbac.authorization.k8s.io/cert-manager-controller-orders created
  clusterrolebinding.rbac.authorization.k8s.io/cert-manager-webhook:subjectaccessreviews created
  service/cert-manager created
  service/cert-manager-webhook created
  deployment.apps/cert-manager created
  deployment.apps/cert-manager-cainjector created
  deployment.apps/cert-manager-webhook created
  mutatingwebhookconfiguration.admissionregistration.k8s.io/cert-manager-webhook created
  validatingwebhookconfiguration.admissionregistration.k8s.io/cert-manager-webhook created
  ```

- cert-manager-webhook 이슈

  cert-manager-webhook deployment 가 Running 이 아닌 경우, 다음과 비슷한 에러가 발생하며 kubeflow-issuer가 설치되지 않을 수 있음에 주의하시기 바랍니다.  
  해당 에러가 발생한 경우, cert-manager 의 3개의 pod 가 모두 Running 이 되는 것을 확인한 이후 다시 명령어를 수행하시기 바랍니다.

  ```text
  Error from server: error when retrieving current configuration of:
  Resource: "cert-manager.io/v1alpha2, Resource=clusterissuers", GroupVersionKind: "cert-manager.io/v1alpha2, Kind=ClusterIssuer"
  Name: "kubeflow-self-signing-issuer", Namespace: ""
  from server for: "STDIN": conversion webhook for cert-manager.io/v1, Kind=ClusterIssuer failed: Post "https://cert-manager-webhook.cert-manager.svc:443/convert?timeout=30s": dial tcp 10.101.177.157:443: connect: connection refused
  ```

### Istio

1. istio 관련 Custom Resource Definition(CRD) 를 설치합니다.

  ```text
  kustomize build common/istio-1-9/istio-crds/base | kubectl apply -f -
  ```

  정상적으로 수행되면 다음과 같이 출력됩니다.

  ```text
  customresourcedefinition.apiextensions.k8s.io/authorizationpolicies.security.istio.io created
  customresourcedefinition.apiextensions.k8s.io/destinationrules.networking.istio.io created
  customresourcedefinition.apiextensions.k8s.io/envoyfilters.networking.istio.io created
  customresourcedefinition.apiextensions.k8s.io/gateways.networking.istio.io created
  customresourcedefinition.apiextensions.k8s.io/istiooperators.install.istio.io created
  customresourcedefinition.apiextensions.k8s.io/peerauthentications.security.istio.io created
  customresourcedefinition.apiextensions.k8s.io/requestauthentications.security.istio.io created
  customresourcedefinition.apiextensions.k8s.io/serviceentries.networking.istio.io created
  customresourcedefinition.apiextensions.k8s.io/sidecars.networking.istio.io created
  customresourcedefinition.apiextensions.k8s.io/virtualservices.networking.istio.io created
  customresourcedefinition.apiextensions.k8s.io/workloadentries.networking.istio.io created
  customresourcedefinition.apiextensions.k8s.io/workloadgroups.networking.istio.io created
  ```

2. istio namespace 를 설치합니다.

  ```text
  kustomize build common/istio-1-9/istio-namespace/base | kubectl apply -f -
  ```

  정상적으로 수행되면 다음과 같이 출력됩니다.

  ```text
  namespace/istio-system created
  ```

3. istio 를 설치합니다.

  ```text
  kustomize build common/istio-1-9/istio-install/base | kubectl apply -f -
  ```

  정상적으로 수행되면 다음과 같이 출력됩니다.

  ```text
  serviceaccount/istio-ingressgateway-service-account created
  serviceaccount/istio-reader-service-account created
  serviceaccount/istiod-service-account created
  role.rbac.authorization.k8s.io/istio-ingressgateway-sds created
  role.rbac.authorization.k8s.io/istiod-istio-system created
  clusterrole.rbac.authorization.k8s.io/istio-reader-istio-system created
  clusterrole.rbac.authorization.k8s.io/istiod-istio-system created
  rolebinding.rbac.authorization.k8s.io/istio-ingressgateway-sds created
  rolebinding.rbac.authorization.k8s.io/istiod-istio-system created
  clusterrolebinding.rbac.authorization.k8s.io/istio-reader-istio-system created
  clusterrolebinding.rbac.authorization.k8s.io/istiod-istio-system created
  configmap/istio created
  configmap/istio-sidecar-injector created
  service/istio-ingressgateway created
  service/istiod created
  deployment.apps/istio-ingressgateway created
  deployment.apps/istiod created
  envoyfilter.networking.istio.io/metadata-exchange-1.8 created
  envoyfilter.networking.istio.io/metadata-exchange-1.9 created
  envoyfilter.networking.istio.io/stats-filter-1.8 created
  envoyfilter.networking.istio.io/stats-filter-1.9 created
  envoyfilter.networking.istio.io/tcp-metadata-exchange-1.8 created
  envoyfilter.networking.istio.io/tcp-metadata-exchange-1.9 created
  envoyfilter.networking.istio.io/tcp-stats-filter-1.8 created
  envoyfilter.networking.istio.io/tcp-stats-filter-1.9 created
  envoyfilter.networking.istio.io/x-forwarded-host created
  gateway.networking.istio.io/istio-ingressgateway created
  authorizationpolicy.security.istio.io/global-deny-all created
  authorizationpolicy.security.istio.io/istio-ingressgateway created
  mutatingwebhookconfiguration.admissionregistration.k8s.io/istio-sidecar-injector created
  validatingwebhookconfiguration.admissionregistration.k8s.io/istiod-istio-system created
  ```

  istio-system namespace 의 2 개의 pod 가 모두 Running 이 될 때까지 기다립니다.

  ```text
  kubectl get po -n istio-system
  ```

  모두 Running 이 되면 다음과 비슷한 결과가 출력됩니다.

  ```text
  NAME                                   READY   STATUS    RESTARTS   AGE
  istio-ingressgateway-79b665c95-xm22l   1/1     Running   0          16s
  istiod-86457659bb-5h58w                1/1     Running   0          16s
  ```

### Dex

dex 를 설치합니다.

```text
kustomize build common/dex/overlays/istio | kubectl apply -f -
```

정상적으로 수행되면 다음과 같이 출력됩니다.

```text
namespace/auth created
customresourcedefinition.apiextensions.k8s.io/authcodes.dex.coreos.com created
serviceaccount/dex created
clusterrole.rbac.authorization.k8s.io/dex created
clusterrolebinding.rbac.authorization.k8s.io/dex created
configmap/dex created
secret/dex-oidc-client created
service/dex created
deployment.apps/dex created
virtualservice.networking.istio.io/dex created
```

auth namespace 의 1 개의 pod 가 모두 Running 이 될 때까지 기다립니다.

```text
kubectl get po -n auth
```

모두 Running 이 되면 다음과 비슷한 결과가 출력됩니다.

```text
NAME                   READY   STATUS    RESTARTS   AGE
dex-5ddf47d88d-458cs   1/1     Running   1          12s
```

### OIDC AuthService

OIDC AuthService 를 설치합니다.

```text
kustomize build common/oidc-authservice/base | kubectl apply -f -
```

정상적으로 수행되면 다음과 같이 출력됩니다.

```text
configmap/oidc-authservice-parameters created
secret/oidc-authservice-client created
service/authservice created
persistentvolumeclaim/authservice-pvc created
statefulset.apps/authservice created
envoyfilter.networking.istio.io/authn-filter created
```

istio-system namespace 에 authservice-0 pod 가 Running 이 될 때까지 기다립니다.

```text
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

```text
kustomize build common/kubeflow-namespace/base | kubectl apply -f -
```

정상적으로 수행되면 다음과 같이 출력됩니다.

```text
namespace/kubeflow created
```

kubeflow namespace 를 조회합니다.

```text
kubectl get ns kubeflow
```

정상적으로 생성되면 다음과 비슷한 결과가 출력됩니다.

```text
NAME       STATUS   AGE
kubeflow   Active   8s
```

### Kubeflow Roles

kubeflow-roles 를 설치합니다.

```text
kustomize build common/kubeflow-roles/base | kubectl apply -f -
```

정상적으로 수행되면 다음과 같이 출력됩니다.

```text
clusterrole.rbac.authorization.k8s.io/kubeflow-admin created
clusterrole.rbac.authorization.k8s.io/kubeflow-edit created
clusterrole.rbac.authorization.k8s.io/kubeflow-kubernetes-admin created
clusterrole.rbac.authorization.k8s.io/kubeflow-kubernetes-edit created
clusterrole.rbac.authorization.k8s.io/kubeflow-kubernetes-view created
clusterrole.rbac.authorization.k8s.io/kubeflow-view created
```

방금 생성한 kubeflow roles 를 조회합니다.

```text
kubectl get clusterrole | grep kubeflow
```

다음과 같이 총 6개의 clusterrole 이 출력됩니다.

```text
kubeflow-admin                                                         2021-12-03T08:51:36Z
kubeflow-edit                                                          2021-12-03T08:51:36Z
kubeflow-kubernetes-admin                                              2021-12-03T08:51:36Z
kubeflow-kubernetes-edit                                               2021-12-03T08:51:36Z
kubeflow-kubernetes-view                                               2021-12-03T08:51:36Z
kubeflow-view                                                          2021-12-03T08:51:36Z
```

### Kubeflow Istio Resources

kubeflow-istio-resources 를 설치합니다.

```text
kustomize build common/istio-1-9/kubeflow-istio-resources/base | kubectl apply -f -
```

정상적으로 수행되면 다음과 같이 출력됩니다.

```text
clusterrole.rbac.authorization.k8s.io/kubeflow-istio-admin created
clusterrole.rbac.authorization.k8s.io/kubeflow-istio-edit created
clusterrole.rbac.authorization.k8s.io/kubeflow-istio-view created
gateway.networking.istio.io/kubeflow-gateway created
```

방금 생성한 kubeflow roles 를 조회합니다.

```text
kubectl get clusterrole | grep kubeflow-istio
```

다음과 같이 총 3개의 clusterrole 이 출력됩니다.

```text
kubeflow-istio-admin                                                   2021-12-03T08:53:17Z
kubeflow-istio-edit                                                    2021-12-03T08:53:17Z
kubeflow-istio-view                                                    2021-12-03T08:53:17Z
```

Kubeflow namespace 에 gateway 가 정상적으로 설치되었는지 확인합니다.

```text
kubectl get gateway -n kubeflow
```

정상적으로 생성되면 다음과 비슷한 결과가 출력됩니다.

```text
NAME               AGE
kubeflow-gateway   31s
```

### Kubeflow Pipelines

kubeflow pipelines 를 설치합니다.

```text
kustomize build apps/pipeline/upstream/env/platform-agnostic-multi-user | kubectl apply -f -
```

정상적으로 수행되면 다음과 같이 출력됩니다.

```text
customresourcedefinition.apiextensions.k8s.io/clusterworkflowtemplates.argoproj.io created
customresourcedefinition.apiextensions.k8s.io/cronworkflows.argoproj.io created
customresourcedefinition.apiextensions.k8s.io/workfloweventbindings.argoproj.io created
...(생략)
authorizationpolicy.security.istio.io/ml-pipeline-visualizationserver created
authorizationpolicy.security.istio.io/mysql created
authorizationpolicy.security.istio.io/service-cache-server created
```

위 명령어는 여러 resources 를 한 번에 설치하고 있지만, 설치 순서의 의존성이 있는 리소스가 존재합니다.  
따라서 때에 따라 다음과 비슷한 에러가 발생할 수 있습니다.

```text
"error: unable to recognize "STDIN": no matches for kind "CompositeController" in version "metacontroller.k8s.io/v1alpha1""  
```

위와 비슷한 에러가 발생한다면, 10 초 정도 기다린 뒤 다시 위의 명령을 수행합니다.

```text
kustomize build apps/pipeline/upstream/env/platform-agnostic-multi-user | kubectl apply -f -
```

정상적으로 설치되었는지 확인합니다.

```text
kubectl get po -n kubeflow
```

다음과 같이 총 16개의 pod 가 모두 Running 이 될 때까지 기다립니다.

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

추가로 ml-pipeline UI가 정상적으로 접속되는지 확인합니다.

```text
kubectl port-forward svc/ml-pipeline-ui -n kubeflow 8888:80
```

웹 브라우저를 열어 [http://localhost:8888/#/pipelines/](http://localhost:8888/#/pipelines/) 경로에 접속합니다.

다음과 같은 화면이 출력되는 것을 확인합니다.

<p align="center">
  <img src="/images/docs/setup/pipeline-ui.png" title="pipeline-ui"/>
</p>

- localhost 연결 거부 이슈

<p align="center">
  <img src="https://user-images.githubusercontent.com/40455392/148356348-d0673e92-e17b-4d7b-8d22-2d8b8a27f90c.png" title="localhost-reject"/>
</p>

만약 다음과 같이 `localhost에서 연결을 거부했습니다` 라는 에러가 출력될 경우, 커맨드로 address 설정을 통해 접근하는 것이 가능합니다.

**보안상의 문제가 되지 않는다면,** 아래와 같이 `0.0.0.0` 로 모든 주소의 bind를 열어주는 방향으로 ml-pipeline UI가 정상적으로 접속되는지 확인합니다.

```text
kubectl port-forward --address 0.0.0.0 svc/ml-pipeline-ui -n kubeflow 8888:80
```

- 위의 옵션으로 실행했음에도 여전히 연결 거부 이슈가 발생할 경우

방화벽 설정으로 접속해 모든 tcp 프로토콜의 포트에 대한 접속을 허가 또는 8888번 포트의 접속 허가를 추가해 접근 권한을 허가해줍니다.

웹 브라우저를 열어 `http://<당신의 가상 인스턴스 공인 ip 주소>:8888/#/pipelines/` 경로에 접속하면, ml-pipeline UI 화면이 출력되는 것을 확인할 수 있습니다.

하단에서 진행되는 다른 포트의 경로에 접속할 때도 위의 절차와 동일하게 커맨드를 실행하고, 방화벽에 포트 번호를 추가해주면 실행하는 것이 가능합니다.

### Katib

Katib 를 설치합니다.

```text
kustomize build apps/katib/upstream/installs/katib-with-kubeflow | kubectl apply -f -
```

정상적으로 수행되면 다음과 같이 출력됩니다.

```text
customresourcedefinition.apiextensions.k8s.io/experiments.kubeflow.org created
customresourcedefinition.apiextensions.k8s.io/suggestions.kubeflow.org created
customresourcedefinition.apiextensions.k8s.io/trials.kubeflow.org created
serviceaccount/katib-controller created
serviceaccount/katib-ui created
clusterrole.rbac.authorization.k8s.io/katib-controller created
clusterrole.rbac.authorization.k8s.io/katib-ui created
clusterrole.rbac.authorization.k8s.io/kubeflow-katib-admin created
clusterrole.rbac.authorization.k8s.io/kubeflow-katib-edit created
clusterrole.rbac.authorization.k8s.io/kubeflow-katib-view created
clusterrolebinding.rbac.authorization.k8s.io/katib-controller created
clusterrolebinding.rbac.authorization.k8s.io/katib-ui created
configmap/katib-config created
configmap/trial-templates created
secret/katib-mysql-secrets created
service/katib-controller created
service/katib-db-manager created
service/katib-mysql created
service/katib-ui created
persistentvolumeclaim/katib-mysql created
deployment.apps/katib-controller created
deployment.apps/katib-db-manager created
deployment.apps/katib-mysql created
deployment.apps/katib-ui created
certificate.cert-manager.io/katib-webhook-cert created
issuer.cert-manager.io/katib-selfsigned-issuer created
virtualservice.networking.istio.io/katib-ui created
mutatingwebhookconfiguration.admissionregistration.k8s.io/katib.kubeflow.org created
validatingwebhookconfiguration.admissionregistration.k8s.io/katib.kubeflow.org created
```

정상적으로 설치되었는지 확인합니다.

```text
kubectl get po -n kubeflow | grep katib
```

다음과 같이 총 4 개의 pod 가 Running 이 될 때까지 기다립니다.

```text
katib-controller-68c47fbf8b-b985z                        1/1     Running   0          82s
katib-db-manager-6c948b6b76-2d9gr                        1/1     Running   0          82s
katib-mysql-7894994f88-scs62                             1/1     Running   0          82s
katib-ui-64bb96d5bf-d89kp                                1/1     Running   0          82s
```

추가로 katib UI가 정상적으로 접속되는지 확인합니다.

```text
kubectl port-forward svc/katib-ui -n kubeflow 8081:80
```

웹 브라우저를 열어 [http://localhost:8081/katib/](http://localhost:8081/katib/) 경로에 접속합니다.

다음과 같은 화면이 출력되는 것을 확인합니다.

<p align="center">
  <img src="/images/docs/setup/katib-ui.png" title="katib-ui"/>
</p>

### Central Dashboard

Dashboard 를 설치합니다.

```text
kustomize build apps/centraldashboard/upstream/overlays/istio | kubectl apply -f -
```

정상적으로 수행되면 다음과 같이 출력됩니다.

```text
serviceaccount/centraldashboard created
role.rbac.authorization.k8s.io/centraldashboard created
clusterrole.rbac.authorization.k8s.io/centraldashboard created
rolebinding.rbac.authorization.k8s.io/centraldashboard created
clusterrolebinding.rbac.authorization.k8s.io/centraldashboard created
configmap/centraldashboard-config created
configmap/centraldashboard-parameters created
service/centraldashboard created
deployment.apps/centraldashboard created
virtualservice.networking.istio.io/centraldashboard created
```

정상적으로 설치되었는지 확인합니다.

```text
kubectl get po -n kubeflow | grep centraldashboard
```

kubeflow namespace 에 centraldashboard 관련 1 개의 pod 가 Running 이 될 때까지 기다립니다.

```text
centraldashboard-8fc7d8cc-xl7ts                          1/1     Running   0          52s
```

추가로 Central Dashboard UI가 정상적으로 접속되는지 확인합니다.

```text
kubectl port-forward svc/centraldashboard -n kubeflow 8082:80
```

웹 브라우저를 열어 [http://localhost:8082/](http://localhost:8082/) 경로에 접속합니다.

다음과 같은 화면이 출력되는 것을 확인합니다.

<p align="center">
  <img src="/images/docs/setup/central-dashboard.png" title="central-dashboard"/>
</p>

### Admission Webhook

```text
kustomize build apps/admission-webhook/upstream/overlays/cert-manager | kubectl apply -f -
```

정상적으로 수행되면 다음과 같이 출력됩니다.

```text
customresourcedefinition.apiextensions.k8s.io/poddefaults.kubeflow.org created
serviceaccount/admission-webhook-service-account created
clusterrole.rbac.authorization.k8s.io/admission-webhook-cluster-role created
clusterrole.rbac.authorization.k8s.io/admission-webhook-kubeflow-poddefaults-admin created
clusterrole.rbac.authorization.k8s.io/admission-webhook-kubeflow-poddefaults-edit created
clusterrole.rbac.authorization.k8s.io/admission-webhook-kubeflow-poddefaults-view created
clusterrolebinding.rbac.authorization.k8s.io/admission-webhook-cluster-role-binding created
service/admission-webhook-service created
deployment.apps/admission-webhook-deployment created
certificate.cert-manager.io/admission-webhook-cert created
issuer.cert-manager.io/admission-webhook-selfsigned-issuer created
mutatingwebhookconfiguration.admissionregistration.k8s.io/admission-webhook-mutating-webhook-configuration created
```

정상적으로 설치되었는지 확인합니다.

```text
kubectl get po -n kubeflow | grep admission-webhook
```

1 개의 pod 가 Running 이 될 때까지 기다립니다.

```text
admission-webhook-deployment-667bd68d94-2hhrx            1/1     Running   0          11s
```

### Notebooks & Jupyter Web App

1. Notebook controller 를 설치합니다.

  ```text
  kustomize build apps/jupyter/notebook-controller/upstream/overlays/kubeflow | kubectl apply -f -
  ```

  정상적으로 수행되면 다음과 같이 출력됩니다.

  ```text
  customresourcedefinition.apiextensions.k8s.io/notebooks.kubeflow.org created
  serviceaccount/notebook-controller-service-account created
  role.rbac.authorization.k8s.io/notebook-controller-leader-election-role created
  clusterrole.rbac.authorization.k8s.io/notebook-controller-kubeflow-notebooks-admin created
  clusterrole.rbac.authorization.k8s.io/notebook-controller-kubeflow-notebooks-edit created
  clusterrole.rbac.authorization.k8s.io/notebook-controller-kubeflow-notebooks-view created
  clusterrole.rbac.authorization.k8s.io/notebook-controller-role created
  rolebinding.rbac.authorization.k8s.io/notebook-controller-leader-election-rolebinding created
  clusterrolebinding.rbac.authorization.k8s.io/notebook-controller-role-binding created
  configmap/notebook-controller-config-m44cmb547t created
  service/notebook-controller-service created
  deployment.apps/notebook-controller-deployment created
  ```

  정상적으로 설치되었는지 확인합니다.

  ```text
  kubectl get po -n kubeflow | grep notebook-controller
  ```

  1 개의 pod 가 Running 이 될 때까지 기다립니다.

  ```text
  notebook-controller-deployment-75b4f7b578-w4d4l          1/1     Running   0          105s
  ```

2. Jupyter Web App 을 설치합니다.

  ```text
  kustomize build apps/jupyter/jupyter-web-app/upstream/overlays/istio | kubectl apply -f -
  ```

  정상적으로 수행되면 다음과 같이 출력됩니다.

  ```text
  serviceaccount/jupyter-web-app-service-account created
  role.rbac.authorization.k8s.io/jupyter-web-app-jupyter-notebook-role created
  clusterrole.rbac.authorization.k8s.io/jupyter-web-app-cluster-role created
  clusterrole.rbac.authorization.k8s.io/jupyter-web-app-kubeflow-notebook-ui-admin created
  clusterrole.rbac.authorization.k8s.io/jupyter-web-app-kubeflow-notebook-ui-edit created
  clusterrole.rbac.authorization.k8s.io/jupyter-web-app-kubeflow-notebook-ui-view created
  rolebinding.rbac.authorization.k8s.io/jupyter-web-app-jupyter-notebook-role-binding created
  clusterrolebinding.rbac.authorization.k8s.io/jupyter-web-app-cluster-role-binding created
  configmap/jupyter-web-app-config-76844k4cd7 created
  configmap/jupyter-web-app-logos created
  configmap/jupyter-web-app-parameters-chmg88cm48 created
  service/jupyter-web-app-service created
  deployment.apps/jupyter-web-app-deployment created
  virtualservice.networking.istio.io/jupyter-web-app-jupyter-web-app created
  ```

  정상적으로 설치되었는지 확인합니다.

  ```text
  kubectl get po -n kubeflow | grep jupyter-web-app
  ```

  1개의 pod 가 Running 이 될 때까지 기다립니다.

  ```text
  jupyter-web-app-deployment-6f744fbc54-p27ts              1/1     Running   0          2m
  ```

### Profiles + KFAM

Profile Controller를 설치합니다.

```text
kustomize build apps/profiles/upstream/overlays/kubeflow | kubectl apply -f -
```

정상적으로 수행되면 다음과 같이 출력됩니다.

```text
customresourcedefinition.apiextensions.k8s.io/profiles.kubeflow.org created
serviceaccount/profiles-controller-service-account created
role.rbac.authorization.k8s.io/profiles-leader-election-role created
rolebinding.rbac.authorization.k8s.io/profiles-leader-election-rolebinding created
clusterrolebinding.rbac.authorization.k8s.io/profiles-cluster-role-binding created
configmap/namespace-labels-data-48h7kd55mc created
configmap/profiles-config-46c7tgh6fd created
service/profiles-kfam created
deployment.apps/profiles-deployment created
virtualservice.networking.istio.io/profiles-kfam created
```

정상적으로 설치되었는지 확인합니다.

```text
kubectl get po -n kubeflow | grep profiles-deployment
```

1 개의 pod 가 Running 이 될 때까지 기다립니다.

```text
profiles-deployment-89f7d88b-qsnrd                       2/2     Running   0          42s
```

### Volumes Web App

Volumes Web App 을 설치합니다.

```text
kustomize build apps/volumes-web-app/upstream/overlays/istio | kubectl apply -f -
```

정상적으로 수행되면 다음과 같이 출력됩니다.

```text
serviceaccount/volumes-web-app-service-account created
clusterrole.rbac.authorization.k8s.io/volumes-web-app-cluster-role created
clusterrole.rbac.authorization.k8s.io/volumes-web-app-kubeflow-volume-ui-admin created
clusterrole.rbac.authorization.k8s.io/volumes-web-app-kubeflow-volume-ui-edit created
clusterrole.rbac.authorization.k8s.io/volumes-web-app-kubeflow-volume-ui-view created
clusterrolebinding.rbac.authorization.k8s.io/volumes-web-app-cluster-role-binding created
configmap/volumes-web-app-parameters-4gg8cm2gmk created
service/volumes-web-app-service created
deployment.apps/volumes-web-app-deployment created
virtualservice.networking.istio.io/volumes-web-app-volumes-web-app created
```

정상적으로 설치되었는지 확인합니다.

```text
kubectl get po -n kubeflow | grep volumes-web-app
```

1개의 pod가 Running 이 될 때까지 기다립니다.

```text
volumes-web-app-deployment-8589d664cc-62svl              1/1     Running   0          27s
```

### Tensorboard & Tensorboard Web App

1. Tensorboard Web App 를 설치합니다.

  ```text
  kustomize build apps/tensorboard/tensorboards-web-app/upstream/overlays/istio | kubectl apply -f -
  ```

  정상적으로 수행되면 다음과 같이 출력됩니다.

  ```text
  serviceaccount/tensorboards-web-app-service-account created
  clusterrole.rbac.authorization.k8s.io/tensorboards-web-app-cluster-role created
  clusterrole.rbac.authorization.k8s.io/tensorboards-web-app-kubeflow-tensorboard-ui-admin created
  clusterrole.rbac.authorization.k8s.io/tensorboards-web-app-kubeflow-tensorboard-ui-edit created
  clusterrole.rbac.authorization.k8s.io/tensorboards-web-app-kubeflow-tensorboard-ui-view created
  clusterrolebinding.rbac.authorization.k8s.io/tensorboards-web-app-cluster-role-binding created
  configmap/tensorboards-web-app-parameters-g28fbd6cch created
  service/tensorboards-web-app-service created
  deployment.apps/tensorboards-web-app-deployment created
  virtualservice.networking.istio.io/tensorboards-web-app-tensorboards-web-app created
  ```

  정상적으로 설치되었는지 확인합니다.

  ```text
  kubectl get po -n kubeflow | grep tensorboards-web-app
  ```

  1 개의 pod 가 Running 이 될 때까지 기다립니다.

  ```text
  tensorboards-web-app-deployment-6ff79b7f44-qbzmw            1/1     Running             0          22s
  ```

2. Tensorboard Controller 를 설치합니다.

  ```text
  kustomize build apps/tensorboard/tensorboard-controller/upstream/overlays/kubeflow | kubectl apply -f -
  ```

  정상적으로 수행되면 다음과 같이 출력됩니다.

  ```text
  customresourcedefinition.apiextensions.k8s.io/tensorboards.tensorboard.kubeflow.org created
  serviceaccount/tensorboard-controller created
  role.rbac.authorization.k8s.io/tensorboard-controller-leader-election-role created
  clusterrole.rbac.authorization.k8s.io/tensorboard-controller-manager-role created
  clusterrole.rbac.authorization.k8s.io/tensorboard-controller-proxy-role created
  rolebinding.rbac.authorization.k8s.io/tensorboard-controller-leader-election-rolebinding created
  clusterrolebinding.rbac.authorization.k8s.io/tensorboard-controller-manager-rolebinding created
  clusterrolebinding.rbac.authorization.k8s.io/tensorboard-controller-proxy-rolebinding created
  configmap/tensorboard-controller-config-bf88mm96c8 created
  service/tensorboard-controller-controller-manager-metrics-service created
  deployment.apps/tensorboard-controller-controller-manager created
  ```

  정상적으로 설치되었는지 확인합니다.

  ```text
  kubectl get po -n kubeflow | grep tensorboard-controller
  ```

  1 개의 pod 가 Running 이 될 때까지 기다립니다.

  ```text
  tensorboard-controller-controller-manager-954b7c544-vjpzj   3/3     Running   1          73s
  ```

### Training Operator

Training Operator 를 설치합니다.

```text
kustomize build apps/training-operator/upstream/overlays/kubeflow | kubectl apply -f -
```

정상적으로 수행되면 다음과 같이 출력됩니다.

```text
customresourcedefinition.apiextensions.k8s.io/mxjobs.kubeflow.org created
customresourcedefinition.apiextensions.k8s.io/pytorchjobs.kubeflow.org created
customresourcedefinition.apiextensions.k8s.io/tfjobs.kubeflow.org created
customresourcedefinition.apiextensions.k8s.io/xgboostjobs.kubeflow.org created
serviceaccount/training-operator created
clusterrole.rbac.authorization.k8s.io/kubeflow-training-admin created
clusterrole.rbac.authorization.k8s.io/kubeflow-training-edit created
clusterrole.rbac.authorization.k8s.io/kubeflow-training-view created
clusterrole.rbac.authorization.k8s.io/training-operator created
clusterrolebinding.rbac.authorization.k8s.io/training-operator created
service/training-operator created
deployment.apps/training-operator created
```

정상적으로 설치되었는지 확인합니다.

```text
kubectl get po -n kubeflow | grep training-operator
```

1 개의 pod 가 Running 이 될 때까지 기다립니다.

```text
training-operator-7d98f9dd88-6887f                          1/1     Running   0          28s
```

### User Namespace

Kubeflow 사용을 위해, 사용할 User의 Kubeflow Profile 을 생성합니다.

```text
kustomize build common/user-namespace/base | kubectl apply -f -
```

정상적으로 수행되면 다음과 같이 출력됩니다.

```text
configmap/default-install-config-9h2h2b6hbk created
profile.kubeflow.org/kubeflow-user-example-com created
```

kubeflow-user-example-com profile 이 생성된 것을 확인합니다.

```text
kubectl get profile
```

```text
kubeflow-user-example-com   37s
```

## 정상 설치 확인

Kubeflow central dashboard에 web browser로 접속하기 위해 포트 포워딩합니다.

```text
kubectl port-forward svc/istio-ingressgateway -n istio-system 8080:80
```

Web Browser 를 열어 [http://localhost:8080](http://localhost:8080) 으로 접속하여, 다음과 같은 화면이 출력되는 것을 확인합니다.

<p align="center">
  <img src="/images/docs/setup/login-after-install.png" title="login-ui"/>
</p>

다음 접속 정보를 입력하여 접속합니다.

- Email Address: `user@example.com`
- Password: `12341234`

<p align="center">
  <img src="/images/docs/setup/after-login.png" title="central-dashboard"/>
</p>
