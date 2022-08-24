import { useState, useEffect } from 'react';
import JSZip from 'jszip';
import Loading from 'Components/Common/Loading';
import DataUploadComp from './Common/DataUploadComp';
import Header from './Common/Header';
import SideBar from './Common/SideBar';
import {
  fileSetting,
  startFn,
  download,
  csv2table,
  previewThead,
  previewTbody,
  errorHandler,
} from 'js/common';
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

  const fileSettingState = { setFileInfo, setTab, setMsg };
  const startParamState = { msg, setMsg, setTab, fileInfo };
  const downloadState = { fileInfo, url, tab };

  useEffect(() => {
    document.title = '데이터 정규화 | MINING CLOUD';
  }, []);

  //! Main Function
  const normalization = async e => {
    if (startFn(e, startParamState)) {
      //& API
      const result = await normalizationAPI(
        fileInfo.file,
        e.textContent.replaceAll('-', '').toLowerCase() // API Parameter 양식에 맞춰 textContent 가공
      );
      if (typeof result === 'object') {
        /*
          = Z-Score, Standard-Scaler (RangeError로 인해 Zip 내 파일을 파싱하는 데에 문제가 있으므로
          = Preview Table, Parsing을 건너뛰고 Zip 파일만 다운로드)
        */
        if (
          e.textContent === 'Z-Score' ||
          e.textContent === 'Standard Scaler'
        ) {
          const blob = new Blob([result.data], {
            type: 'application/octet-stream',
          });
          setUrl(window.URL.createObjectURL(blob));
          setMsg('download');
          setFileInfo(prev => {
            const clone = { ...prev };
            clone.ext = 'zip'; // 확장자 정의
            return clone;
          });
        }
        //= Min-Max, Quartile (용량이 크지 않기 때문에 Unzip 후 Preview Table Render)
        else
          JSZip.loadAsync(result.data).then(zip => {
            // JSZip Library
            const files = Object.values(zip.files); // Zip 내의 파일들이 들어있는 배열 생성
            files.forEach(file => {
              zip.files[file.name].async('text').then(txt => {
                // 파일 안의 내용 Text로 Export
                const blob = new Blob([txt], {
                  type: 'text/csv',
                });
                setUrl(window.URL.createObjectURL(blob));
                csv2table(txt, setTable);
                setMsg('download'); // 다운로드 버튼 표시
                setFileInfo(prev => {
                  const clone = { ...prev };
                  clone.ext = 'csv'; // 확장자 정의
                  return clone;
                });
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
            {msg === 'download' &&
              (tab === 'Z-Score' || tab === 'Standard Scaler') && (
                <div className='wrap'>
                  <div className='downloadBtnWrap'>
                    <button onClick={() => download(downloadState)}>
                      다운로드
                    </button>
                  </div>
                </div>
              )}
            {msg === 'download' && (tab === 'Min-Max' || tab === 'Quartile') && (
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
