import { useState } from 'react';
import { fileSetting } from 'js/common';
import Loading from 'Components/Loading';
import Header from './Common/Header';
import SideBar from './Common/SideBar';
import DataUploadComp from './Common/DataUploadComp';

const DataAnalysis = () => {
  const [uploadFile, setUploadFile] = useState('');
  const [uploadFileName, setUploadFileName] = useState('');
  const [msg, setMsg] = useState('');
  const [tab, setTab] = useState('');

  const fileSettingState = { setUploadFile, setUploadFileName, setTab, setMsg };

  const analysis = async e => {};

  return (
    <section className='content-container'>
      <SideBar />
      <div>
        <Header />
        <div className='content-wrap'>
          <h3 className='bold'>변수 분석 및 선택</h3>
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
              onClick={e => analysis(e.target)}
              className={tab === '상관분석' ? 'active' : ''}>
              상관분석
            </button>
            <button
              onClick={e => analysis(e.target)}
              className={tab === '교차분석' ? 'active' : ''}>
              교차분석
            </button>
            <button
              onClick={e => analysis(e.target)}
              className={tab === 'CART분석' ? 'active' : ''}>
              CART분석
            </button>
            <br />
            <DataUploadComp uploadFileName={uploadFileName} />
          </div>
        {/* {msg === 'download'} */}
        </div>
        <Loading msg={msg} />
      </div>
    </section>
  );
};

export default DataAnalysis;
