---
title: "How to Contribute"
date: 2021-12-21
lastmod: 2021-12-21
draft: false
images: []
toc: true
menu:
  docs:
    parent: "help"
---

## How to Start

### Git Repo 준비

1. [*모두의 MLOps* GitHub Repository](https://github.com/mlops-for-all/mlops-for-all.github.io)에 접속합니다.

2. 여러분의 개인 Repository로 `Fork`합니다.

3. Forked Repository를 여러분의 작업 환경으로 `git clone`합니다.

### 환경 설정

1. 모두의 MLOps는 Hugo 와 Node를 이용하고 있습니다.  
  다음 명령어를 통해 필요한 패키지가 설치되어 있는지 확인합니다.

- node & npm

    ```text
    npm --version
    ```

- hugo

    ```text
    hugo version
    ```

1. 필요한 node module을 설치합니다.

    ```text
    npm install
    ```

2. 프로젝트에서는 각 글의 일관성을 위해서 여러 markdown lint를 적용하고 있습니다.  
  다음 명령어를 실행해 test를 진행한 후 커밋합니다.내용 수정 및 추가 후 lint가 맞는지 확인합니다.

    ```text
    npm test
    ```

4. lint 확인 완료 후 ci 를 실행합니다.

    ```text
    npm ci
    ```

4. 로컬에서 실행 후 수정한 글이 정상적으로 나오는지 확인합니다.

    ```text
    npm run start
    ```

## How to Contribute

### 1. 새로운 포스트를 작성할 때

새로운 포스트는 각 챕터와 포스트의 위치에 맞는 weight를 설정합니다.

- Introduction: 1xx
- Setup: 2xx
- Kubeflow: 3xx
- API Deployment: 4xx
- Help: 10xx

### 2. 기존의 포스트를 수정할 때

기존의 포스트를 수정할 때 Contributor에 본인의 이름을 입력합니다.

```markdown
contributors: ["John Doe", "Adam Smith"]
```

### 3. 프로젝트에 처음 기여할 때

만약 프로젝트에 처음 기여 할 때 `content/kor/contributors`에 본인의 이름으로 폴더를 생성한 후, `_index.md`라는 파일을 작성합니다.

예를 들어, `minsoo kim`이 본인의 영어 이름이라면, 폴더명은 `minsoo-kim`으로 하여 해당 폴더 내부의 `_index.md`파일에 다음의 내용을 작성합니다.
폴더명은 하이픈(-)으로 연결한 소문자로, title은 띄어쓰기를 포함한 CamelCase로 작성합니다.

```markdown
---
title: "John Doe"
draft: false
---
```

## After Pull Request

Pull Request를 생성하면 프로젝트에서는 자동으로 *모두의 MLOps* 운영진에게 리뷰 요청이 전해집니다. 최대 일주일 이내로 확인 후 Comment를 드릴 예정입니다.
