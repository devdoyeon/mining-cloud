import { useState } from 'react';
import { fileNamePreview } from 'js/common';
import Loading from 'Components/Loading';
import Header from './Common/Header';
import SideBar from './Common/SideBar';
import DataUploadComp from './Common/DataUploadComp';
import Correlation from './Function/Analysis/Correlation';

const DataAnalysis = () => {
  const [uploadFile, setUploadFile] = useState('');
  const [uploadFileName, setUploadFileName] = useState('');
  const [msg, setMsg] = useState('');
  const [tab, setTab] = useState('');

  const dataProcess = async e => {
    setTab(e.textContent);
  };

  const uploadFileData = { uploadFile, uploadFileName };

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
              onChange={e =>
                fileNamePreview(
                  e.target.files[0],
                  setUploadFile,
                  setUploadFileName
                )
              }
              accept='.csv'
            />
            <button
              onClick={e => dataProcess(e.target)}
              className={tab === '상관분석' ? 'active' : ''}>
              상관분석
            </button>
            <button
              onClick={e => dataProcess(e.target)}
              className={tab === '교차분석' ? 'active' : ''}>
              교차분석
            </button>
            <button
              onClick={e => dataProcess(e.target)}
              className={tab === 'CART분석' ? 'active' : ''}>
              CART분석
            </button>
            <br />
            <DataUploadComp {...uploadFileData} />
          </div>
          <div className='container'>
            {tab === '상관분석' && <Correlation />}
          </div>
        </div>
        <Loading msg={msg} />
      </div>
    </section>
  );
};

export default DataAnalysis;
