import { useState, useEffect } from 'react';
import { fileSetting, startFn, download } from 'js/common';
import Loading from 'Components/Common/Loading';
import Header from './Common/Header';
import SideBar from './Common/SideBar';
import DataUploadComp from './Common/DataUploadComp';

const DataAnalysis = () => {
  const [fileInfo, setFileInfo] = useState({
    file: '',
    name: '',
  });
  const [msg, setMsg] = useState('');
  const [tab, setTab] = useState('');
  const [url, setUrl] = useState('');

  const fileSettingState = { setFileInfo, setTab, setMsg };
  const startParamState = { msg, setMsg, setTab, fileInfo };
  const downloadState = { fileInfo, url, tab };

  useEffect(() => {
    document.title = '변수 분석 및 선택 | MINING CLOUD';
  }, []);

  const analysis = async e => {
    if (startFn(e, startParamState)) {
      let param;
      switch (e.textContent) {
        case '상관분석':
          param = 'correlation';
          break;
        case '교차분석':
          param = 'crosstab';
          break;
        case 'CART분석':
          param = 'cart';
          break;
        default:
          param = '';
      }
    } else return;
  };

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
            <DataUploadComp fileName={fileInfo.name} />
            {msg === 'download' && (
              <div className='downloadBtnWrap'>
                <button onClick={() => download(downloadState)}>
                  다운로드
                </button>
              </div>
            )}
          </div>
        </div>
        <Loading msg={msg} />
      </div>
    </section>
  );
};

export default DataAnalysis;
