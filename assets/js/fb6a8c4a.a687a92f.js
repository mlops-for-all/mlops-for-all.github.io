"use strict";(self.webpackChunkv_2=self.webpackChunkv_2||[]).push([[9229],{3905:(e,n,t)=>{t.d(n,{Zo:()=>p,kt:()=>m});var i=t(7294);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function a(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);n&&(i=i.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,i)}return t}function l(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?a(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,i,r=function(e,n){if(null==e)return{};var t,i,r={},a=Object.keys(e);for(i=0;i<a.length;i++)t=a[i],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(i=0;i<a.length;i++)t=a[i],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var u=i.createContext({}),o=function(e){var n=i.useContext(u),t=n;return e&&(t="function"==typeof e?e(n):l(l({},n),e)),t},p=function(e){var n=o(e.components);return i.createElement(u.Provider,{value:n},e.children)},d="mdxType",k={inlineCode:"code",wrapper:function(e){var n=e.children;return i.createElement(i.Fragment,{},n)}},b=i.forwardRef((function(e,n){var t=e.components,r=e.mdxType,a=e.originalType,u=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),d=o(t),b=r,m=d["".concat(u,".").concat(b)]||d[b]||k[b]||a;return t?i.createElement(m,l(l({ref:n},p),{},{components:t})):i.createElement(m,l({ref:n},p))}));function m(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var a=t.length,l=new Array(a);l[0]=b;var s={};for(var u in n)hasOwnProperty.call(n,u)&&(s[u]=n[u]);s.originalType=e,s[d]="string"==typeof e?e:r,l[1]=s;for(var o=2;o<a;o++)l[o]=t[o];return i.createElement.apply(null,l)}return i.createElement.apply(null,t)}b.displayName="MDXCreateElement"},3595:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>u,contentTitle:()=>l,default:()=>k,frontMatter:()=>a,metadata:()=>s,toc:()=>o});var i=t(7462),r=(t(7294),t(3905));const a={title:"4.2. Minikube",description:"",sidebar_position:2,date:new Date("2021-12-13T00:00:00.000Z"),lastmod:new Date("2021-12-20T00:00:00.000Z"),contributors:["Jaeyeon Kim"]},l=void 0,s={unversionedId:"setup-kubernetes/install-kubernetes/kubernetes-with-minikube",id:"setup-kubernetes/install-kubernetes/kubernetes-with-minikube",title:"4.2. Minikube",description:"",source:"@site/docs/setup-kubernetes/install-kubernetes/kubernetes-with-minikube.md",sourceDirName:"setup-kubernetes/install-kubernetes",slug:"/setup-kubernetes/install-kubernetes/kubernetes-with-minikube",permalink:"/docs/setup-kubernetes/install-kubernetes/kubernetes-with-minikube",draft:!1,editUrl:"https://github.com/mlops-for-all/mlops-for-all.github.io/tree/main/docs/setup-kubernetes/install-kubernetes/kubernetes-with-minikube.md",tags:[],version:"current",lastUpdatedBy:"Tim cho",lastUpdatedAt:1708479021,formattedLastUpdatedAt:"2024\ub144 2\uc6d4 21\uc77c",sidebarPosition:2,frontMatter:{title:"4.2. Minikube",description:"",sidebar_position:2,date:"2021-12-13T00:00:00.000Z",lastmod:"2021-12-20T00:00:00.000Z",contributors:["Jaeyeon Kim"]},sidebar:"tutorialSidebar",previous:{title:"4.3. Kubeadm",permalink:"/docs/setup-kubernetes/install-kubernetes/kubernetes-with-kubeadm"},next:{title:"5. Install Kubernetes Modules",permalink:"/docs/setup-kubernetes/install-kubernetes-module"}},u={},o=[{value:"1. Prerequisite",id:"1-prerequisite",level:2},{value:"Minikube binary",id:"minikube-binary",level:3},{value:"2. \ucfe0\ubc84\ub124\ud2f0\uc2a4 \ud074\ub7ec\uc2a4\ud130 \uc14b\uc5c5",id:"2-\ucfe0\ubc84\ub124\ud2f0\uc2a4-\ud074\ub7ec\uc2a4\ud130-\uc14b\uc5c5",level:2},{value:"Disable default addons",id:"disable-default-addons",level:3},{value:"3. \ucfe0\ubc84\ub124\ud2f0\uc2a4 \ud074\ub77c\uc774\uc5b8\ud2b8 \uc14b\uc5c5",id:"3-\ucfe0\ubc84\ub124\ud2f0\uc2a4-\ud074\ub77c\uc774\uc5b8\ud2b8-\uc14b\uc5c5",level:2},{value:"4. \ucfe0\ubc84\ub124\ud2f0\uc2a4 \uae30\ubcf8 \ubaa8\ub4c8 \uc124\uce58",id:"4-\ucfe0\ubc84\ub124\ud2f0\uc2a4-\uae30\ubcf8-\ubaa8\ub4c8-\uc124\uce58",level:2},{value:"5. \uc815\uc0c1 \uc124\uce58 \ud655\uc778",id:"5-\uc815\uc0c1-\uc124\uce58-\ud655\uc778",level:2}],p={toc:o},d="wrapper";function k(e){let{components:n,...t}=e;return(0,r.kt)(d,(0,i.Z)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("h2",{id:"1-prerequisite"},"1. Prerequisite"),(0,r.kt)("p",null,"\ucfe0\ubc84\ub124\ud2f0\uc2a4 \ud074\ub7ec\uc2a4\ud130\ub97c \uad6c\ucd95\ud558\uae30\uc5d0 \uc55e\uc11c, \ud544\uc694\ud55c \uad6c\uc131 \uc694\uc18c\ub4e4\uc744 ",(0,r.kt)("strong",{parentName:"p"},"\ud074\ub7ec\uc2a4\ud130\uc5d0")," \uc124\uce58\ud569\ub2c8\ub2e4."),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"/docs/setup-kubernetes/install-prerequisite"},"Install Prerequisite"),"\uc744 \ucc38\uace0\ud558\uc5ec Kubernetes\ub97c \uc124\uce58\ud558\uae30 \uc804\uc5d0 \ud544\uc694\ud55c \uc694\uc18c\ub4e4\uc744 ",(0,r.kt)("strong",{parentName:"p"},"\ud074\ub7ec\uc2a4\ud130\uc5d0")," \uc124\uce58\ud574 \uc8fc\uc2dc\uae30 \ubc14\ub78d\ub2c8\ub2e4."),(0,r.kt)("h3",{id:"minikube-binary"},"Minikube binary"),(0,r.kt)("p",null,"Minikube\ub97c \uc0ac\uc6a9\ud558\uae30 \uc704\ud574, v1.24.0 \ubc84\uc804\uc758 Minikube \ubc14\uc774\ub108\ub9ac\ub97c \uc124\uce58\ud569\ub2c8\ub2e4."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"wget https://github.com/kubernetes/minikube/releases/download/v1.24.0/minikube-linux-amd64\nsudo install minikube-linux-amd64 /usr/local/bin/minikube\n")),(0,r.kt)("p",null,"\uc815\uc0c1\uc801\uc73c\ub85c \uc124\uce58\ub418\uc5c8\ub294\uc9c0 \ud655\uc778\ud569\ub2c8\ub2e4."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"minikube version\n")),(0,r.kt)("p",null,"\ub2e4\uc74c\uacfc \uac19\uc740 \uba54\uc2dc\uc9c0\uac00 \ubcf4\uc774\uba74 \uc815\uc0c1\uc801\uc73c\ub85c \uc124\uce58\ub41c \uac83\uc744 \uc758\ubbf8\ud569\ub2c8\ub2e4."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"mlops@ubuntu:~$ minikube version\nminikube version: v1.24.0\ncommit: 76b94fb3c4e8ac5062daf70d60cf03ddcc0a741b\n")),(0,r.kt)("h2",{id:"2-\ucfe0\ubc84\ub124\ud2f0\uc2a4-\ud074\ub7ec\uc2a4\ud130-\uc14b\uc5c5"},"2. \ucfe0\ubc84\ub124\ud2f0\uc2a4 \ud074\ub7ec\uc2a4\ud130 \uc14b\uc5c5"),(0,r.kt)("p",null,"\uc774\uc81c Minikube\ub97c \ud65c\uc6a9\ud574 \ucfe0\ubc84\ub124\ud2f0\uc2a4 \ud074\ub7ec\uc2a4\ud130\ub97c ",(0,r.kt)("strong",{parentName:"p"},"\ud074\ub7ec\uc2a4\ud130\uc5d0")," \uad6c\ucd95\ud569\ub2c8\ub2e4.\nGPU \uc758 \uc6d0\ud65c\ud55c \uc0ac\uc6a9\uacfc \ud074\ub7ec\uc2a4\ud130-\ud074\ub77c\uc774\uc5b8\ud2b8 \uac04 \ud1b5\uc2e0\uc744 \uac04\ud3b8\ud558\uac8c \uc218\ud589\ud558\uae30 \uc704\ud574, Minikube \ub294 ",(0,r.kt)("inlineCode",{parentName:"p"},"driver=none")," \uc635\uc158\uc744 \ud65c\uc6a9\ud558\uc5ec \uc2e4\ud589\ud569\ub2c8\ub2e4. ",(0,r.kt)("inlineCode",{parentName:"p"},"driver=none")," \uc635\uc158\uc740 root user \ub85c \uc2e4\ud589\ud574\uc57c \ud568\uc5d0 \uc8fc\uc758 \ubc14\ub78d\ub2c8\ub2e4."),(0,r.kt)("p",null,"root user\ub85c \uc804\ud658\ud569\ub2c8\ub2e4."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"sudo su\n")),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"minikube start"),"\ub97c \uc218\ud589\ud558\uc5ec \ucfe0\ubc84\ub124\ud2f0\uc2a4 \ud074\ub7ec\uc2a4\ud130 \uad6c\ucd95\uc744 \uc9c4\ud589\ud569\ub2c8\ub2e4. Kubeflow\uc758 \uc6d0\ud65c\ud55c \uc0ac\uc6a9\uc744 \uc704\ud574, \ucfe0\ubc84\ub124\ud2f0\uc2a4 \ubc84\uc804\uc740 v1.21.7\ub85c \uc9c0\uc815\ud558\uc5ec \uad6c\ucd95\ud558\uba70 ",(0,r.kt)("inlineCode",{parentName:"p"},"--extra-config"),"\ub97c \ucd94\uac00\ud569\ub2c8\ub2e4."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"minikube start --driver=none \\\n  --kubernetes-version=v1.21.7 \\\n  --extra-config=apiserver.service-account-signing-key-file=/var/lib/minikube/certs/sa.key \\\n  --extra-config=apiserver.service-account-issuer=kubernetes.default.svc\n")),(0,r.kt)("h3",{id:"disable-default-addons"},"Disable default addons"),(0,r.kt)("p",null,"Minikube\ub97c \uc124\uce58\ud558\uba74 Default\ub85c \uc124\uce58\ub418\ub294 addon\uc774 \uc874\uc7ac\ud569\ub2c8\ub2e4. \uc774 \uc911 \uc800\ud76c\uac00 \uc0ac\uc6a9\ud558\uc9c0 \uc54a\uc744 addon\uc744 \ube44\ud65c\uc131\ud654\ud569\ub2c8\ub2e4."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"minikube addons disable storage-provisioner\nminikube addons disable default-storageclass\n")),(0,r.kt)("p",null,"\ubaa8\ub4e0 addon\uc774 \ube44\ud65c\uc131\ud654\ub41c \uac83\uc744 \ud655\uc778\ud569\ub2c8\ub2e4."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"minikube addons list\n")),(0,r.kt)("p",null,"\ub2e4\uc74c\uacfc \uac19\uc740 \uba54\uc2dc\uc9c0\uac00 \ubcf4\uc774\uba74 \uc815\uc0c1\uc801\uc73c\ub85c \uc124\uce58\ub41c \uac83\uc744 \uc758\ubbf8\ud569\ub2c8\ub2e4."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"root@ubuntu:/home/mlops# minikube addons list\n|-----------------------------|----------|--------------|-----------------------|\n|         ADDON NAME          | PROFILE  |    STATUS    |      MAINTAINER       |\n|-----------------------------|----------|--------------|-----------------------|\n| ambassador                  | minikube | disabled     | unknown (third-party) |\n| auto-pause                  | minikube | disabled     | google                |\n| csi-hostpath-driver         | minikube | disabled     | kubernetes            |\n| dashboard                   | minikube | disabled     | kubernetes            |\n| default-storageclass        | minikube | disabled     | kubernetes            |\n| efk                         | minikube | disabled     | unknown (third-party) |\n| freshpod                    | minikube | disabled     | google                |\n| gcp-auth                    | minikube | disabled     | google                |\n| gvisor                      | minikube | disabled     | google                |\n| helm-tiller                 | minikube | disabled     | unknown (third-party) |\n| ingress                     | minikube | disabled     | unknown (third-party) |\n| ingress-dns                 | minikube | disabled     | unknown (third-party) |\n| istio                       | minikube | disabled     | unknown (third-party) |\n| istio-provisioner           | minikube | disabled     | unknown (third-party) |\n| kubevirt                    | minikube | disabled     | unknown (third-party) |\n| logviewer                   | minikube | disabled     | google                |\n| metallb                     | minikube | disabled     | unknown (third-party) |\n| metrics-server              | minikube | disabled     | kubernetes            |\n| nvidia-driver-installer     | minikube | disabled     | google                |\n| nvidia-gpu-device-plugin    | minikube | disabled     | unknown (third-party) |\n| olm                         | minikube | disabled     | unknown (third-party) |\n| pod-security-policy         | minikube | disabled     | unknown (third-party) |\n| portainer                   | minikube | disabled     | portainer.io          |\n| registry                    | minikube | disabled     | google                |\n| registry-aliases            | minikube | disabled     | unknown (third-party) |\n| registry-creds              | minikube | disabled     | unknown (third-party) |\n| storage-provisioner         | minikube | disabled     | kubernetes            |\n| storage-provisioner-gluster | minikube | disabled     | unknown (third-party) |\n| volumesnapshots             | minikube | disabled     | kubernetes            |\n|-----------------------------|----------|--------------|-----------------------|\n")),(0,r.kt)("h2",{id:"3-\ucfe0\ubc84\ub124\ud2f0\uc2a4-\ud074\ub77c\uc774\uc5b8\ud2b8-\uc14b\uc5c5"},"3. \ucfe0\ubc84\ub124\ud2f0\uc2a4 \ud074\ub77c\uc774\uc5b8\ud2b8 \uc14b\uc5c5"),(0,r.kt)("p",null,"\uc774\ubc88\uc5d0\ub294 ",(0,r.kt)("strong",{parentName:"p"},"\ud074\ub77c\uc774\uc5b8\ud2b8"),"\uc5d0 \ucfe0\ubc84\ub124\ud2f0\uc2a4\uc758 \uc6d0\ud65c\ud55c \uc0ac\uc6a9\uc744 \uc704\ud55c \ub3c4\uad6c\ub97c \uc124\uce58\ud569\ub2c8\ub2e4.\n",(0,r.kt)("strong",{parentName:"p"},"\ud074\ub77c\uc774\uc5b8\ud2b8"),"\uc640 ",(0,r.kt)("strong",{parentName:"p"},"\ud074\ub7ec\uc2a4\ud130")," \ub178\ub4dc\uac00 \ubd84\ub9ac\ub418\uc9c0 \uc54a\uc740 \uacbd\uc6b0\uc5d0\ub294 root user\ub85c \ubaa8\ub4e0 \uc791\uc5c5\uc744 \uc9c4\ud589\ud574\uc57c \ud568\uc5d0 \uc8fc\uc758\ubc14\ub78d\ub2c8\ub2e4."),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"\ud074\ub77c\uc774\uc5b8\ud2b8"),"\uc640 ",(0,r.kt)("strong",{parentName:"p"},"\ud074\ub7ec\uc2a4\ud130")," \ub178\ub4dc\uac00 \ubd84\ub9ac\ub41c \uacbd\uc6b0, \uc6b0\uc120 kubernetes\uc758 \uad00\ub9ac\uc790 \uc778\uc99d \uc815\ubcf4\ub97c ",(0,r.kt)("strong",{parentName:"p"},"\ud074\ub77c\uc774\uc5b8\ud2b8"),"\ub85c \uac00\uc838\uc635\ub2c8\ub2e4."),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("strong",{parentName:"p"},"\ud074\ub7ec\uc2a4\ud130"),"\uc5d0\uc11c config\ub97c \ud655\uc778\ud569\ub2c8\ub2e4."),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"# \ud074\ub7ec\uc2a4\ud130 \ub178\ub4dc\nminikube kubectl -- config view --flatten\n"))),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"\ub2e4\uc74c\uacfc \uac19\uc740 \uc815\ubcf4\uac00 \ucd9c\ub825\ub429\ub2c8\ub2e4."),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"apiVersion: v1\nclusters:\n")))),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"cluster:\ncertificate-authority-data: LS0tLS1CRUd....\nextensions:",(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre"},"- extension:\n    last-update: Mon, 06 Dec 2021 06:55:46 UTC\n    provider: minikube.sigs.k8s.io\n    version: v1.24.0\n  name: cluster_info\nserver: https://192.168.0.62:8443\n")),"  name: minikube\ncontexts:"),(0,r.kt)("li",{parentName:"ul"},"context:\ncluster: minikube\nextensions:",(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre"},"- extension:\n    last-update: Mon, 06 Dec 2021 06:55:46 UTC\n    provider: minikube.sigs.k8s.io\n    version: v1.24.0\n  name: context_info\nnamespace: default\nuser: minikube\n")),"  name: minikube\ncurrent-context: minikube\nkind: Config\npreferences: {}\nusers:"),(0,r.kt)("li",{parentName:"ul"},"name: minikube\nuser:\nclient-certificate-data: LS0tLS1CRUdJTi....\nclient-key-data: LS0tLS1CRUdJTiBSU0....",(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre"},"")))),(0,r.kt)("ol",{start:3},(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("strong",{parentName:"p"},"\ud074\ub77c\uc774\uc5b8\ud2b8")," \ub178\ub4dc\uc5d0\uc11c ",(0,r.kt)("inlineCode",{parentName:"p"},".kube")," \ud3f4\ub354\ub97c \uc0dd\uc131\ud569\ub2c8\ub2e4."),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"# \ud074\ub77c\uc774\uc5b8\ud2b8 \ub178\ub4dc\nmkdir -p /home/$USER/.kube\n"))),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"\ud574\ub2f9 \ud30c\uc77c\uc5d0 2. \uc5d0\uc11c \ucd9c\ub825\ub41c \uc815\ubcf4\ub97c \ubd99\uc5ec\ub123\uc740 \ub4a4 \uc800\uc7a5\ud569\ub2c8\ub2e4."),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"vi /home/$USER/.kube/config\n")))),(0,r.kt)("h2",{id:"4-\ucfe0\ubc84\ub124\ud2f0\uc2a4-\uae30\ubcf8-\ubaa8\ub4c8-\uc124\uce58"},"4. \ucfe0\ubc84\ub124\ud2f0\uc2a4 \uae30\ubcf8 \ubaa8\ub4c8 \uc124\uce58"),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"/docs/setup-kubernetes/install-kubernetes-module"},"Setup Kubernetes Modules"),"\uc744 \ucc38\uace0\ud558\uc5ec \ub2e4\uc74c \ucef4\ud3ec\ub10c\ud2b8\ub4e4\uc744 \uc124\uce58\ud574 \uc8fc\uc2dc\uae30 \ubc14\ub78d\ub2c8\ub2e4."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"helm"),(0,r.kt)("li",{parentName:"ul"},"kustomize"),(0,r.kt)("li",{parentName:"ul"},"CSI plugin"),(0,r.kt)("li",{parentName:"ul"},"[Optional]"," nvidia-docker, nvidia-device-plugin")),(0,r.kt)("h2",{id:"5-\uc815\uc0c1-\uc124\uce58-\ud655\uc778"},"5. \uc815\uc0c1 \uc124\uce58 \ud655\uc778"),(0,r.kt)("p",null,"\ucd5c\uc885\uc801\uc73c\ub85c node\uac00 Ready \uc778\uc9c0, OS, Docker, Kubernetes \ubc84\uc804\uc744 \ud655\uc778\ud569\ub2c8\ub2e4."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"kubectl get nodes -o wide\n")),(0,r.kt)("p",null,"\ub2e4\uc74c\uacfc \uac19\uc740 \uba54\uc2dc\uc9c0\uac00 \ubcf4\uc774\uba74 \uc815\uc0c1\uc801\uc73c\ub85c \uc124\uce58\ub41c \uac83\uc744 \uc758\ubbf8\ud569\ub2c8\ub2e4."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"NAME     STATUS   ROLES                  AGE     VERSION   INTERNAL-IP    EXTERNAL-IP   OS-IMAGE             KERNEL-VERSION     CONTAINER-RUNTIME\nubuntu   Ready    control-plane,master   2d23h   v1.21.7   192.168.0.75   <none>        Ubuntu 20.04.3 LTS   5.4.0-91-generic   docker://20.10.11\n")))}k.isMDXComponent=!0}}]);