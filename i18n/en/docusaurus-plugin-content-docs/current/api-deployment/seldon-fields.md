---
title : "4. Seldon Fields"
description: ""
sidebar_position: 4
contributors: ["Jongseob Jeon"]
---

Summary of how Seldon Core creates an API server:

1. initContainer downloads the required model from the model repository.
2. The downloaded model is passed to the container.
3. The container runs an API server enclosing the model.
4. The API can be requested at the generated API server address to receive the inference values from the model.

The yaml file defining the custom resource, SeldonDeployment, which is most commonly used when using Seldon Core is as follows:
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
            - "gs://seldon-models/v1.12.0-dev/sklearn/iris"
            - "/mnt/models"
          volumeMounts:
          - mountPath: /mnt/models
            name: model-provision-location

        containers:
        - name: model
          image: seldonio/sklearnserver:1.8.0-dev
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

The `name` and `predictors` fields of SeldonDeployment are required fields. `name` is mainly used as a name to differentiate pods in Kubernetes and does not have a major effect. `predictors` must be a single array consisting of `name`, `componentSpecs` and `graph` defined. Here also, `name` is mainly used as a name to differentiate pods in Kubernetes and does not have a major effect.

Now let's take a look at the fields that need to be defined in `componentSpecs` and `graph`.

## componentSpecs

`componentSpecs` must be a single array consisting of the `spec` key. The `spec` must have the fields `volumes`, `initContainers` and `containers` defined.

### volumes

```text
volumes:
- name: model-provision-location
  emptyDir: {}
```
`Volumes` refer to the space used to store the models downloaded from the initContainer, which is received as an array with the components `name` and `emptyDir`. These values are used only once when downloading and moving the models, so they do not need to be modified significantly.
```text
- name: model-initializer
  image: gcr.io/kfserving/storage-initializer:v0.4.0
  args:
    - "gs://seldon-models/v1.12.0-dev/sklearn/iris"
    - "/mnt/models"
  volumeMounts:
  - mountPath: /mnt/models
    name: model-provision-location
```
The `args` field contains the system arguments necessary to download the model from the model repository and move it to the specified model path. It provides the required parameters for the initContainer to perform the downloading and storage operations.

initContainer is responsible for downloading the model to be used from the API, so the fields used determine the information needed to download data from the model registry. 

The value of initContainer consists of n arrays, and each model needs to be specified separately.

#### name
`name` is the name of the pod in Kubernetes, and it is recommended to use `{model_name}-initializer` for debugging. 

#### image

`image` is the name of the image used to download the model, and there are two recommended images by
- gcr.io/kfserving/storage-initializer:v0.4.0
- seldonio/rclone-storage-initializer:1.13.0-dev

For more detailed information, please refer to the following resources:

- [kfserving](https://docs.seldon.io/projects/seldon-core/en/latest/servers/kfserving-storage-initializer.html)
- [rclone](https://github.com/SeldonIO/seldon-core/tree/master/components/rclone-storage-initializer)

In 모두의 MLOps, we use kfserving for downloading and storing models.

#### args

```text
args:
  - "gs://seldon-models/v1.12.0-dev/sklearn/iris"
  - "/mnt/models"
```

When the gcr.io/kfserving/storage-initializer:v0.4.0 Docker image is run (`run`), it takes an argument in the form of an array. The first array value is the address of the model to be downloaded. The second array value is the address where the downloaded model will be stored (Seldon Core usually stores it in `/mnt/models`).

### volumeMounts

```text
volumeMounts:
  - mountPath: /mnt/models
    name: model-provision-location
```

`volumeMounts` is a field that attaches volumes to the Kubernetes to share `/mnt/models` as described in volumes. For more information, refer to Kubernetes Volume [Kubernetes Volume](https://kubernetes.io/docs/concepts/storage/volumes/)."

### container

```text
containers:
- name: model
  image: seldonio/sklearnserver:1.8.0-dev
  volumeMounts:
  - mountPath: /mnt/models
    name: model-provision-location
    readOnly: true
  securityContext:
    privileged: true
    runAsUser: 0
    runAsGroup: 0
```
 
 Container defines the fields that determine the configuration when the model is run in an API form.

#### name

The `name` field refers to the name of the pod in Kubernetes. It should be the name of the model being used.

#### image

The `image` field represents the image used to convert the model into an API. The image should have all the necessary packages installed when the model is loaded.

Seldon Core provides official images for different types of models, including:

- seldonio/sklearnserver
- seldonio/mlflowserver
- seldonio/xgboostserver
- seldonio/tfserving

You can choose the appropriate image based on the type of model you are using.

#### volumeMounts

```text
volumeMounts:
- mountPath: /mnt/models
  name: model-provision-location
  readOnly: true
```

This is a field that tells the path where the data downloaded from initContainer is located. Here, to prevent the model from being modified, `readOnly: true` will also be given.

#### securityContext

```text
securityContext:
  privileged: true
  runAsUser: 0
  runAsGroup: 0
```

When installing necessary packages, pod may not be able to perform the package installation due to lack of permission. To address this, root permission is granted (although this could cause security issues when in actual service).

## graph

```text
graph:
  name: model
  type: MODEL
  parameters:
  - name: model_uri
    type: STRING
    value: "/mnt/models"
  children: []
```

This is a field that defines the order in which the model operates.

### name

The `name` field refers to the name of the model graph. It should match the name defined in the container.

### type

The `type` field can have four different values:

1. TRANSFORMER
2. MODEL
3. OUTPUT_TRANSFORMER
4. ROUTER

For detailed explanations of each type, you can refer to the [Seldon Core Complex Graphs Metadata Example](https://docs.seldon.io/projects/seldon-core/en/latest/examples/graph-metadata.html).

### parameters

The `parameters` field contains values used in the class init. For the sklearnserver, you can find the required values in the [following file](https://github.com/SeldonIO/seldon-core/blob/master/servers/sklearnserver/sklearnserver/SKLearnServer.py).
```python
class SKLearnServer(SeldonComponent):
    def __init__(self, model_uri: str = None, method: str = "predict_proba"):
```

If you look at the code, you can define `model_uri` and `method`.

### children

The `children` field is used when creating the sequence diagram. More details about this field will be explained on the following page.
