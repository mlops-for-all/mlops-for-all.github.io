---
title: "How to Contribute"
# date: 2020-11-12T13:26:54+01:00
# lastmod: 2020-11-12T13:26:54+01:00
draft: false
images: []
menu:
  docs:
    parent: "help"
weight: 1001
toc: true
---

## How to Start

1. 필요한 node module을 설치합니다.

```text
npm install
```

2. 글 수정 및 추가를 후 ci 를 실행합니다.

```text
npm ci
```

3. node 클러스터를 실행 후 수정한 글이 정상적으로 나오는지 확인합니다.

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

만약 프로젝트에 처음 기여 할 때 `content/en/contributors`에 본인의 이름의 마크다운 파일을 작성합니다.

예를 들어, `minsoo kim`이 본인의 영어 이름이라면, 마크다운 파일은 `minsoo-kim.md`을 파일명으로 하여 다음의 내용을 작성합니다.
파일명은 하이픈(-)으로 연결한 소문자로, title은 띄어쓰기를 포함한 CamelCase로 작성합니다.

```markdown
---
title: "Minsoo Kim"
draft: false
---
```

## Before Commit

프로젝트에서는 각 글의 일관성을 위해서 여러 lint를 적용하고 있습니다.
다음 명령어를 실행해 test를 진행합니다.

pre-commit을 통해 대부분의 test를 통과할 수 있습니다.

```text
pip install pre-commit
pre-commit run -a
```

pre-commit 후 test를 진행합니다.

```text
npm test
```
