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

```bash
npm install
```

2. 글 수정 및 추가를 후 ci 를 실행합니다.

```bash
npm ci
```

3. node 서버를 실행 후 수정한 글이 정상적으로 나오는지 확인합니다.

```bash
npm run start
```

## How to Contribute

### 1. 새로운 포스트를 작성하는 경우

새로운 포스트는 각 챕터와 포스트의 위치에 맞는 weight를 설정합니다.

- Introduction: 1xx
- Setup: 2xx
- Kubeflow: 3xx
- API Deployment: 4xx
- Help: 10xx

### 2. 기존의 포스트를 수정하는 경우

기존의 포스트를 수정할 경우 Contributor에 본인의 이름을 입력합니다.

```markdown
contributors: ["John Doe", "Adam Smith"]
```

### 3. 프로젝트에 처음 기여하는 경우

만약 프로젝트에 처음 기여 할 경우 `content/en/contributors`에 본인의 이름의 마크다운 파일을 작성합니다.
마크다운 파일은 `john-doe`을 파일명으로 하며 다음의 내용을 작성합니다.
파일 명은 lowercase를 title은 upper camelcase를 이용해 작성합니다.

```markdown
---
title: "Jonh Doe"
draft: false
---
```
