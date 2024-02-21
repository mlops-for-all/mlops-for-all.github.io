"use strict";(self.webpackChunkv_2=self.webpackChunkv_2||[]).push([[2349],{3905:(e,t,n)=>{n.d(t,{Zo:()=>d,kt:()=>f});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var p=r.createContext({}),s=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},d=function(e){var t=s(e.components);return r.createElement(p.Provider,{value:t},e.children)},c="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,p=e.parentName,d=i(e,["components","mdxType","originalType","parentName"]),c=s(n),m=o,f=c["".concat(p,".").concat(m)]||c[m]||u[m]||a;return n?r.createElement(f,l(l({ref:t},d),{},{components:n})):r.createElement(f,l({ref:t},d))}));function f(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,l=new Array(a);l[0]=m;var i={};for(var p in t)hasOwnProperty.call(t,p)&&(i[p]=t[p]);i.originalType=e,i[c]="string"==typeof e?e:o,l[1]=i;for(var s=2;s<a;s++)l[s]=n[s];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},5008:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>l,default:()=>u,frontMatter:()=>a,metadata:()=>i,toc:()=>s});var r=n(7462),o=(n(7294),n(3905));const a={title:"3. Seldon Monitoring",description:"Prometheus & Grafana \ud655\uc778\ud558\uae30",sidebar_position:3,date:new Date("2021-12-24T00:00:00.000Z"),lastmod:new Date("2021-12-24T00:00:00.000Z"),contributors:["Jongseob Jeon"]},l=void 0,i={unversionedId:"api-deployment/seldon-pg",id:"version-1.0/api-deployment/seldon-pg",title:"3. Seldon Monitoring",description:"Prometheus & Grafana \ud655\uc778\ud558\uae30",source:"@site/versioned_docs/version-1.0/api-deployment/seldon-pg.md",sourceDirName:"api-deployment",slug:"/api-deployment/seldon-pg",permalink:"/docs/1.0/api-deployment/seldon-pg",draft:!1,editUrl:"https://github.com/mlops-for-all/mlops-for-all.github.io/tree/main/versioned_docs/version-1.0/api-deployment/seldon-pg.md",tags:[],version:"1.0",lastUpdatedBy:"Tim cho",lastUpdatedAt:1708479021,formattedLastUpdatedAt:"2024\ub144 2\uc6d4 21\uc77c",sidebarPosition:3,frontMatter:{title:"3. Seldon Monitoring",description:"Prometheus & Grafana \ud655\uc778\ud558\uae30",sidebar_position:3,date:"2021-12-24T00:00:00.000Z",lastmod:"2021-12-24T00:00:00.000Z",contributors:["Jongseob Jeon"]},sidebar:"tutorialSidebar",previous:{title:"2. Deploy SeldonDeployment",permalink:"/docs/1.0/api-deployment/seldon-iris"},next:{title:"4. Seldon Fields",permalink:"/docs/1.0/api-deployment/seldon-fields"}},p={},s=[{value:"Grafana &amp; Prometheus",id:"grafana--prometheus",level:2},{value:"\ub300\uc2dc\ubcf4\ub4dc",id:"\ub300\uc2dc\ubcf4\ub4dc",level:3},{value:"API \uc694\uccad",id:"api-\uc694\uccad",level:3}],d={toc:s},c="wrapper";function u(e){let{components:t,...a}=e;return(0,o.kt)(c,(0,r.Z)({},d,a,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h2",{id:"grafana--prometheus"},"Grafana & Prometheus"),(0,o.kt)("p",null,"\uc774\uc81c, ",(0,o.kt)("a",{parentName:"p",href:"/docs/1.0/api-deployment/seldon-iris"},"\uc9c0\ub09c \ud398\uc774\uc9c0"),"\uc5d0\uc11c \uc0dd\uc131\ud588\ub358 SeldonDeployment \ub85c API Request \ub97c \ubc18\ubcf5\uc801\uc73c\ub85c \uc218\ud589\ud574\ubcf4\uace0, \ub300\uc2dc\ubcf4\ub4dc\uc5d0 \ubcc0\ud654\uac00 \uc77c\uc5b4\ub098\ub294\uc9c0 \ud655\uc778\ud574\ubd05\ub2c8\ub2e4."),(0,o.kt)("h3",{id:"\ub300\uc2dc\ubcf4\ub4dc"},"\ub300\uc2dc\ubcf4\ub4dc"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"/docs/1.0/setup-components/install-components-pg"},"\uc55e\uc11c \uc0dd\uc131\ud55c \ub300\uc2dc\ubcf4\ub4dc"),"\ub97c \ud3ec\ud2b8 \ud3ec\uc6cc\ub529\ud569\ub2c8\ub2e4."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"kubectl port-forward svc/seldon-core-analytics-grafana -n seldon-system 8090:80\n")),(0,o.kt)("h3",{id:"api-\uc694\uccad"},"API \uc694\uccad"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"/docs/1.0/api-deployment/seldon-iris#using-cli"},"\uc55e\uc11c \uc0dd\uc131\ud55c Seldon Deployment"),"\uc5d0 \uc694\uccad\uc744 ",(0,o.kt)("strong",{parentName:"p"},"\ubc18\ubcf5\ud574\uc11c")," \ubcf4\ub0c5\ub2c8\ub2e4."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"curl -X POST http://$NODE_IP:$NODE_PORT/seldon/seldon-deploy/sklearn/api/v1.0/predictions \\\n-H 'Content-Type: application/json' \\\n-d '{ \"data\": { \"ndarray\": [[1,2,3,4]] } }'\n")),(0,o.kt)("p",null,"\uadf8\ub9ac\uace0 \uadf8\ub77c\ud30c\ub098 \ub300\uc2dc\ubcf4\ub4dc\ub97c \ud655\uc778\ud558\uba74 \ub2e4\uc74c\uacfc \uac19\uc774 Global Request Rate \uc774 ",(0,o.kt)("inlineCode",{parentName:"p"},"0 ops")," \uc5d0\uc11c \uc21c\uac04\uc801\uc73c\ub85c \uc0c1\uc2b9\ud558\ub294 \uac83\uc744 \ud655\uc778\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4."),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"repeat-raise.png",src:n(147).Z,width:"5016",height:"2826"})),(0,o.kt)("p",null,"\uc774\ub807\uac8c \ud504\ub85c\uba54\ud14c\uc6b0\uc2a4\uc640 \uadf8\ub77c\ud30c\ub098\uac00 \uc815\uc0c1\uc801\uc73c\ub85c \uc124\uce58\ub41c \uac83\uc744 \ud655\uc778\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4."))}u.isMDXComponent=!0},147:(e,t,n)=>{n.d(t,{Z:()=>r});const r=n.p+"assets/images/repeat-raise-60a3d043d2ac70549160aa936b4bed46.png"}}]);