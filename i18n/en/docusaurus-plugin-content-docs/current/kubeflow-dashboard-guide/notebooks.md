---
title : "2. Notebooks"
description: ""
sidebar_position: 2
contributors: ["Jaeyeon Kim"]
---

## 노트북 서버(Notebook Server) 생성하기

다음 Central Dashboard의 왼쪽 탭의 Notebooks를 클릭해보겠습니다.

![left-tabs](./img/left-tabs.png)

다음과 같은 화면을 볼 수 있습니다.

Notebooks 탭은 JupyterHub와 비슷하게 유저별로 jupyter notebook 및 code server 환경(이하 노트북 서버)을 독립적으로 생성하고 접속할 수 있는 페이지입니다.

![notebook-home](./img/notebook-home.png)

오른쪽 위의 `+ NEW NOTEBOOK` 버튼을 클릭합니다.

![new-notebook](./img/new-notebook.png)

아래와 같은 화면이 나타나면, 이제 생성할 노트북 서버의 스펙(Spec)을 명시하여 생성합니다.

![create](./img/create.png)

<details>
<summary>각 스펙에 대한 자세한 내용은 아래와 같습니다.</summary>

- **name**:
  - 노트북 서버를 구분할 수 있는 이름으로 생성합니다.
- **namespace** :
  - 따로 변경할 수 없습니다. (현재 로그인한 user 계정의 namespace이 자동으로 지정되어 있습니다.)
- **Image**:
  - sklearn, pytorch, tensorflow 등의 파이썬 패키지가 미리 설치된 jupyter lab 이미지 중 사용할 이미지를 선택합니다.
    - 노트북 서버 내에서 GPU를 사용하여 tensorflow-cuda, pytorch-cuda 등의 이미지를 사용하는 경우, **하단의 GPUs** 부분을 확인하시기 바랍니다.
  - 추가적인 패키지나 소스코드 등을 포함한 커스텀(Custom) 노트북 서버를 사용하고 싶은 경우에는 커스텀 이미지(Custom Image)를 만들고 배포 후 사용할 수도 있습니다.
- **CPU / RAM**
  - 필요한 자원 사용량을 입력합니다.
    - cpu : core 단위
      - 가상 core 개수 단위를 의미하며, int 형식이 아닌  `1.5`, `2.7` 등의 float 형식도 입력할 수 있습니다.
    - memory : Gi 단위
- **GPUs**
  - 주피터 노트북에 할당할 GPU 개수를 입력합니다.
    - `None`
      - GPU 자원이 필요하지 않은 상황
    - 1, 2, 4
      - GPU 1, 2, 4 개 할당
  - GPU Vendor
    - 앞의 [(Optional) Setup GPU](../setup-kubernetes/setup-nvidia-gpu.md) 를 따라 nvidia gpu plugin을 설치하였다면 NVIDIA를 선택합니다.
- **Workspace Volume**
  - 노트북 서버 내에서 필요한 만큼의 디스크 용량을 입력합니다.
  - Type 과 Name 은 변경하지 않고, **디스크 용량을 늘리고 싶거나** **AccessMode 를 변경하고 싶을** 때에만 변경해서 사용하시면 됩니다.
    - **"Don't use Persistent Storage for User's home"** 체크박스는 노트북 서버의 작업 내용을 저장하지 않아도 상관없을 때에만 클릭합니다. **일반적으로는 누르지 않는 것을 권장합니다.**
    - 기존에 미리 생성해두었던 PVC를 사용하고 싶을 때에는, Type을 "Existing" 으로 입력하여 해당 PVC의 이름을 입력하여 사용하시면 됩니다.
- **Data Volumes**
  - 추가적인 스토리지 자원이 필요하다면 **"+ ADD VOLUME"** 버튼을 클릭하여 생성할 수 있습니다.
- ~~Configurations, Affinity/Tolerations, Miscellaneous Settings~~
  - 일반적으로는 필요하지 않으므로 *모두의 MLOps*에서는 자세한 설명을 생략합니다.

</details>

모두 정상적으로 입력하였다면 하단의 **LAUNCH** 버튼이 활성화되며, 버튼을 클릭하면 노트북 서버 생성이 시작됩니다.

![creating](./img/creating.png)

생성 후 아래와 같이 **Status** 가 초록색 체크 표시 아이콘으로 변하며, **CONNECT 버튼**이 활성화됩니다.

![created](./img/created.png)

---

## 노트북 서버 접속하기

**CONNECT 버튼**을 클릭하면 브라우저에 새 창이 열리며, 다음과 같은 화면이 보입니다.

![notebook-access](./img/notebook-access.png)

**Launcher**의 Notebook, Console, Terminal 아이콘을 클릭하여 사용할 수 있습니다.

  생성된 Notebook 화면

![notebook-console](./img/notebook-console.png)

  생성된 Terminal 화면

![terminal-console](./img/terminal-console.png)

---

## 노트북 서버 중단하기

노트북 서버를 오랜 시간 사용하지 않는 경우, 쿠버네티스 클러스터의 효율적인 리소스 사용을 위해서 노트북 서버를 중단(Stop)할 수 있습니다. **단, 이 경우 노트북 서버 생성 시 Workspace Volume 또는 Data Volume으로 지정해놓은 경로 외에 저장된 데이터는 모두 초기화되는 것에 주의하시기 바랍니다.**  
노트북 서버 생성 당시 경로를 변경하지 않았다면, 디폴트(Default) Workspace Volume의 경로는 노트북 서버 내의 `/home/jovyan` 이므로, `/home/jovyan` 의 하위 경로 이외의 경로에 저장된 데이터는 모두 사라집니다.

다음과 같이 `STOP` 버튼을 클릭하면 노트북 서버가 중단됩니다.

![notebook-stop](./img/notebook-stop.png)

중단이 완료되면 다음과 같이 `CONNECT` 버튼이 비활성화되며, `PLAY` 버튼을 클릭하면 다시 정상적으로 사용할 수 있습니다.

![notebook-restart](./img/notebook-restart.png)
