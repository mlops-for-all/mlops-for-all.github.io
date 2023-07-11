"use strict";(self.webpackChunkv_2=self.webpackChunkv_2||[]).push([[2515],{3905:(t,e,a)=>{a.d(e,{Zo:()=>m,kt:()=>g});var n=a(7294);function r(t,e,a){return e in t?Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[e]=a,t}function l(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,n)}return a}function o(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?l(Object(a),!0).forEach((function(e){r(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}function p(t,e){if(null==t)return{};var a,n,r=function(t,e){if(null==t)return{};var a,n,r={},l=Object.keys(t);for(n=0;n<l.length;n++)a=l[n],e.indexOf(a)>=0||(r[a]=t[a]);return r}(t,e);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(t);for(n=0;n<l.length;n++)a=l[n],e.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(t,a)&&(r[a]=t[a])}return r}var i=n.createContext({}),s=function(t){var e=n.useContext(i),a=e;return t&&(a="function"==typeof t?t(e):o(o({},e),t)),a},m=function(t){var e=s(t.components);return n.createElement(i.Provider,{value:e},t.children)},d="mdxType",u={inlineCode:"code",wrapper:function(t){var e=t.children;return n.createElement(n.Fragment,{},e)}},c=n.forwardRef((function(t,e){var a=t.components,r=t.mdxType,l=t.originalType,i=t.parentName,m=p(t,["components","mdxType","originalType","parentName"]),d=s(a),c=r,g=d["".concat(i,".").concat(c)]||d[c]||u[c]||l;return a?n.createElement(g,o(o({ref:e},m),{},{components:a})):n.createElement(g,o({ref:e},m))}));function g(t,e){var a=arguments,r=e&&e.mdxType;if("string"==typeof t||r){var l=a.length,o=new Array(l);o[0]=c;var p={};for(var i in e)hasOwnProperty.call(e,i)&&(p[i]=e[i]);p.originalType=t,p[d]="string"==typeof t?t:r,o[1]=p;for(var s=2;s<l;s++)o[s]=a[s];return n.createElement.apply(null,o)}return n.createElement.apply(null,a)}c.displayName="MDXCreateElement"},781:(t,e,a)=>{a.r(e),a.d(e,{assets:()=>i,contentTitle:()=>o,default:()=>u,frontMatter:()=>l,metadata:()=>p,toc:()=>s});var n=a(7462),r=(a(7294),a(3905));const l={title:"Further Readings",date:new Date("2021-12-21T00:00:00.000Z"),lastmod:new Date("2021-12-21T00:00:00.000Z")},o=void 0,p={unversionedId:"further-readings/info",id:"version-1.0/further-readings/info",title:"Further Readings",description:"MLOps Component",source:"@site/i18n/en/docusaurus-plugin-content-docs/version-1.0/further-readings/info.md",sourceDirName:"further-readings",slug:"/further-readings/info",permalink:"/en/docs/1.0/further-readings/info",draft:!1,editUrl:"https://github.com/mlops-for-all/mlops-for-all.github.io/tree/main/versioned_docs/version-1.0/further-readings/info.md",tags:[],version:"1.0",lastUpdatedBy:"Aiden-Jeon",lastUpdatedAt:1689038498,formattedLastUpdatedAt:"Jul 11, 2023",frontMatter:{title:"Further Readings",date:"2021-12-21T00:00:00.000Z",lastmod:"2021-12-21T00:00:00.000Z"},sidebar:"tutorialSidebar",previous:{title:"2. Install load balancer metallb for Bare Metal Cluster",permalink:"/en/docs/1.0/appendix/metallb"}},i={},s=[{value:"MLOps Component",id:"mlops-component",level:2}],m={toc:s},d="wrapper";function u(t){let{components:e,...l}=t;return(0,r.kt)(d,(0,n.Z)({},m,l,{components:e,mdxType:"MDXLayout"}),(0,r.kt)("h2",{id:"mlops-component"},"MLOps Component"),(0,r.kt)("p",null,"From the components covered in ",(0,r.kt)("a",{parentName:"p",href:"/en/docs/1.0/introduction/component"},"MLOps Concepts"),", the following diagram illustrates them. "),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"open-stacks-0.png",src:a(818).Z,width:"1600",height:"588"})),(0,r.kt)("p",null,"The technology stacks covered in ",(0,r.kt)("em",{parentName:"p"},"Everyone's MLOps")," are as follows."),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"open-stacks-1.png",src:a(636).Z,width:"1600",height:"594"})),(0,r.kt)("p",null,"| | Storage | ",(0,r.kt)("a",{parentName:"p",href:"https://min.io/"},"Minio"),"                            |\n| | Data Processing | ",(0,r.kt)("a",{parentName:"p",href:"https://spark.apache.org/"},"Apache Spark"),"                             |\n| | Data Visualization | ",(0,r.kt)("a",{parentName:"p",href:"https://www.tableau.com/"},"Tableau"),"                               |\n| Workflow Mgmt.             | Orchestration               | ",(0,r.kt)("a",{parentName:"p",href:"https://airflow.apache.org/"},"Airflow"),"                              |\n| | Scheduling               | ",(0,r.kt)("a",{parentName:"p",href:"https://kubernetes.io/"},"Kubernetes"),"                            |\n| Security & Compliance      | Authentication & Authorization | ",(0,r.kt)("a",{parentName:"p",href:"https://www.openldap.org/"},"Ldap"),"                               |\n| | Data Encryption & Tokenization | ",(0,r.kt)("a",{parentName:"p",href:"https://www.vaultproject.io/"},"Vault"),"                         |\n| | Governance & Auditing | ",(0,r.kt)("a",{parentName:"p",href:"https://www.openpolicyagent.org/"},"Open Policy Agent"),"              |"),(0,r.kt)("p",null,"As you can see, there are still many MLOps components that we have not covered yet. We could not cover them all this time due to time constraints, but if you need it, it might be a good idea to refer to the following open source projects first."),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"open-stacks-2.png",src:a(3750).Z,width:"1616",height:"588"})),(0,r.kt)("p",null,"For details:"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Mgmt."),(0,r.kt)("th",{parentName:"tr",align:null},"Component"),(0,r.kt)("th",{parentName:"tr",align:null},"Open Soruce"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"Data Mgmt."),(0,r.kt)("td",{parentName:"tr",align:null},"Collection"),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("a",{parentName:"td",href:"https://kafka.apache.org/"},"Kafka"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null}),(0,r.kt)("td",{parentName:"tr",align:null},"Validation"),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("a",{parentName:"td",href:"https://beam.apache.org/"},"Beam"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null}),(0,r.kt)("td",{parentName:"tr",align:null},"Feature Store"),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("a",{parentName:"td",href:"https://flink.apache.org/"},"Flink"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"ML Model Dev. & Experiment"),(0,r.kt)("td",{parentName:"tr",align:null},"Modeling"),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("a",{parentName:"td",href:"https://jupyter.org/"},"Jupyter"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null}),(0,r.kt)("td",{parentName:"tr",align:null},"Analysis & Experiment Mgmt."),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("a",{parentName:"td",href:"https://mlflow.org/"},"MLflow"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null}),(0,r.kt)("td",{parentName:"tr",align:null},"HPO Tuning & AutoML"),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("a",{parentName:"td",href:"https://github.com/kubeflow/katib"},"Katib"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"Deploy Mgmt."),(0,r.kt)("td",{parentName:"tr",align:null},"Serving Framework"),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("a",{parentName:"td",href:"https://docs.seldon.io/projects/seldon-core/en/latest/index.html"},"Seldon Core"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null}),(0,r.kt)("td",{parentName:"tr",align:null},"A/B Test"),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("a",{parentName:"td",href:"https://iter8.tools/"},"Iter8"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null}),(0,r.kt)("td",{parentName:"tr",align:null},"Monitoring"),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("a",{parentName:"td",href:"https://grafana.com/oss/grafana/"},"Grafana"),", ",(0,r.kt)("a",{parentName:"td",href:"https://prometheus.io/"},"Prometheus"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"Process Mgmt."),(0,r.kt)("td",{parentName:"tr",align:null},"pipeline"),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("a",{parentName:"td",href:"https://www.kubeflow.org/"},"Kubeflow"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null}),(0,r.kt)("td",{parentName:"tr",align:null},"CI/CD"),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("a",{parentName:"td",href:"https://docs.github.com/en/actions"},"Github Action"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null}),(0,r.kt)("td",{parentName:"tr",align:null},"Continuous Training"),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("a",{parentName:"td",href:"https://argoproj.github.io/events/"},"Argo Events"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"Platform Mgmt."),(0,r.kt)("td",{parentName:"tr",align:null},"Configuration Mgmt."),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("a",{parentName:"td",href:"https://www.consul.io/"},"Consul"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null}),(0,r.kt)("td",{parentName:"tr",align:null},"Code Version Mgmt."),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("a",{parentName:"td",href:"https://github.com/"},"Github"),", ",(0,r.kt)("a",{parentName:"td",href:"https://min.io/"},"Minio"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null}),(0,r.kt)("td",{parentName:"tr",align:null},"Logging"),(0,r.kt)("td",{parentName:"tr",align:null},"(EFK) ",(0,r.kt)("a",{parentName:"td",href:"https://www.elastic.co/kr/elasticsearch/"},"Elastic Search"),", ",(0,r.kt)("a",{parentName:"td",href:"https://www.fluentd.org/"},"Fluentd"),", ",(0,r.kt)("a",{parentName:"td",href:"https://www.elastic.co/kr/kibana/"},"Kibana"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null}),(0,r.kt)("td",{parentName:"tr",align:null},"Resource Mgmt."),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("a",{parentName:"td",href:"https://kubernetes.io/"},"Kubernetes"))))))}u.isMDXComponent=!0},818:(t,e,a)=>{a.d(e,{Z:()=>n});const n=a.p+"assets/images/open-stacks-0-75a5736738cbd950e04122e6252dc2c1.png"},636:(t,e,a)=>{a.d(e,{Z:()=>n});const n=a.p+"assets/images/open-stacks-1-1ab94bd3c5f055c056a4ffc84f4f03f4.png"},3750:(t,e,a)=>{a.d(e,{Z:()=>n});const n=a.p+"assets/images/open-stacks-2-32f97815a2c7d02a32f080a996712ca6.png"}}]);