/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: "category",
      label: "Introduction",
      items: [
        "introduction/intro",
        "introduction/levels",
        "introduction/component",
        "introduction/why_kubernetes",
      ],
    },
    {
      type: "category",
      label: "Setup Kubernetes",
      items: [
        "setup-kubernetes/intro",
        "setup-kubernetes/kubernetes",
        "setup-kubernetes/install-prerequisite",
        {
          type: "category",
          label: "4. Install Kubernetes",
          items: [
            "setup-kubernetes/install-kubernetes/kubernetes-with-k3s",
            "setup-kubernetes/install-kubernetes/kubernetes-with-kubeadm",
            "setup-kubernetes/install-kubernetes/kubernetes-with-minikube",
          ],
        },
        "setup-kubernetes/install-kubernetes-module",
        "setup-kubernetes/setup-nvidia-gpu",
      ],
    },
    {
      type: "category",
      label: "Setup Components",
      items: [
        "setup-components/install-components-kf",
        "setup-components/install-components-mlflow",
        "setup-components/install-components-seldon",
        "setup-components/install-components-pg",
      ],
    },
    {
      type: "category",
      label: "Kubeflow UI Guide",
      items: [
        "kubeflow-dashboard-guide/intro",
        "kubeflow-dashboard-guide/notebooks",
        "kubeflow-dashboard-guide/tensorboards",
        "kubeflow-dashboard-guide/volumes",
        "kubeflow-dashboard-guide/experiments",
        "kubeflow-dashboard-guide/experiments-and-others",
      ],
    },
    {
      type: "category",
      label: "Kubeflow",
      items: [
        "kubeflow/kubeflow-intro",
        "kubeflow/kubeflow-concepts",
        "kubeflow/basic-requirements",
        "kubeflow/basic-component",
        "kubeflow/basic-pipeline",
        "kubeflow/basic-pipeline-upload",
        "kubeflow/basic-run",
        "kubeflow/advanced-component",
        "kubeflow/advanced-environment",
        "kubeflow/advanced-pipeline",
        "kubeflow/advanced-run",
        "kubeflow/advanced-mlflow",
        "kubeflow/how-to-debug",
      ],
    },
    {
      type: "category",
      label: "API Deployment",
      items: [
        "api-deployment/what-is-api-deployment",
        "api-deployment/seldon-iris",
        "api-deployment/seldon-pg",
        "api-deployment/seldon-fields",
        "api-deployment/seldon-mlflow",
        "api-deployment/seldon-children",
      ],
    },
    {
      type: "category",
      label: "Appendix",
      items: ["appendix/pyenv", "appendix/metallb"],
    },
    {
      type: "category",
      label: "Further Readings",
      items: ["further-readings/info"],
    },
  ],

  preSidebar: [
    {
      type: "category",
      label: "Docker",
      items: [
        "prerequisites/docker/install",
        "prerequisites/docker/introduction",
        "prerequisites/docker/docker",
        "prerequisites/docker/command",
        "prerequisites/docker/images",
        "prerequisites/docker/advanced",
      ],
    },
  ],
};

module.exports = sidebars;
