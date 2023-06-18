/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import Translate from '@docusaurus/Translate';


type ProfileProps = {
  className?: string;
  name: string;
  children: ReactNode;
  githubUrl: string;
  linkedinUrl?: string;
};

function TeamProfileCard({
  className,
  name,
  children,
  githubUrl,
  linkedinUrl,
  role,
}: ProfileProps) {
  return (
    <div className={className}>
      <div className="card card--full-height">
        <div className="card__header">
          <div className="avatar avatar--vertical">
            <img
              className="avatar__photo avatar__photo--xl"
              src={`${githubUrl}.png`}
              alt={`${name}'s avatar`}
            />
            <div className="avatar__intro">
              <h3 className="avatar__name">{name}</h3>
            </div>
            <div className="avatar__role">
              <h5 className="avatar__role">{role}</h5>
            </div>
          </div>
        </div>
        <div className="card__body">{children}</div>
        <div className="card__footer">
          <div className="button-group button-group--block">
            {githubUrl && (
              <a className="button button--secondary" href={githubUrl}>
                GitHub
              </a>
            )}
            {linkedinUrl && (
              <a className="button button--secondary" href={linkedinUrl}>
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamProfileCardCol(props: ProfileProps) {
  return (
    <TeamProfileCard {...props} className="col col--6 margin-bottom--lg" />
  );
}

export function MainAuthorRow(): JSX.Element {
  return (
    <div className="row">
      <TeamProfileCardCol
        name="Jongseob Jeon"
        githubUrl="https://github.com/aiden-jeon"
        linkedinUrl="https://www.linkedin.com/in/jongseob-jeon/"
        role="Project Leader"
        >
        <Translate id="team.profile.Jongseob Jeon.body">
        
        
        마키나락스에서 머신러닝 엔지니어로 일하고 있습니다.

        모두의 딥러닝을 통해 많은 사람들이 딥러닝을 쉽게 접했듯이  
        모두의 MLOps를 통해 많은 사람들이 MLOps에 쉽게 접할수 있길 바랍니다.

        </Translate>
      </TeamProfileCardCol>
      <TeamProfileCardCol
        name="Jayeon Kim"
        githubUrl="https://github.com/anencore94"
        linkedinUrl="https://www.linkedin.com/in/anencore94"
        role="Project Member"
        >
        <Translate id="team.profile.Jaeyeon Kim.body">
        비효율적인 작업을 자동화하는 것에 관심이 많습니다.
        </Translate>
      </TeamProfileCardCol>
      <TeamProfileCardCol
        name="Youngchel Jang"
        githubUrl="https://github.com/zamonia500"
        linkedinUrl="https://www.linkedin.com/in/youngcheol-jang-b04a45187"
        role="Project Member"
        >
        <Translate id="team.profile.Youngchel Jang.body">
        마키나락스에서 MLOps Engineer로 일하고 있습니다.

        단순하게 생각하는 노력을 하고 있습니다.
        </Translate>
      </TeamProfileCardCol>
    </div>
  );
}

export function ContributorsRow(): JSX.Element {
  return (
    <div className="row">
      <TeamProfileCardCol
        name="Jongsun Shinn"
        githubUrl="https://github.com/jsshinn"
        linkedinUrl="https://www.linkedin.com/in/jongsun-shinn-311b00140/"
        >
        <Translate id="team.profile.Jongsun Shinn.body">
        마키나락스에서 ML Engineer로 일하고 있습니다.
        </Translate>
      </TeamProfileCardCol>
      <TeamProfileCardCol
        name="Sangwoo Shim"
        githubUrl="https://github.com/borishim"
        linkedinUrl="https://www.linkedin.com/in/sangwooshim/"
        >
        <Translate id="team.profile.Sangwoo Shim.body">
        마키나락스에서 CTO로 일하고 있습니다.
        마키나락스는 머신러닝 기반의 산업용 AI 솔루션을 개발하는 스타트업입니다.
        산업 현장의 문제 해결을 통해 사람이 본연의 일에 집중할 수 있게 만드는 것,
        그것이 우리가 하는 일입니다.
        </Translate>
      </TeamProfileCardCol>
      <TeamProfileCardCol
        name="Seunghyun Ko"
        githubUrl="https://github.com/kosehy"
        linkedinUrl="https://www.linkedin.com/in/seunghyunko/"
        >
        <Translate id="team.profile.Seunghyun Ko.body">
        3i에서 MLOps Engineer로 일하고 있습니다.

        kubeflow에 관심이 많습니다.
        </Translate>
      </TeamProfileCardCol>
      <TeamProfileCardCol
        name="SeungTae Kim"
        githubUrl="https://github.com/RyanKor"
        linkedinUrl="https://www.linkedin.com/in/seung-tae-kim-3bb15715b/"
        >
        <Translate id="team.profile.SeungTae Kim.body">
        Genesis Lab이라는 스타트업에서 Applied AI Engineer 인턴 업무를 수행하고 있습니다.

        머신러닝 생태계가 우리 산업 전반에 큰 변화을 가져올 것이라 믿으며, 한 걸음씩 나아가고 있습니다.
        </Translate>
      </TeamProfileCardCol>
      <TeamProfileCardCol
        name="Youngdon Tae"
        githubUrl="https://github.com/taepd"
        linkedinUrl="https://www.linkedin.com/in/taepd/"
        >
        <Translate id="team.profile.Youngdon Tae.body">
        백패커에서 ML 엔지니어로 일하고 있습니다.

        자연어처리, 추천시스템, MLOps에 관심이 많습니다.
        </Translate>
      </TeamProfileCardCol>
    </div>
  );
}
