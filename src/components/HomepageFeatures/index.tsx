import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: <a href="https://makinarocks.ai/">MakinaRocks</a>,
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        <p>
          Sponsored by MakinaRocks
        </p>
        
        이 프로젝트는 MakinaRocks의 지원을 받아 제작되었습니다.
      </>
    ),
  },
  {
    title: <a href="https://mlops-for-mle.github.io/tutorial">MLOps for MLE</a>,
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        <p>
          ML Engineer를 위한 MLOps Release!
        </p>
        
        구글에서 제안한 MLOps 0단계를 직접 구현하며 MLOps 가 무엇인지 공부할 수 있는 튜토리얼을 오픈했습니다!
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--6')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
