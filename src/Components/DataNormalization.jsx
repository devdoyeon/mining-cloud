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
import JSZip from 'jszip';
import Loading from 'Components/Common/Loading';
import Header from './Common/Header';
import SideBar from './Common/SideBar';
import DataUploadComp from './Common/DataUploadComp';
import { normalizationAPI } from 'js/miningAPI';

const DataNormalization = () => {
  const [fileInfo, setFileInfo] = useState({
    file: '',
    name: '',
    ext: '',
  });
  const [table, setTable] = useState({
    tBody: [],
    tHead: [],
  });
  const [msg, setMsg] = useState('');
  const [tab, setTab] = useState('');
  const [url, setUrl] = useState('');

  const fileSettingState = { setFileInfo, tab, setTab, setMsg };
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
        if (e.textContent === 'Z-Score') {
          const blob = new Blob([result.data], {
            type: 'application/octet-stream',
          });
          setUrl(window.URL.createObjectURL(blob));
          setMsg('download');
          setFileInfo(prev => {
            const clone = {...prev};
            clone.ext = 'zip';
            return clone;
          })
        } else
          JSZip.loadAsync(result.data).then(zip => {
            const files = Object.values(zip.files);
            files.forEach(file => {
              zip.files[file.name].async('text').then(txt => {
                const blob = new Blob([txt], {
                  type: 'text/csv',
                });
                setUrl(window.URL.createObjectURL(blob));
                csv2table(txt, setTable);
                setMsg('download'); // 다운로드 버튼 표시
                setFileInfo(prev => {
                  const clone = {...prev};
                  clone.ext = 'csv';
                  return clone;
                })
              });
            });
          });
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
            {msg === 'download' && tab === 'Z-Score' && (
              <div className='wrap'>
                <div className='downloadBtnWrap'>
                  <button onClick={() => download(downloadState)}>
                    다운로드
                  </button>
                </div>
              </div>
            )}
            {msg === 'download' &&
              (tab === 'Min-Max' ||
                tab === 'Quartile' ||
                tab === 'Standard Scaler') && (
                <div className='wrap'>
                  <h2 className='previewTitle'>Preview</h2>
                  <div className='previewTable normalization'>
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
