import { useState, useEffect } from 'react';
import {
  fileSetting,
  startFn,
  download,
  csv2table,
  previewThead,
  previewTbody,
  errorHandler,
} from 'js/common';
import Loading from 'Components/Common/Loading';
import Header from './Common/Header';
import SideBar from './Common/SideBar';
import DataUploadComp from './Common/DataUploadComp';
import { normalizationAPI } from 'js/miningAPI';

const DataNormalization = () => {
  const [fileInfo, setFileInfo] = useState({
    file: '',
    name: '',
    ext: 'csv',
  });
  const [table, setTable] = useState({
    tBody: [],
    tHead: [],
  });
  const [msg, setMsg] = useState('');
  const [tab, setTab] = useState('');
  const [url, setUrl] = useState('');

  const fileSettingState = { setFileInfo, setTab, setMsg };
  const startParamState = { msg, setMsg, setTab, fileInfo };
  const downloadState = { fileInfo, url, tab };

  useEffect(() => {
    document.title = '데이터 정규화 | MINING CLOUD';
  }, []);

  //! Main Function
  const normalization = async e => {
    if (startFn(e, startParamState)) {
      const result = await normalizationAPI(
        fileInfo.file,
        e.textContent.replaceAll('-', '').toLowerCase()
      );
      if (typeof result === 'object') {
        if (result.data === null)
          return alert('업로드한 파일을 확인해 주세요.');
        const blob = new Blob([result.data], {
          type: 'text/csv',
        }); // 변환한 문자열을 csv 파일화
        setUrl(window.URL.createObjectURL(blob)); // 위에서 만들어진 csv 파일을 다운로드 받을 수 있는 url 생성
        setMsg('download'); // 다운로드 버튼 표시
        csv2table(result, setTable);
      } else return errorHandler(result, fileSettingState);
    } else return;
  };

  return (
    <section className='content-container'>
      <SideBar />
      <div>
        <Header />
        <div className='content-wrap'>
          <h3 className='bold' onClick={() => previewThead()}>
            데이터 정규화
          </h3>
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
              onClick={e => normalization(e.target)}
              className={tab === 'Z-Score' ? 'active' : ''}>
              Z-Score
            </button>
            <button
              onClick={e => normalization(e.target)}
              className={tab === 'Min-Max' ? 'active' : ''}>
              Min-Max
            </button>
            <button
              onClick={e => normalization(e.target)}
              className={tab === 'Quartile' ? 'active' : ''}>
              Quartile
            </button>
            <button
              onClick={e => normalization(e.target)}
              className={tab === 'Standard Scaler' ? 'active' : ''}>
              Standard Scaler
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
                        <th>1</th>
                        {previewThead(table)}
                      </tr>
                    </thead>
                    <tbody>{previewTbody(table)}</tbody>
                  </table>
                </div>
                <div className='downloadBtnWrap'>
                  <button onClick={() => download(downloadState)}>
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

export default DataNormalization;
