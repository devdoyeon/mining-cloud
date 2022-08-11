import { useState, useEffect } from 'react';
import { fileSetting, startFn } from 'js/common';
import Loading from 'Components/Loading';
import Header from './Common/Header';
import SideBar from './Common/SideBar';
import DataUploadComp from './Common/DataUploadComp';

const ModelTraining = () => {
  const [uploadFile, setUploadFile] = useState('');
  const [uploadFileName, setUploadFileName] = useState('');
  const [msg, setMsg] = useState('');
  const [tab, setTab] = useState('');

  useEffect(() => {
    document.title = '모델 학습 및 검증 | MINING CLOUD';
  }, []);

  const fileSettingState = { setUploadFile, setUploadFileName, setTab, setMsg };
  const startParamSet = { msg, setMsg, setTab, uploadFile };

  const training = async e => {
    if (startFn(e, startParamSet)) {
    } else return;
  };

  return (
    <section className='content-container'>
      <SideBar />
      <div>
        <Header />
        <div className='content-wrap'>
          <h3 className='bold'>모델 학습 및 검증</h3>
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
              onClick={e => training(e.target)}
              className={tab === 'LR' ? 'active' : 'lr'}>
              LR
            </button>
            <button
              onClick={e => training(e.target)}
              className={tab === 'DT' ? 'active' : 'dt'}>
              DT
            </button>
            <button
              onClick={e => training(e.target)}
              className={tab === 'SVM' ? 'active' : 'svm'}>
              SVM
            </button>
            <button
              onClick={e => training(e.target)}
              className={tab === 'DNN' ? 'active' : 'dnn'}>
              DNN
            </button>
            <button
              onClick={e => training(e.target)}
              className={tab === 'RF' ? 'active' : 'rf'}>
              RF
            </button>
            <button
              onClick={e => training(e.target)}
              className={tab === 'XGBoost' ? 'active' : 'xg'}>
              XGBoost
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

export default ModelTraining;
