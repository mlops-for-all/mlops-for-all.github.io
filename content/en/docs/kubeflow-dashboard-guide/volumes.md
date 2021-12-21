---
title : "4. Volumes"
description: ""
lead: ""
draft: false
weight: 274
contributors: ["Jaeyeon Kim"]
menu:
  docs:
    parent: kubeflow-ui-guide
---

다음으로는 Central Dashboard의 왼쪽 탭의 Volumes를 클릭해보겠습니다.

<p align="center">
  <img src="/images/docs/kubeflow-dashboard-guide/left-tabs.png" title="left-tabs"/>
</p>

다음과 같은 화면을 볼 수 있습니다.

<p align="center">
  <img src="/images/docs/kubeflow-dashboard-guide/volumes.png" title="left-tabs"/>
</p>

Volumes 탭은 Kubernetes의 [볼륨](https://kubernetes.io/ko/docs/concepts/storage/volumes/), 정확히는 [퍼시스턴트 볼륨 클레임(Persistent Volume Claim, 이하 pvc)](https://kubernetes.io/ko/docs/concepts/storage/persistent-volumes/) 중 현재 user의 namespace에 속한 pvc를 관리하는 기능을 제공합니다.

위 스크린샷을 보면, [1. Notebooks]({{< relref "docs/kubeflow-dashboard-guide/notebooks" >}}) 페이지에서 생성한 Volume의 정보를 확인할 수 있습니다. 해당 Volume의 Storage Class는 쿠버네티스 클러스터 설치 당시 설치한 Default Storage Class인 local-path로 설정되어있음을 확인할 수 있습니다.

이외에도 user namespace에 새로운 볼륨(Volume)을 생성하거나, 조회하거나, 삭제하고 싶은 경우에 Volumes 페이지를 활용할 수 있습니다.

---

## 볼륨 생성하기

오른쪽 상단의 `+ NEW VOLUME` 버튼을 클릭하면 다음과 같은 화면을 볼 수 있습니다.

<p align="center">
  <img src="/images/docs/kubeflow-dashboard-guide/new-volume.png" title="left-tabs"/>
</p>

name, size, storage class, access mode를 지정하여 생성할 수 있습니다.

원하는 리소스 스펙을 지정하여 생성하면 다음과 같이 볼륨의 Status가 `Pending`으로 조회됩니다. `Status` 아이콘에 마우스 커서를 가져다대면 *해당 볼륨은 mount하여 사용하는 first consumer가 나타날 때 실제로 생성을 진행한다*는 메시지를 확인할 수 있습니다.
이는 실습을 진행하는 [StorageClass](https://kubernetes.io/ko/docs/concepts/storage/storage-classes/)인 `local-path`의 볼륨 생성 정책에 해당하며, **문제 상황이 아님을 주의**하시기 바랍니다. 해당 페이지에서는 Pending Status로 보이더라도 해당 볼륨을 사용하길 원하는 노트북 서버 혹은 파드(Pod)에서는 해당 볼륨의 이름을 지정하여 사용할 수 있으며, 그 때 실제로 볼륨 생성 단계가 진행됩니다.

<p align="center">
  <img src="/images/docs/kubeflow-dashboard-guide/creating-volume.png" title="left-tabs"/>
</p>
