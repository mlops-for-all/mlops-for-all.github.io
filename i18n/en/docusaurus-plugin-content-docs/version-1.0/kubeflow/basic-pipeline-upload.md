---
title : "6. Pipeline - Upload"
description: ""
sidebar_position: 6
contributors: ["Jongseob Jeon"]
---

## Upload Pipeline

Now, let's upload the pipeline we created directly to kubeflow.  
Pipeline uploads can be done through the kubeflow dashboard UI.
Use the method used in [Install Kubeflow](../setup-components/install-components-kf.md) to do port forwarding.

```bash
kubectl port-forward svc/istio-ingressgateway -n istio-system 8080:80
```

Access [http://localhost:8080](http://localhost:8080) to open the dashboard.

### 1. Click Pipelines Tab

![pipeline-gui-0.png](./img/pipeline-gui-0.png)

### 2. Click Upload Pipeline

![pipeline-gui-1.png](./img/pipeline-gui-1.png)

### 3. Click Choose file

![pipeline-gui-2.png](./img/pipeline-gui-2.png)

### 4. Upload created yaml file

![pipeline-gui-3.png](./img/pipeline-gui-3.png)

### 5. Create

![pipeline-gui-4.png](./img/pipeline-gui-4.png)

## Upload Pipeline Version


The uploaded pipeline allows you to manage versions through uploads. However, it serves the role of gathering pipelines with the same name rather than version management at the code level, such as Github.
In the example above, clicking on example_pipeline will bring up the following screen.

![pipeline-gui-5.png](./img/pipeline-gui-5.png)

If you click this screen shows.

![pipeline-gui-4.png](./img/pipeline-gui-4.png)

If you click Upload Version, a screen appears where you can upload the pipeline.

![pipeline-gui-6.png](./img/pipeline-gui-6.png)

Now, upload your pipeline.

![pipeline-gui-7.png](./img/pipeline-gui-7.png)

Once uploaded, you can check the pipeline version as follows.

![pipeline-gui-8.png](./img/pipeline-gui-8.png)
