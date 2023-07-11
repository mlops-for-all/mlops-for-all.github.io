"use strict";(self.webpackChunkv_2=self.webpackChunkv_2||[]).push([[5867],{3905:(e,t,n)=>{n.d(t,{Zo:()=>m,kt:()=>b});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var c=r.createContext({}),s=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},m=function(e){var t=s(e.components);return r.createElement(c.Provider,{value:t},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},p=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,c=e.parentName,m=l(e,["components","mdxType","originalType","parentName"]),u=s(n),p=o,b=u["".concat(c,".").concat(p)]||u[p]||d[p]||a;return n?r.createElement(b,i(i({ref:t},m),{},{components:n})):r.createElement(b,i({ref:t},m))}));function b(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,i=new Array(a);i[0]=p;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l[u]="string"==typeof e?e:o,i[1]=l;for(var s=2;s<a;s++)i[s]=n[s];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}p.displayName="MDXCreateElement"},3215:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>b,contentTitle:()=>d,default:()=>y,frontMatter:()=>u,metadata:()=>p,toc:()=>h});var r=n(7462),o=n(7294),a=n(3905),i=n(5999);function l(e){let{className:t,name:n,children:r,githubUrl:a,linkedinUrl:i,role:l}=e;return o.createElement("div",{className:t},o.createElement("div",{className:"card card--full-height"},o.createElement("div",{className:"card__header"},o.createElement("div",{className:"avatar avatar--vertical"},o.createElement("img",{className:"avatar__photo avatar__photo--xl",src:`${a}.png`,alt:`${n}'s avatar`}),o.createElement("div",{className:"avatar__intro"},o.createElement("h3",{className:"avatar__name"},n)),o.createElement("div",{className:"avatar__role"},o.createElement("h5",{className:"avatar__role"},l)))),o.createElement("div",{className:"card__body"},r),o.createElement("div",{className:"card__footer"},o.createElement("div",{className:"button-group button-group--block"},a&&o.createElement("a",{className:"button button--secondary",href:a},"GitHub"),i&&o.createElement("a",{className:"button button--secondary",href:i},"LinkedIn")))))}function c(e){return o.createElement(l,(0,r.Z)({},e,{className:"col col--6 margin-bottom--lg"}))}function s(){return o.createElement("div",{className:"row"},o.createElement(c,{name:"Jongseob Jeon",githubUrl:"https://github.com/aiden-jeon",linkedinUrl:"https://www.linkedin.com/in/jongseob-jeon/",role:"Project Leader"},o.createElement(i.Z,{id:"team.profile.Jongseob Jeon.body"},"\ub9c8\ud0a4\ub098\ub77d\uc2a4\uc5d0\uc11c \uba38\uc2e0\ub7ec\ub2dd \uc5d4\uc9c0\ub2c8\uc5b4\ub85c \uc77c\ud558\uace0 \uc788\uc2b5\ub2c8\ub2e4. \ubaa8\ub450\uc758 \ub525\ub7ec\ub2dd\uc744 \ud1b5\ud574 \ub9ce\uc740 \uc0ac\ub78c\ub4e4\uc774 \ub525\ub7ec\ub2dd\uc744 \uc27d\uac8c \uc811\ud588\ub4ef\uc774 \ubaa8\ub450\uc758 MLOps\ub97c \ud1b5\ud574 \ub9ce\uc740 \uc0ac\ub78c\ub4e4\uc774 MLOps\uc5d0 \uc27d\uac8c \uc811\ud560\uc218 \uc788\uae38 \ubc14\ub78d\ub2c8\ub2e4.")),o.createElement(c,{name:"Jayeon Kim",githubUrl:"https://github.com/anencore94",linkedinUrl:"https://www.linkedin.com/in/anencore94",role:"Project Member"},o.createElement(i.Z,{id:"team.profile.Jaeyeon Kim.body"},"\ube44\ud6a8\uc728\uc801\uc778 \uc791\uc5c5\uc744 \uc790\ub3d9\ud654\ud558\ub294 \uac83\uc5d0 \uad00\uc2ec\uc774 \ub9ce\uc2b5\ub2c8\ub2e4.")),o.createElement(c,{name:"Youngchel Jang",githubUrl:"https://github.com/zamonia500",linkedinUrl:"https://www.linkedin.com/in/youngcheol-jang-b04a45187",role:"Project Member"},o.createElement(i.Z,{id:"team.profile.Youngchel Jang.body"},"\ub9c8\ud0a4\ub098\ub77d\uc2a4\uc5d0\uc11c MLOps Engineer\ub85c \uc77c\ud558\uace0 \uc788\uc2b5\ub2c8\ub2e4. \ub2e8\uc21c\ud558\uac8c \uc0dd\uac01\ud558\ub294 \ub178\ub825\uc744 \ud558\uace0 \uc788\uc2b5\ub2c8\ub2e4.")))}function m(){return o.createElement("div",{className:"row"},o.createElement(c,{name:"Jongsun Shinn",githubUrl:"https://github.com/jsshinn",linkedinUrl:"https://www.linkedin.com/in/jongsun-shinn-311b00140/"},o.createElement(i.Z,{id:"team.profile.Jongsun Shinn.body"},"\ub9c8\ud0a4\ub098\ub77d\uc2a4\uc5d0\uc11c ML Engineer\ub85c \uc77c\ud558\uace0 \uc788\uc2b5\ub2c8\ub2e4.")),o.createElement(c,{name:"Sangwoo Shim",githubUrl:"https://github.com/borishim",linkedinUrl:"https://www.linkedin.com/in/sangwooshim/"},o.createElement(i.Z,{id:"team.profile.Sangwoo Shim.body"},"\ub9c8\ud0a4\ub098\ub77d\uc2a4\uc5d0\uc11c CTO\ub85c \uc77c\ud558\uace0 \uc788\uc2b5\ub2c8\ub2e4. \ub9c8\ud0a4\ub098\ub77d\uc2a4\ub294 \uba38\uc2e0\ub7ec\ub2dd \uae30\ubc18\uc758 \uc0b0\uc5c5\uc6a9 AI \uc194\ub8e8\uc158\uc744 \uac1c\ubc1c\ud558\ub294 \uc2a4\ud0c0\ud2b8\uc5c5\uc785\ub2c8\ub2e4. \uc0b0\uc5c5 \ud604\uc7a5\uc758 \ubb38\uc81c \ud574\uacb0\uc744 \ud1b5\ud574 \uc0ac\ub78c\uc774 \ubcf8\uc5f0\uc758 \uc77c\uc5d0 \uc9d1\uc911\ud560 \uc218 \uc788\uac8c \ub9cc\ub4dc\ub294 \uac83, \uadf8\uac83\uc774 \uc6b0\ub9ac\uac00 \ud558\ub294 \uc77c\uc785\ub2c8\ub2e4.")),o.createElement(c,{name:"Seunghyun Ko",githubUrl:"https://github.com/kosehy",linkedinUrl:"https://www.linkedin.com/in/seunghyunko/"},o.createElement(i.Z,{id:"team.profile.Seunghyun Ko.body"},"3i\uc5d0\uc11c MLOps Engineer\ub85c \uc77c\ud558\uace0 \uc788\uc2b5\ub2c8\ub2e4. kubeflow\uc5d0 \uad00\uc2ec\uc774 \ub9ce\uc2b5\ub2c8\ub2e4.")),o.createElement(c,{name:"SeungTae Kim",githubUrl:"https://github.com/RyanKor",linkedinUrl:"https://www.linkedin.com/in/seung-tae-kim-3bb15715b/"},o.createElement(i.Z,{id:"team.profile.SeungTae Kim.body"},"Genesis Lab\uc774\ub77c\ub294 \uc2a4\ud0c0\ud2b8\uc5c5\uc5d0\uc11c Applied AI Engineer \uc778\ud134 \uc5c5\ubb34\ub97c \uc218\ud589\ud558\uace0 \uc788\uc2b5\ub2c8\ub2e4. \uba38\uc2e0\ub7ec\ub2dd \uc0dd\ud0dc\uacc4\uac00 \uc6b0\ub9ac \uc0b0\uc5c5 \uc804\ubc18\uc5d0 \ud070 \ubcc0\ud654\uc744 \uac00\uc838\uc62c \uac83\uc774\ub77c \ubbff\uc73c\uba70, \ud55c \uac78\uc74c\uc529 \ub098\uc544\uac00\uace0 \uc788\uc2b5\ub2c8\ub2e4.")),o.createElement(c,{name:"Youngdon Tae",githubUrl:"https://github.com/taepd",linkedinUrl:"https://www.linkedin.com/in/taepd/"},o.createElement(i.Z,{id:"team.profile.Youngdon Tae.body"},"\ubc31\ud328\ucee4\uc5d0\uc11c ML \uc5d4\uc9c0\ub2c8\uc5b4\ub85c \uc77c\ud558\uace0 \uc788\uc2b5\ub2c8\ub2e4. \uc790\uc5f0\uc5b4\ucc98\ub9ac, \ucd94\ucc9c\uc2dc\uc2a4\ud15c, MLOps\uc5d0 \uad00\uc2ec\uc774 \ub9ce\uc2b5\ub2c8\ub2e4.")))}const u={sidebar_position:3},d="Contributors",p={unversionedId:"contributors",id:"contributors",title:"Contributors",description:"Main Authors",source:"@site/community/contributors.md",sourceDirName:".",slug:"/contributors",permalink:"/community/contributors",draft:!1,editUrl:"https://github.com/mlops-for-all/mlops-for-all.github.io/tree/main/community/contributors.md",tags:[],version:"current",lastUpdatedBy:"Aiden-Jeon",lastUpdatedAt:1689038498,formattedLastUpdatedAt:"2023\ub144 7\uc6d4 11\uc77c",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"tutorialSidebar",previous:{title:"How to Contribute",permalink:"/community/how-to-contribute"}},b={},h=[{value:"Main Authors",id:"main-authors",level:2},{value:"Contributors",id:"contributors-1",level:2}],g={toc:h},f="wrapper";function y(e){let{components:t,...n}=e;return(0,a.kt)(f,(0,r.Z)({},g,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"contributors"},"Contributors"),(0,a.kt)("h2",{id:"main-authors"},"Main Authors"),(0,a.kt)(s,{mdxType:"MainAuthorRow"}),(0,a.kt)("h2",{id:"contributors-1"},"Contributors"),(0,a.kt)("p",null,"Thank you for contributing our tutorials!"),(0,a.kt)(m,{mdxType:"ContributorsRow"}))}y.isMDXComponent=!0}}]);