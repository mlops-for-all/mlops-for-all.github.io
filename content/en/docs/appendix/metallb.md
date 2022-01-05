---
title: "2. bare-metal 클러스터용 load balancer metallb 설치"
draft: false
images: []
menu:
  docs:
    parent: "appendix"
weight: 8001
toc: true
---

## MetalLB란?

Kubernetes 사용 시 AWS, GCP, Azure 와 같은 클라우드 플랫폼에서는 자체적으로 로드 벨런서(Load Balancer)를 제공해 주지만, 온프레미스 클러스터에서는 로드 벨런싱 기능을 제공하는 모듈을 추가적으로 설치해야 합니다.  
[MetalLB](https://metallb.universe.tf/)는 베어메탈 환경에서 사용할 수 있는 로드 벨런서를 제공하는 오픈소스 프로젝트 입니다.

## 요구사항

| 요구 사항                                                    | 버전 및 내용                                                 |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| Kubernetes                                                   | 로드 벨런싱 기능이 없는 >= v1.13.0                           |
| [호환가능한 네트워크  CNI](https://metallb.universe.tf/installation/network-addons/) | Calico, Canal, Cilium, Flannel, Kube-ovn, Kube-router, Weave  Net |
| IPv4 주소                                                    | MetalLB 배포에 사용                                          |
| BGP 모드를 사용할 경우                                       | BGP 기능을 지원하는 하나 이상의 라우터                       |
| 노드 간 포트 TCP/UDP 7946 오픈                               | memberlist 요구 사항  

## MetalLB 설치

### Preparation

IPVS 모드에서 kube-proxy를 사용하는 경우 Kubernetes v1.14.2 이후부터는 엄격한 ARP(strictARP) 모드를 사용하도록 설정해야 합니다.  
Kube-router는 기본적으로 엄격한 ARP를 활성화하므로 서비스 프록시로 사용할 경우에는 이 기능이 필요하지 않습니다.  
엄격한 ARP 모드를 적용하기에 앞서, 현재 모드를 확인합니다.

```text
# see what changes would be made, returns nonzero returncode if different
kubectl get configmap kube-proxy -n kube-system -o yaml | \
grep strictARP
```

```text
strictARP: false
```

strictARP: false 가 출력되는 경우 다음을 실행하여 strictARP: true로 변경합니다.
(strictARP: true가 이미 출력된다면 다음 커맨드를 수행하지 않으셔도 됩니다.)

```text
# actually apply the changes, returns nonzero returncode on errors only
kubectl get configmap kube-proxy -n kube-system -o yaml | \
sed -e "s/strictARP: false/strictARP: true/" | \
kubectl apply -f - -n kube-system
```

정상적으로 수행되면 다음과 같이 출력됩니다.

```text
Warning: resource configmaps/kube-proxy is missing the kubectl.kubernetes.io/last-applied-configuration annotation which is required by kubectl apply. kubectl apply should only be used on resources created declaratively by either kubectl create --save-config or kubectl apply. The missing annotation will be patched automatically.
configmap/kube-proxy configured
```

### 설치 - Manifest

#### 1. MetalLB 를 설치합니다.

```text
kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.11.0/manifests/namespace.yaml
kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.11.0/manifests/metallb.yaml
```

#### 2. 정상 설치 확인

metallb-system namespace 의 2 개의 pod 이 모두 Running 이 될 때까지 기다립니다.

```text
kubectl get pod -n metallb-system
```

모두 Running 이 되면 다음과 비슷한 결과가 출력됩니다.

```text
NAME                          READY   STATUS    RESTARTS   AGE
controller-7dcc8764f4-8n92q   1/1     Running   1          1m
speaker-fnf8l                 1/1     Running   1          1m
```

매니페스트의 구성 요소는 다음과 같습니다.

- metallb-system/controller
  - deployment 로 배포되며, 로드 벨런싱을 수행할 external IP 주소의 할당을 처리하는 역할을 담당합니다.
- metallb-system/speaker
  - daemonset 형태로 배포되며, 외부 트래픽과 서비스를 연결해 네트워크 통신이 가능하도록 구성하는 역할을 담당합니다.

서비스에는 컨트롤러 및 스피커와 구성 요소가 작동하는 데 필요한 RBAC 사용 권한이 포함됩니다.

## Configuration

MetalLB 의 자세한 로드 벨런싱 정책 설정은 관련 설정 정보를 담아 k8s configmap 의 형태로 배포하여 설정할 수 있습니다.

MetalLB 에서 구성할 수 있는 모드로는 다음과 같이 2가지가 있습니다.

1. [Layer 2 모드](https://metallb.universe.tf/concepts/layer2/)
2. [BGP 모드](https://metallb.universe.tf/concepts/bgp/)

여기에서는 Layer 2 모드로 진행하겠습니다.

### Layer 2 Configuration

Layer 2 모드는 간단하게 사용할 IP 주소의 대역만 설정하면 됩니다.  
Layer 2 모드를 사용할 경우 워커 노드의 네트워크 인터페이스에 IP를 바인딩 하지 않아도 되는데 로컬 네트워크의 ARP 요청에 직접 응답하여 컴퓨터의 MAC주소를 클라이언트에 제공하는 방식으로 작동하기 때문입니다.

다음 `metallb_config.yaml` 파일은 MetalLB 가 192.168.35.100 ~ 192.168.35.110의 IP에 대한 제어 권한을 제공하고 Layer 2 모드를 구성하는 설정입니다.

클러스터 노드와 클라이언트 노드가 분리된 경우, 192.168.35.100 ~ 192.168.35.110 대역이 클라이언트 노드와 클러스터 노드 모두 접근 가능한 대역이어야 합니다.

#### metallb_config.yaml

```text
apiVersion: v1
kind: ConfigMap
metadata:
  namespace: metallb-system
  name: config
data:
  config: |
    address-pools:
    - name: default
      protocol: layer2
      addresses:
      - 192.168.35.100-192.168.35.110  # IP 대역폭
```

위의 설정을 적용합니다.

```test
kubectl apply -f metallb_config.yaml 
```

정상적으로 배포하면 다음과 같이 출력됩니다.

```test
configmap/config created
```

## MetalLB 사용

### Kubeflow Dashboard

먼저 kubeflow의 Dashboard 를 제공하는 istio-system 네임스페이스의 istio-ingressgateway 서비스의 타입을 `LoadBalancer`로 변경하여 MetalLB로부터 로드 벨런싱 기능을 제공받기 전에, 현재 상태를 확인합니다.

```text
kubectl get svc/istio-ingressgateway -n istio-system
```

해당 서비스의 타입은 ClusterIP이며, External-IP 값은 `none` 인 것을 확인할 수 있습니다.

```text
NAME                   TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)                                        AGE
istio-ingressgateway   ClusterIP   10.103.72.5   <none>        15021/TCP,80/TCP,443/TCP,31400/TCP,15443/TCP   4h21m
```

type 을 LoadBalancer 로 변경하고 원하는 IP 주소를 입력하고 싶은 경우 loadBalancerIP 항목을 추가합니다.  
추가 하지 않을 경우에는 위에서 설정한 IP 주소풀에서 순차적으로 IP 주소가 배정됩니다.

```text
kubectl edit svc/istio-ingressgateway -n istio-system
```

```text
spec:
  clusterIP: 10.103.72.5
  clusterIPs:
  - 10.103.72.5
  ipFamilies:
  - IPv4
  ipFamilyPolicy: SingleStack
  ports:
  - name: status-port
    port: 15021
    protocol: TCP
    targetPort: 15021
  - name: http2
    port: 80
    protocol: TCP
    targetPort: 8080
  - name: https
    port: 443
    protocol: TCP
    targetPort: 8443
  - name: tcp
    port: 31400
    protocol: TCP
    targetPort: 31400
  - name: tls
    port: 15443
    protocol: TCP
    targetPort: 15443
  selector:
    app: istio-ingressgateway
    istio: ingressgateway
  sessionAffinity: None
  type: LoadBalancer # Change ClusterIP to LoadBalancer
  loadBalancerIP: 192.168.35.100   # Add IP
status:
  loadBalancer: {}
```

다시 확인을 해보면 External-IP 값이 `192.168.35.100` 인 것을 확인합니다.

```text
kubectl get svc/istio-ingressgateway -n istio-system
```

```text
NAME                   TYPE           CLUSTER-IP    EXTERNAL-IP      PORT(S)                                                                      AGE
istio-ingressgateway   LoadBalancer   10.103.72.5   192.168.35.100   15021:31054/TCP,80:30853/TCP,443:30443/TCP,31400:30012/TCP,15443:31650/TCP   5h1m
```

Web Browser 를 열어 [http://192.168.35.100](http://192.168.35.100) 으로 접속하여, 다음과 같은 화면이 출력되는 것을 확인합니다.

<p align="center">
  <img src="static/images/docs/metallb/login-after-istio-ingressgateway-setting.png" title="login-ui"/>
</p>

### minio Dashboard

먼저 minio 의 Dashboard 를 제공하는 kubeflow 네임스페이스의 minio-service 서비스의 타입을 LoadBalancer로 변경하여 MetalLB로부터 로드 벨런싱 기능을 제공받기 전에, 현재 상태를 확인합니다.

```text
kubectl get svc/minio-service -n kubeflow
```

해당 서비스의 타입은 ClusterIP이며, External-IP 값은 `none` 인 것을 확인할 수 있습니다.

```text
NAME            TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
minio-service   ClusterIP   10.109.209.87   <none>        9000/TCP   5h14m
```

type 을 LoadBalancer 로 변경하고 원하는 IP 주소를 입력하고 싶은 경우 loadBalancerIP 항목을 추가합니다.  
추가 하지 않을 경우에는 위에서 설정한 IP 주소풀에서 순차적으로 IP 주소가 배정됩니다.

```text
kubectl edit svc/minio-service -n kubeflow
```

```text
apiVersion: v1
kind: Service
metadata:
  annotations:
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"v1","kind":"Service","metadata":{"annotations":{},"labels":{"application-crd-id":"kubeflow-pipelines"},"name":"minio-ser>
  creationTimestamp: "2022-01-05T08:44:23Z"
  labels:
    application-crd-id: kubeflow-pipelines
  name: minio-service
  namespace: kubeflow
  resourceVersion: "21120"
  uid: 0053ee28-4f87-47bb-ad6b-7ad68aa29a48
spec:
  clusterIP: 10.109.209.87
  clusterIPs:
  - 10.109.209.87
  ipFamilies:
  - IPv4
  ipFamilyPolicy: SingleStack
  ports:
  - name: http
    port: 9000
    protocol: TCP
    targetPort: 9000
  selector:
    app: minio
    application-crd-id: kubeflow-pipelines
  sessionAffinity: None
  type: LoadBalancer # Change ClusterIP to LoadBalancer
  loadBalancerIP: 192.168.35.101 # Add IP
status:
  loadBalancer: {}
```

다시 확인을 해보면 External-IP 값이 `192.168.35.101` 인 것을 확인할 수 있습니다.

```text
kubectl get svc/minio-service -n kubeflow
```

```text
NAME            TYPE           CLUSTER-IP      EXTERNAL-IP      PORT(S)          AGE
minio-service   LoadBalancer   10.109.209.87   192.168.35.101   9000:31371/TCP   5h21m
```

Web Browser 를 열어 [http://192.168.35.101:9000](http://192.168.35.101:9000) 으로 접속하여, 다음과 같은 화면이 출력되는 것을 확인합니다.

<p align="center">
  <img src="static/images/docs/metallb/login-after-minio-setting.png" title="login-ui"/>
</p>

### mlflow Dashboard

먼저 mlflow 의 Dashboard 를 제공하는 mlflow-system 네임스페이스의 mlflow-server-service 서비스의 타입을 LoadBalancer로 변경하여 MetalLB로부터 로드 벨런싱 기능을 제공받기 전에, 현재 상태를 확인합니다.

```text
kubectl get svc/mlflow-server-service -n mlflow-system
```

해당 서비스의 타입은 ClusterIP이며, External-IP 값은 `none` 인 것을 확인할 수 있습니다.

```text
NAME                    TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE
mlflow-server-service   ClusterIP   10.111.173.209   <none>        5000/TCP   4m50s
```

type 을 LoadBalancer 로 변경하고 원하는 IP 주소를 입력하고 싶은 경우 loadBalancerIP 항목을 추가합니다.  
추가 하지 않을 경우에는 위에서 설정한 IP 주소풀에서 순차적으로 IP 주소가 배정됩니다.

```text
kubectl edit svc/mlflow-server-service -n mlflow-system
```

```text
apiVersion: v1
kind: Service
metadata:
  annotations:
    meta.helm.sh/release-name: mlflow-server
    meta.helm.sh/release-namespace: mlflow-system
  creationTimestamp: "2022-01-07T04:00:19Z"
  labels:
    app.kubernetes.io/managed-by: Helm
  name: mlflow-server-service
  namespace: mlflow-system
  resourceVersion: "276246"
  uid: e5d39fb7-ad98-47e7-b512-f9c673055356
spec:
  clusterIP: 10.111.173.209
  clusterIPs:
  - 10.111.173.209
  ipFamilies:
  - IPv4
  ipFamilyPolicy: SingleStack
  ports:
  - port: 5000
    protocol: TCP
    targetPort: 5000
  selector:
    app.kubernetes.io/name: mlflow-server
  sessionAffinity: None
  type: LoadBalancer # Change ClusterIP to LoadBalancer
  loadBalancerIP: 192.168.35.102 # Add IP
status:
  loadBalancer: {}
```

다시 확인을 해보면 External-IP 값이 `192.168.35.102` 인 것을 확인할 수 있습니다.

```text
kubectl get svc/mlflow-server-service -n mlflow-system
```

```text
NAME                    TYPE           CLUSTER-IP       EXTERNAL-IP      PORT(S)          AGE
mlflow-server-service   LoadBalancer   10.111.173.209   192.168.35.102   5000:32287/TCP   6m11s
```

Web Browser 를 열어 [http://192.168.35.102:5000](http://192.168.35.102:5000) 으로 접속하여, 다음과 같은 화면이 출력되는 것을 확인합니다.

<p align="center">
  <img src="static/images/docs/metallb/login-after-mlflow-setting.png" title="login-ui"/>
</p>

### Grafana Dashboard

먼저 Grafana 의 Dashboard 를 제공하는 seldon-system 네임스페이스의 seldon-core-analytics-grafana 서비스의 타입을 LoadBalancer로 변경하여 MetalLB로부터 로드 벨런싱 기능을 제공받기 전에, 현재 상태를 확인합니다.

```text
kubectl get svc/seldon-core-analytics-grafana -n seldon-system
```

해당 서비스의 타입은 ClusterIP이며, External-IP 값은 `none` 인 것을 확인할 수 있습니다.

```text
NAME                            TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE
seldon-core-analytics-grafana   ClusterIP   10.109.20.161   <none>        80/TCP    94s
```

type 을 LoadBalancer 로 변경하고 원하는 IP 주소를 입력하고 싶은 경우 loadBalancerIP 항목을 추가합니다.  
추가 하지 않을 경우에는 위에서 설정한 IP 주소풀에서 순차적으로 IP 주소가 배정됩니다.

```text
kubectl edit svc/seldon-core-analytics-grafana -n seldon-system
```

```text
apiVersion: v1
kind: Service
metadata:
  annotations:
    meta.helm.sh/release-name: seldon-core-analytics
    meta.helm.sh/release-namespace: seldon-system
  creationTimestamp: "2022-01-07T04:16:47Z"
  labels:
    app.kubernetes.io/instance: seldon-core-analytics
    app.kubernetes.io/managed-by: Helm
    app.kubernetes.io/name: grafana
    app.kubernetes.io/version: 7.0.3
    helm.sh/chart: grafana-5.1.4
  name: seldon-core-analytics-grafana
  namespace: seldon-system
  resourceVersion: "280605"
  uid: 75073b78-92ec-472c-b0d5-240038ea8fa5
spec:
  clusterIP: 10.109.20.161
  clusterIPs:
  - 10.109.20.161
  ipFamilies:
  - IPv4
  ipFamilyPolicy: SingleStack
  ports:
  - name: service
    port: 80
    protocol: TCP
    targetPort: 3000
  selector:
    app.kubernetes.io/instance: seldon-core-analytics
    app.kubernetes.io/name: grafana
  sessionAffinity: None
  type: LoadBalancer # Change ClusterIP to LoadBalancer
  loadBalancerIP: 192.168.35.103 # Add IP
status:
  loadBalancer: {}
```

다시 확인을 해보면 External-IP 값이 `192.168.35.103` 인 것을 확인할 수 있습니다.

```text
kubectl get svc/seldon-core-analytics-grafana -n seldon-system
```

```text
NAME                            TYPE           CLUSTER-IP      EXTERNAL-IP      PORT(S)        AGE
seldon-core-analytics-grafana   LoadBalancer   10.109.20.161   192.168.35.103   80:31191/TCP   5m14s
```

Web Browser 를 열어 [http://192.168.35.103:80](http://192.168.35.103:80) 으로 접속하여, 다음과 같은 화면이 출력되는 것을 확인합니다.

<p align="center">
  <img src="static/images/docs/metallb/login-after-grafana-setting.png" title="login-ui"/>
</p>
