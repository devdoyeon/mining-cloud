import { useState, useEffect } from 'react';
import { fileSetting, startFn } from 'js/common';
import { featureMapAPI } from 'js/solutionApi';
import { errorList } from 'js/array';
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
  const startParamSet = { msg, setMsg, setTab, uploadFile };

  useEffect(() => {
    document.title = 'AI 학습용 데이터셋 생성 | MINING CLOUD';
  }, []);

  //피처맵 api 요청
  const featureMap = async e => {
    if (startFn(e, startParamSet)) {
      const result = await featureMapAPI(
        uploadFile,
        e.textContent.toLowerCase()
      );
      if (typeof result === 'object') {
        // 여기부터 작성
      } else return alert(errorList[result]);
    } else return;
  };

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
              onChange={e => fileSetting(e, fileSettingState)}
              accept='.csv'
            />
            <button
              onClick={e => featureMap(e.target)}
              className={tab === 'Balancing' ? 'active' : ''}>
              Balancing
            </button>
            <button
              onClick={e => featureMap(e.target)}
              className={tab === 'Partitioning' ? 'active' : ''}>
              Partitioning
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
