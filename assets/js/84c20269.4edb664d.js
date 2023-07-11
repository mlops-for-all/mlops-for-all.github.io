"use strict";(self.webpackChunkv_2=self.webpackChunkv_2||[]).push([[1017],{3905:(e,t,r)=>{r.d(t,{Zo:()=>u,kt:()=>m});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var c=n.createContext({}),p=function(e){var t=n.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},u=function(e){var t=p(e.components);return n.createElement(c.Provider,{value:t},e.children)},s="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},k=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,c=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),s=p(r),k=o,m=s["".concat(c,".").concat(k)]||s[k]||d[k]||a;return r?n.createElement(m,i(i({ref:t},u),{},{components:r})):n.createElement(m,i({ref:t},u))}));function m(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,i=new Array(a);i[0]=k;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l[s]="string"==typeof e?e:o,i[1]=l;for(var p=2;p<a;p++)i[p]=r[p];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}k.displayName="MDXCreateElement"},1108:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>d,frontMatter:()=>a,metadata:()=>l,toc:()=>p});var n=r(7462),o=(r(7294),r(3905));const a={title:"What is Docker?",description:"Introduction to Docker.",sidebar_position:3,contributors:["Jongseob Jeon","Jaeyeon Kim"]},i=void 0,l={unversionedId:"prerequisites/docker/docker",id:"prerequisites/docker/docker",title:"What is Docker?",description:"Introduction to Docker.",source:"@site/docs/prerequisites/docker/docker.md",sourceDirName:"prerequisites/docker",slug:"/prerequisites/docker/",permalink:"/docs/prerequisites/docker/",draft:!1,editUrl:"https://github.com/mlops-for-all/mlops-for-all.github.io/tree/main/docs/prerequisites/docker/docker.md",tags:[],version:"current",lastUpdatedBy:"Aiden-Jeon",lastUpdatedAt:1689038498,formattedLastUpdatedAt:"2023\ub144 7\uc6d4 11\uc77c",sidebarPosition:3,frontMatter:{title:"What is Docker?",description:"Introduction to Docker.",sidebar_position:3,contributors:["Jongseob Jeon","Jaeyeon Kim"]},sidebar:"preSidebar",previous:{title:"Why Docker & Kubernetes ?",permalink:"/docs/prerequisites/docker/introduction"},next:{title:"[Practice] Docker command",permalink:"/docs/prerequisites/docker/command"}},c={},p=[{value:"\ucee8\ud14c\uc774\ub108",id:"\ucee8\ud14c\uc774\ub108",level:2},{value:"\ub3c4\ucee4",id:"\ub3c4\ucee4",level:2},{value:"Layer \ud574\uc11d",id:"layer-\ud574\uc11d",level:2},{value:"For ML Engineer",id:"for-ml-engineer",level:2}],u={toc:p},s="wrapper";function d(e){let{components:t,...a}=e;return(0,o.kt)(s,(0,n.Z)({},u,a,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h2",{id:"\ucee8\ud14c\uc774\ub108"},"\ucee8\ud14c\uc774\ub108"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"\ucee8\ud14c\uc774\ub108 \uac00\uc0c1\ud654",(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},"\uc5b4\ud50c\ub9ac\ucf00\uc774\uc158\uc744 \uc5b4\ub514\uc5d0\uc11c\ub098 \ub3d9\uc77c\ud558\uac8c \uc2e4\ud589\ud558\ub294 \uae30\uc220"))),(0,o.kt)("li",{parentName:"ul"},"\ucee8\ud14c\uc774\ub108 \uc774\ubbf8\uc9c0",(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},"\uc5b4\ud50c\ub9ac\ucf00\uc774\uc158\uc744 \uc2e4\ud589\uc2dc\ud0a4\uae30 \uc704\ud574 \ud544\uc694\ud55c \ubaa8\ub4e0 \ud30c\uc77c\ub4e4\uc758 \uc9d1\ud569"),(0,o.kt)("li",{parentName:"ul"},"\u2192 \ubd95\uc5b4\ube75 \ud2c0"))),(0,o.kt)("li",{parentName:"ul"},"\ucee8\ud14c\uc774\ub108\ub780?",(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},"\ucee8\ud14c\uc774\ub108 \uc774\ubbf8\uc9c0\ub97c \uae30\ubc18\uc73c\ub85c \uc2e4\ud589\ub41c \ud55c \uac1c\uc758 \ud504\ub85c\uc138\uc2a4"),(0,o.kt)("li",{parentName:"ul"},"\u2192 \ubd95\uc5b4\ube75 \ud2c0\ub85c \ucc0d\uc5b4\ub0b8 \ubd95\uc5b4\ube75")))),(0,o.kt)("h2",{id:"\ub3c4\ucee4"},"\ub3c4\ucee4"),(0,o.kt)("p",null,"\ub3c4\ucee4\ub294 ",(0,o.kt)("strong",{parentName:"p"},"\ucee8\ud14c\uc774\ub108\ub97c \uad00\ub9ac"),"\ud558\uace0 \uc0ac\uc6a9\ud560 \uc218 \uc788\uac8c \ud574\uc8fc\ub294 \ud50c\ub7ab\ud3fc\uc785\ub2c8\ub2e4.",(0,o.kt)("br",{parentName:"p"}),"\n","\uc774\ub7ec\ud55c \ub3c4\ucee4\uc758 \uc2ac\ub85c\uac74\uc740 \ubc14\ub85c ",(0,o.kt)("strong",{parentName:"p"},"Build Once, Run Anywhere")," \ub85c \uc5b4\ub514\uc5d0\uc11c\ub098 \ub3d9\uc77c\ud55c \uc2e4\ud589 \uacb0\uacfc\ub97c \ubcf4\uc7a5\ud569\ub2c8\ub2e4."),(0,o.kt)("p",null,"\ub3c4\ucee4 \ub0b4\ubd80\uc5d0\uc11c \ub3d9\uc791\ud558\ub294 \uacfc\uc815\uc744 \ubcf4\uc790\uba74 \uc2e4\uc81c\ub85c container \ub97c \uc704\ud55c \ub9ac\uc18c\uc2a4\ub97c \ubd84\ub9ac\ud558\uace0, lifecycle \uc744 \uc81c\uc5b4\ud558\ub294 \uae30\ub2a5\uc740 linux kernel \uc758 cgroup \ub4f1\uc774 \uc218\ud589\ud569\ub2c8\ub2e4.\n\ud558\uc9c0\ub9cc \uc774\ub7ec\ud55c \uc778\ud130\ud398\uc774\uc2a4\ub97c \ubc14\ub85c \uc0ac\uc6a9\ud558\ub294 \uac83\uc740 ",(0,o.kt)("strong",{parentName:"p"},"\ub108\ubb34 \uc5b4\ub835\uae30 \ub54c\ubb38\uc5d0")," \ub2e4\uc74c\uacfc \uac19\uc740 \ucd94\uc0c1\ud654 layer\ub97c \ub9cc\ub4e4\uac8c \ub429\ub2c8\ub2e4."),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"docker-layer.png",src:r(866).Z,width:"574",height:"455"})),(0,o.kt)("p",null,"\uc774\ub97c \ud1b5\ud574 \uc0ac\uc6a9\uc790\ub294 \uc0ac\uc6a9\uc790 \uce5c\ud654\uc801\uc778 API \uc778 ",(0,o.kt)("strong",{parentName:"p"},"Docker CLI")," \ub9cc\uc73c\ub85c \uc27d\uac8c \ucee8\ud14c\uc774\ub108\ub97c \uc81c\uc5b4\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4."),(0,o.kt)("h2",{id:"layer-\ud574\uc11d"},"Layer \ud574\uc11d"),(0,o.kt)("p",null,"\uc704\uc5d0\uc11c \ub098\uc628 layer\ub4e4\uc758 \uc5ed\ud560\uc740 \ub2e4\uc74c\uacfc \uac19\uc2b5\ub2c8\ub2e4."),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"runC: linux kernel \uc758 \uae30\ub2a5\uc744 \uc9c1\uc811 \uc0ac\uc6a9\ud574\uc11c, container \ub77c\ub294 \ud558\ub098\uc758 \ud504\ub85c\uc138\uc2a4\uac00 \uc0ac\uc6a9\ud560 \ub124\uc784\uc2a4\ud398\uc774\uc2a4\uc640 cpu, memory, filesystem \ub4f1\uc744 \uaca9\ub9ac\uc2dc\ucf1c\uc8fc\ub294 \uae30\ub2a5\uc744 \uc218\ud589\ud569\ub2c8\ub2e4."),(0,o.kt)("li",{parentName:"ol"},"containerd: runC(OCI layer) \uc5d0\uac8c \uba85\ub839\uc744 \ub0b4\ub9ac\uae30 \uc704\ud55c \ucd94\uc0c1\ud654 \ub2e8\uacc4\uc774\uba70, \ud45c\uc900\ud654\ub41c \uc778\ud130\ud398\uc774\uc2a4(OCI)\ub97c \uc0ac\uc6a9\ud569\ub2c8\ub2e4."),(0,o.kt)("li",{parentName:"ol"},"dockerd: containerd \uc5d0\uac8c \uba85\ub839\uc744 \ub0b4\ub9ac\ub294 \uc5ed\ud560\ub9cc \ud569\ub2c8\ub2e4."),(0,o.kt)("li",{parentName:"ol"},"docker cli: \uc0ac\uc6a9\uc790\ub294 docker cli \ub85c dockerd (Docker daemon)\uc5d0\uac8c \uba85\ub839\uc744 \ub0b4\ub9ac\uae30\ub9cc \ud558\uba74 \ub429\ub2c8\ub2e4.",(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},"\uc774 \ud1b5\uc2e0 \uacfc\uc815\uc5d0\uc11c unix socket \uc744 \uc0ac\uc6a9\ud558\uae30 \ub54c\ubb38\uc5d0 \uac00\ub054 \ub3c4\ucee4 \uad00\ub828 \uc5d0\ub7ec\uac00 \ub098\uba74 ",(0,o.kt)("inlineCode",{parentName:"li"},"/var/run/docker.sock")," \uac00 \uc0ac\uc6a9 \uc911\uc774\ub2e4, \uad8c\ud55c\uc774 \uc5c6\ub2e4 \ub4f1\ub4f1\uc758 \uc5d0\ub7ec \uba54\uc2dc\uc9c0\uac00 \ub098\uc624\ub294 \uac83\uc785\ub2c8\ub2e4.")))),(0,o.kt)("p",null,"\uc774\ucc98\ub7fc \ub3c4\ucee4\ub294 \ub9ce\uc740 \ub2e8\uacc4\ub97c \uac10\uc2f8\uace0 \uc788\uc9c0\ub9cc, \ud754\ud788 \ub3c4\ucee4\ub77c\ub294 \uc6a9\uc5b4\ub97c \uc0ac\uc6a9\ud560 \ub54c\ub294 Docker CLI \ub97c \ub9d0\ud560 \ub54c\ub3c4 \uc788\uace0, Dockerd \ub97c \ub9d0\ud560 \ub54c\ub3c4 \uc788\uace0 Docker Container \ud558\ub098\ub97c \ub9d0\ud560 \ub54c\ub3c4 \uc788\uc5b4\uc11c \ud63c\ub780\uc774 \uc0dd\uae38 \uc218 \uc788\uc2b5\ub2c8\ub2e4.",(0,o.kt)("br",{parentName:"p"}),"\n","\uc55e\uc73c\ub85c \ub098\uc624\ub294 \uae00\uc5d0\uc11c\ub3c4 \ub3c4\ucee4\uac00 \uc5ec\ub7ec\uac00\uc9c0 \uc758\ubbf8\ub85c \uc4f0\uc77c \uc218 \uc788\uc2b5\ub2c8\ub2e4."),(0,o.kt)("h2",{id:"for-ml-engineer"},"For ML Engineer"),(0,o.kt)("p",null,"\uba38\uc2e0\ub7ec\ub2dd \uc5d4\uc9c0\ub2c8\uc5b4\uac00 \ub3c4\ucee4\ub97c \uc0ac\uc6a9\ud558\ub294 \uc774\uc720\ub294 \ub2e4\uc74c\uacfc \uac19\uc2b5\ub2c8\ub2e4."),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"\ub098\uc758 ML \ud559\uc2b5/\ucd94\ub860 \ucf54\ub4dc\ub97c OS, python version, python \ud658\uacbd, \ud2b9\uc815 python package \ubc84\uc804\uc5d0 independent \ud558\ub3c4\ub85d \ud574\uc57c \ud55c\ub2e4."),(0,o.kt)("li",{parentName:"ol"},"\uadf8\ub798\uc11c \ucf54\ub4dc \ubfd0\ub9cc\uc774 \uc544\ub2cc ",(0,o.kt)("strong",{parentName:"li"},"\ud574\ub2f9 \ucf54\ub4dc\uac00 \uc2e4\ud589\ub418\uae30 \uc704\ud574 \ud544\uc694\ud55c \ubaa8\ub4e0 \uc885\uc18d\uc801\uc778 \ud328\ud0a4\uc9c0, \ud658\uacbd \ubcc0\uc218, \ud3f4\ub354\uba85 \ub4f1\ub4f1\uc744 \ud558\ub098\uc758 \ud328\ud0a4\uc9c0\ub85c")," \ubb36\uc744 \uc218 \uc788\ub294 \uae30\uc220\uc774 \ucee8\ud14c\uc774\ub108\ud654 \uae30\uc220\uc774\ub2e4."),(0,o.kt)("li",{parentName:"ol"},"\uc774 \uae30\uc220\uc744 \uc27d\uac8c \uc0ac\uc6a9\ud558\uace0 \uad00\ub9ac\ud560 \uc218 \uc788\ub294 \uc18c\ud504\ud2b8\uc6e8\uc5b4 \uc911 \ud558\ub098\uac00 \ub3c4\ucee4\uc774\uba70, \ud328\ud0a4\uc9c0\ub97c \ub3c4\ucee4 \uc774\ubbf8\uc9c0\ub77c\uace0 \ubd80\ub978\ub2e4.")))}d.isMDXComponent=!0},866:(e,t,r)=>{r.d(t,{Z:()=>n});const n=r.p+"assets/images/docker-layer-223ebf4a5bacfe912f92117606e17ac2.png"}}]);