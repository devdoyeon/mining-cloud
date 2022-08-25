import { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import Loading from './Common/Loading';
import DataUploadComp from './Common/DataUploadComp';
import Header from './Common/Header';
import SideBar from './Common/SideBar';
import {
  fileSetting,
  startFn,
  errorHandler,
  csv2table,
  makeFileName,
  previewThead,
  previewTbody,
} from 'js/common';
import { preprocessAPI } from 'js/miningAPI';

const DataPreprocessing = () => {
  const [fileInfo, setFileInfo] = useState({
    file: '',
    name: '',
  });
  const [table, setTable] = useState({
    tBody: [],
    tHead: [],
  });
  const [blob, setBlob] = useState({})
  const [msg, setMsg] = useState('');
  const [tab, setTab] = useState('');

  const fileSettingState = { setFileInfo, setTab, setMsg };
  const startParamState = { msg, setMsg, setTab, fileInfo };

  useEffect(() => {
    document.title = '데이터 전처리 | MINING CLOUD';
  });

  const preprocessing = async e => {
    if (startFn(e, startParamState)) {
      let param;
      switch (e.textContent) {
        case '제거/삭제':
          param = 'delna';
          break;
        case '채우기/보간':
          param = 'fillna';
          break;
        default:
          return null;
      }
      const result = await preprocessAPI(fileInfo.file, param);
      if (typeof result === 'object') {
        const blob = new Blob([result.data], {
          type: 'text/csv',
        });
        setBlob(blob)
        setMsg('download');
        csv2table(result.data, setTable);
      } else return errorHandler(result, fileSettingState);
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
            {msg === 'download' && (
              <div className='wrap'>
                <h2 className='previewTitle'>Preview</h2>
                <div className='previewTable'>
                  <table>
                    <thead>
                      <tr>
                        {previewThead(table)}
                      </tr>
                    </thead>
                    <tbody>{previewTbody(table)}</tbody>
                  </table>
                </div>
                <div className='downloadBtnWrap'>
                  <button onClick={() => saveAs(blob, makeFileName(fileInfo, tab))}>
                    다운로드
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <Loading msg={msg} />
      </div>
    </section>
  );
};

export default DataPreprocessing;
