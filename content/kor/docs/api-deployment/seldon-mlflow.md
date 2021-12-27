---
title : "5. Model from MLflow"
description: ""
lead: ""
draft: false
weight: 441
contributors: ["Jongseob Jeon"]
menu:
  docs:
    parent: "api-deployment"
---

## Model from MLflow

이번 페이지에서는 [MLflow Component]({{< relref "docs/kubeflow/advanced-mlflow.md" >}})에서 저장된 모델을 이용해 API를 생성하는 방법에 대해서 알아보겠습니다.

## Secret

initContainer가 minio에 접근해서 모델을 다운로드받으려면 credentials가 필요합니다.
minio에 접근하기 위한 credentials는 다음과 같습니다.

```text
apiVersion: v1
type: Opaque
kind: Secret
metadata:
  name: seldon-init-container-secret
  namespace: kubeflow-user-example-com
data:
  AWS_ACCESS_KEY_ID: bWluaW8K=
  AWS_SECRET_ACCESS_KEY: bWluaW8xMjM=
  AWS_ENDPOINT_URL: aHR0cDovL21pbmlvLm1ha2luYXJvY2tzLmFp
  USE_SSL: ZmFsc2U=
```

`AWS_ACCESS_KEY_ID` 의 입력값은 `minio`입니다. 다만 secret의 입력값은 인코딩된 값이여야 되기 때문에 실제로 입력되는 값은 다음을 수행후 나오는 값이어야 합니다.

data에 입력되어야 하는 값들은 다음과 같습니다.

- AWS_ACCESS_KEY_ID: minio
- AWS_SECRET_ACCESS_KEY: minio123
- AWS_ENDPOINT_URL: http://minio-service.kubeflow.svc:9000
- USE_SSL: false

인코딩은 다음 명령어를 통해서 할 수 있습니다.

```text
echo -n minio | base64
```

그러면 다음과 같은 값이 출력됩니다.

```text
bWluaW8=
```

인코딩을 전체 값에 대해서 진행하면 다음과 같이 됩니다.

- AWS_ACCESS_KEY_ID: bWluaW8=
- AWS_SECRET_ACCESS_KEY: bWluaW8xMjM=
- AWS_ENDPOINT_URL: aHR0cDovL21pbmlvLXNlcnZpY2Uua3ViZWZsb3cuc3ZjOjkwMDA=
- USE_SSL: ZmFsc2U=

다음 명령어를 통해 secret을 생성할 수 있는 yaml파일을 생성합니다.

```text
cat <<EOF > seldon-init-container-secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: seldon-init-container-secret
  namespace: kubeflow-user-example-com
type: Opaque
data:
  AWS_ACCESS_KEY_ID: bWluaW8=
  AWS_SECRET_ACCESS_KEY: bWluaW8xMjM=
  AWS_ENDPOINT_URL: aHR0cDovL21pbmlvLXNlcnZpY2Uua3ViZWZsb3cuc3ZjOjkwMDA=
  USE_SSL: ZmFsc2U=
EOF
```

다음 명령어를 통해 secret을 생성합니다.

```text
kubectl apply -f seldon-init-container-secret.yaml
```

정상적으로 수행되면 다음과 같이 출력됩니다.

```text
secret/seldon-init-container-secret created
```

## Seldon Core yaml

이제 Seldon Core를 생성하는 yaml파일을 작성합니다.

```text
apiVersion: machinelearning.seldon.io/v1
kind: SeldonDeployment
metadata:
  name: seldon-example
  namespace: kubeflow-user-example-com
spec:
  name: model
  predictors:
  - name: model

    componentSpecs:
    - spec:
        volumes:
        - name: model-provision-location
          emptyDir: {}

        initContainers:
        - name: model-initializer
          image: gcr.io/kfserving/storage-initializer:v0.4.0
          args:
            - "s3://mlflow/mlflow/artifacts/0/74ba8e33994144f599e50b3be176cdb0/artifacts/svc"
            - "/mnt/models"
          volumeMounts:
          - mountPath: /mnt/models
            name: model-provision-location
          envFrom:
          - secretRef:
              name: seldon-init-container-secret

        containers:
        - name: model
          image: ghcr.io/mlops-for-all/mlflowserver
          volumeMounts:
          - mountPath: /mnt/models
            name: model-provision-location
            readOnly: true
          securityContext:
            privileged: true
            runAsUser: 0
            runAsGroup: 0

    graph:
      name: model
      type: MODEL
      parameters:
      - name: model_uri
        type: STRING
        value: "/mnt/models"
      children: []
```

이 전에 작성한 [Seldon Fields]({{< relref "docs/api-deployment/seldon-fields.md" >}})와 달라진 점은 크게 두 부분입니다.
initContainer에 `envFrom` 필드가 추가되었으며 args의 주소가 `s3://mlflow/mlflow/artifacts/0/74ba8e33994144f599e50b3be176cdb0/artifacts/svc` 로 바뀌었습니다.

### args

앞서 args의 첫번째 array는 우리가 다운로드받을 모델의 경로라고 했습니다.  
그럼 mlflow에 저장된 모델의 경로는 어떻게 알 수 있을까요?

다시 mlflow에 들어가서 run을 클릭하고 모델을 누르면 다음과 같이 확인할 수 있습니다.

<p align="center">
    <img src="/images/docs/api-deployment/seldon-mlflow-0.png" title="mlflow"/>
</p>

이렇게 확인된 경로를 입력하면 됩니다.

### envFrom

minio에 접근해서 모델을 다운로드 받는 데 필요한 환경변수를 입력해주는 과정입니다.
앞서 만든 `seldon-init-container-secret`를 이용합니다.

## API 생성

우선 위에서 정의한 스펙을 yaml 파일로 생성하겠습니다.

```text
apiVersion: machinelearning.seldon.io/v1
kind: SeldonDeployment
metadata:
  name: seldon-example
  namespace: kubeflow-user-example-com
spec:
  name: model
  predictors:
  - name: model

    componentSpecs:
    - spec:
        volumes:
        - name: model-provision-location
          emptyDir: {}

        initContainers:
        - name: model-initializer
          image: gcr.io/kfserving/storage-initializer:v0.4.0
          args:
            - "s3://mlflow/mlflow/artifacts/0/74ba8e33994144f599e50b3be176cdb0/artifacts/svc"
            - "/mnt/models"
          volumeMounts:
          - mountPath: /mnt/models
            name: model-provision-location
          envFrom:
          - secretRef:
              name: seldon-init-container-secret

        containers:
        - name: model
          image: ghcr.io/mlops-for-all/mlflowserver
          volumeMounts:
          - mountPath: /mnt/models
            name: model-provision-location
            readOnly: true
          securityContext:
            privileged: true
            runAsUser: 0
            runAsGroup: 0

    graph:
      name: model
      type: MODEL
      parameters:
      - name: model_uri
        type: STRING
        value: "/mnt/models"
      children: []
EOF
```

seldon pod을 생성합니다.

```text
kubectl apply -f seldon-mlflow.yaml

```

정상적으로 수행되면 다음과 같이 출력됩니다.

```text
seldondeployment.machinelearning.seldon.io/seldon-example created
```

이제 pod이 정상적으로 뜰 때까지 기다립니다.

```text
kubectl get po -n kubeflow-user-example-com | grep seldon
```

다음과 비슷하게 출력되면 정상적으로 API를 생성했습니다.

```text
seldon-example-model-0-model-5c949bd894-c5f28      3/3     Running     0          69s
```
