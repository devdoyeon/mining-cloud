import React, { useState, useEffect } from 'react';
import SideBar from './Common/SideBar';
import Header from './Common/Header';
import Loading from './Common/Loading';
import DataUploadComp from './Common/DataUploadComp';
import { fileSetting, startFn } from 'js/common';

const DataPreprocessing = () => {
  const [fileInfo, setFileInfo] = useState({
    file: '',
    name: '',
  });
  const [url, setUrl] = useState('');
  const [msg, setMsg] = useState('');
  const [tab, setTab] = useState('');

  const fileSettingState = { setFileInfo, setTab, setMsg };
  const startParamState = { msg, setMsg, setTab, fileInfo };
  const downloadState = { fileInfo, url, tab };

  useEffect(() => {
    document.title = '데이터 전처리 | MINING CLOUD';
  });

  const preprocessing = async e => {
    if (startFn(e, startParamState)) {
      
    } else return;
  };

  return (
    <section className='content-container'>
      <SideBar />
      <div>
        <Header />
        <div className='content-wrap'>
          <h3 className='bold'>데이터 전처리</h3>
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
              onClick={e => preprocessing(e.target)}
              className={tab === '제거/삭제' ? 'active' : ''}>
              제거/삭제
            </button>
            <button
              onClick={e => preprocessing(e.target)}
              className={tab === '채우기/보간' ? 'active' : ''}>
              채우기/보간
            </button>
            <br />
            <DataUploadComp fileName={fileInfo.name} />
            {msg === 'download' && <></>}
          </div>
        </div>
        <Loading msg={msg} />
      </div>
    </section>
  );
};

export default DataPreprocessing;
