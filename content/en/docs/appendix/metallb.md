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

## What is MetalLB?

When using Kubernetes, cloud platforms such as AWS, GCP, and Azure provide their load balancer. On-premise clusters, however, require additional installations of modules that provide load balancing.
[MetalLB](https://metallb.universe.tf/) is an open-source project that provides load balancers in bare-metal environments.

## Requirements

| requirments                                                    | version and content                                                 |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| Kubernetes                                                   | Kubernetes 1.13.0 or later, that does not already have network load-balancing functionality                           |
| [cluster network configuration](https://metallb.universe.tf/installation/network-addons/) | Calico, Canal, Cilium, Flannel, Kube-ovn, Kube-router, Weave  Net |
| IPv4 addresses                                                    | for MetalLB to hand out                                          |
| When using the BGP operating mode                                       | need one or more routers capable of speaking [BGP](https://en.wikipedia.org/wiki/Border_Gateway_Protocol)                       |
| Traffic on port 7946 (TCP & UDP) must be allowed between nodes                              | required by [memberlist](https://github.com/hashicorp/memberlist).  

## Installation

### Preparation

If you use kube-proxy in IPVS mode, you must enable strict ARP mode after Kubernetes v1.14.2. Kube-router basically activates strict ARP, so this function is not required when used as a service proxy. Before applying the strict ARP mode, check whether the current mode is a strict ARP mode or not.

```text
# see what changes would be made, returns nonzero returncode if different
kubectl get configmap kube-proxy -n kube-system -o yaml | \
grep strictARP
```

```text
strictARP: false
```

If the output is strickARP: false, change it to strickARP:true by executing the following command. (If the result is already strickARP:true, you don't have to run the below command.)

```text
# actually apply the changes, returns nonzero returncode on errors only
kubectl get configmap kube-proxy -n kube-system -o yaml | \
sed -e "s/strictARP: false/strictARP: true/" | \
kubectl apply -f - -n kube-system
```

You will see the following result as output:

```text
Warning: resource configmaps/kube-proxy is missing the kubectl.kubernetes.io/last-applied-configuration annotation which is required by kubectl apply. kubectl apply should only be used on resources created declaratively by either kubectl create --save-config or kubectl apply. The missing annotation will be patched automatically.
configmap/kube-proxy configured
```

### Installation by manifest

#### 1. Apply the manifest

```text
kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.11.0/manifests/namespace.yaml
kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.11.0/manifests/metallb.yaml
```

#### 2. Check the result

Wait until both pods of the metallb-system namespace become Running.

```text
kubectl get pod -n metallb-system
```

When all pods are running, you will see the following result as output:

```text
NAME                          READY   STATUS    RESTARTS   AGE
controller-7dcc8764f4-8n92q   1/1     Running   1          1m
speaker-fnf8l                 1/1     Running   1          1m
```

The components in the manifest are:

- metallb-system/controller
  - distributed as deployment and is responsible for handling the allocation of external IP addresses to perform load balancing.
- metallb-system/speaker
  - distributed as daemonset and is responsible for configuring network communication by connecting external traffic and services.

The service includes the RBAC permissions required for controllers, speakers, and components to operate.

## Configuration

MetalLB's load balancing policy setting can be set by deploying a configmap containing related setting information.

MetalLB has two configurations:

1. [Layer 2](https://metallb.universe.tf/concepts/layer2/)
2. [BGP](https://metallb.universe.tf/concepts/bgp/)

We will explain how to set up MetalLB with Layer 2 mode.

### Layer 2 Configuration

Layer 2 mode is the simplest to configure: in many cases, you don’t need any protocol-specific configuration, only IP addresses.

Layer 2 mode does not require the IPs to be bound to the network interfaces of your worker nodes. It works by responding to ARP requests on your local network directly, to give the machine’s MAC address to clients.

The following configuration `metallb_config.yaml` gives MetalLB control over IPs from 192.168.35.100 to 192.168.35.110 and configures Layer 2 mode.  
If the cluster node and the client node are separated, the 192.168.35.100 to 192.168.35.110 bands must be accessible to both the client node and the cluster node.

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

Apply the above settings.

```test
kubectl apply -f metallb_config.yaml 
```

You will see the following result as output:

```test
configmap/config created
```

## Usage

### Kubeflow Dashboard

First, check the current status before receiving load balancing from MetalLB by changing the type of istio-ingressgateway service to `LoadBalancer` in the istio-system namespace that provides kubeflow's dashboard.

```text
kubectl get svc/istio-ingressgateway -n istio-system
```

You can see that the type of service is ClusterIP, and the External-IP value is `none`.

```text
NAME                   TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)                                        AGE
istio-ingressgateway   ClusterIP   10.103.72.5   <none>        15021/TCP,80/TCP,443/TCP,31400/TCP,15443/TCP   4h21m
```

Change the type to Load Balancer and add a `loadBalancerIP` key-value pair if you want to enter the desired IP address. If not added, IP addresses will be assigned sequentially from the IP address pool set from `metallb_config.yaml`.

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

If we check again, you can see the External-IP value is `192.168.35.100`.

```text
kubectl get svc/istio-ingressgateway -n istio-system
```

```text
NAME                   TYPE           CLUSTER-IP    EXTERNAL-IP      PORT(S)                                                                      AGE
istio-ingressgateway   LoadBalancer   10.103.72.5   192.168.35.100   15021:31054/TCP,80:30853/TCP,443:30443/TCP,31400:30012/TCP,15443:31650/TCP   5h1m
```

Open the Web Browser and access [http://192.168.35.100](http://192.168.35.100) to confirm that the following screen is output.

<p align="center">
  <img src="static/images/docs/metallb/login-after-istio-ingressgateway-setting.png" title="login-ui"/>
</p>

### minio Dashboard

First, check the current status before receiving load balancing from MetalLB by changing the type of minio-service service to `LoadBalancer` in the kubeflow namespace that provides minio’s dashboard.

```text
kubectl get svc/minio-service -n kubeflow
```

You can see that the type of service is ClusterIP, and the External-IP value is `none`.

```text
NAME            TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
minio-service   ClusterIP   10.109.209.87   <none>        9000/TCP   5h14m
```

Change the type to Load Balancer and add a loadBalancerIP key-value pair if you want to enter the desired IP address. If not added, IP addresses will be assigned sequentially from the IP address pool set from metallb_config.yaml.

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

If we check again, you can see the External-IP value is `192.168.35.101`.

```text
kubectl get svc/minio-service -n kubeflow
```

```text
NAME            TYPE           CLUSTER-IP      EXTERNAL-IP      PORT(S)          AGE
minio-service   LoadBalancer   10.109.209.87   192.168.35.101   9000:31371/TCP   5h21m
```

Open the Web Browser and access [http://192.168.35.101:9000](http://192.168.35.101:9000) to confirm that the following screen is output.

<p align="center">
  <img src="static/images/docs/metallb/login-after-minio-setting.png" title="login-ui"/>
</p>

### mlflow Dashboard

First, check the current status before receiving load balancing from MetalLB by changing the type of mlflow-server-service service to `LoadBalancer` in the mlflow-system namespace that provides mlflow’s dashboard.

```text
kubectl get svc/mlflow-server-service -n mlflow-system
```

You can see that the type of service is ClusterIP, and the External-IP value is `none`.

```text
NAME                    TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE
mlflow-server-service   ClusterIP   10.111.173.209   <none>        5000/TCP   4m50s
```

Change the type to Load Balancer and add a loadBalancerIP key-value pair if you want to enter the desired IP address. If not added, IP addresses will be assigned sequentially from the IP address pool set from metallb_config.yaml.

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

If we check again, you can see the External-IP value is `192.168.35.102`.

```text
kubectl get svc/mlflow-server-service -n mlflow-system
```

```text
NAME                    TYPE           CLUSTER-IP       EXTERNAL-IP      PORT(S)          AGE
mlflow-server-service   LoadBalancer   10.111.173.209   192.168.35.102   5000:32287/TCP   6m11s
```

Open the Web Browser and access [http://192.168.35.102:5000](http://192.168.35.102:5000) to confirm that the following screen is output.

<p align="center">
  <img src="static/images/docs/metallb/login-after-mlflow-setting.png" title="login-ui"/>
</p>

### Grafana Dashboard

First, check the current status before receiving load balancing from MetalLB by changing the type of seldon-core-analytics-grafana service to `LoadBalancer` in the seldon-system namespace that provides Grafana’s dashboard.

```text
kubectl get svc/seldon-core-analytics-grafana -n seldon-system
```

You can see that the type of service is ClusterIP, and the External-IP value is `none`.

```text
NAME                            TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE
seldon-core-analytics-grafana   ClusterIP   10.109.20.161   <none>        80/TCP    94s
```

Change the type to Load Balancer and add a loadBalancerIP key-value pair if you want to enter the desired IP address. If not added, IP addresses will be assigned sequentially from the IP address pool set from metallb_config.yaml.

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

If we check again, you can see the External-IP value is `192.168.35.103`.

```text
kubectl get svc/seldon-core-analytics-grafana -n seldon-system
```

```text
NAME                            TYPE           CLUSTER-IP      EXTERNAL-IP      PORT(S)        AGE
seldon-core-analytics-grafana   LoadBalancer   10.109.20.161   192.168.35.103   80:31191/TCP   5m14s
```

Open the Web Browser and access [http://192.168.35.103:80](http://192.168.35.103:80) to confirm that the following screen is output.

<p align="center">
  <img src="static/images/docs/metallb/login-after-grafana-setting.png" title="login-ui"/>
</p>
