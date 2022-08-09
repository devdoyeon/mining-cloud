import { useState } from 'react';

import { fileSetting } from 'js/common';

import Loading from 'Components/Loading';
import Header from './Common/Header';
import SideBar from './Common/SideBar';
import DataUploadComp from './Common/DataUploadComp';

const FeatureMap = () => {
  const [uploadFile, setUploadFile] = useState('');
  const [uploadFileName, setUploadFileName] = useState('');
  const [msg, setMsg] = useState('');
  const [tab, setTab] = useState('');

  const fileSettingState = { setUploadFile, setUploadFileName, setTab, setMsg };

  //이미지 피처맵 api 요청
  const featureMap = async e => {};

  return (
    <section className='content-container'>
      <SideBar />
      <div>
        <Header />
        <div className='content-wrap'>
          <h3 className='bold'>AI 학습용 데이터셋 생성</h3>
          <hr />
          <div>
            <label htmlFor='fileUpload'>파일 업로드</label>
            <input
              type='file'
              id='fileUpload'
              onChange={e =>
                fileSetting(e, fileSettingState)
              }
              accept='.csv'
            />
            <button onClick={e => featureMap(e.target)}>
              Balancing & Partitioning
            </button>
            <br />
            <DataUploadComp uploadFileName={uploadFileName} />
          </div>
        </div>
        <Loading msg={msg} />
      </div>
    </section>
  );
};

export default FeatureMap;
