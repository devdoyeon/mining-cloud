import { useState, useEffect } from 'react';
import streamSaver from 'streamsaver';
import Loading from 'Components/Common/Loading';
import DataUploadComp from 'Components/Common/DataUploadComp';
import Header from 'Components/Common/Header';
import SideBar from 'Components/Common/SideBar';
import {
  makeFileName,
  fileSetting,
  startFn,
  previewThead,
  previewTbody,
  errorHandler,
  zipParse,
} from 'js/common';
import { normalizationAPI } from 'js/miningAPI';

const DataNormalization = () => {
  const [fileInfo, setFileInfo] = useState({
    file: '',
    name: '',
  });
  const [table, setTable] = useState({
    tBody: [],
    tHead: [],
  });
  const [msg, setMsg] = useState('');
  const [tab, setTab] = useState('');
  const [arr, setArr] = useState([]);

  const fileSettingState = { setFileInfo, setTab, setMsg };
  const startParamState = { msg, setMsg, setTab, fileInfo };
  const zipParseState = { setTable, setArr, setMsg };

  useEffect(() => {
    document.title = '데이터 정규화 | MINING CLOUD';
  }, []);

  //! Main Function
  const normalization = async e => {
    if (startFn(e, startParamState)) {
      const result = await normalizationAPI(
        fileInfo.file,
        e.textContent.replaceAll('-', '').toLowerCase() // API Parameter 양식에 맞춰 textContent 가공
      );
      if (typeof result === 'object') return zipParse(result.data, zipParseState);
      else return errorHandler(result, fileSettingState);
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
                <div className='previewTable normalization'>
                  <table>
                    <thead>
                      <tr>{previewThead(table)}</tr>
                    </thead>
                    <tbody>{previewTbody(table)}</tbody>
                  </table>
                </div>
                <div className='downloadBtnWrap'>
                  <button
                    onClick={() => {
                      const blob = new Blob([arr], { type: 'text/csv' });
                      const fileStream = streamSaver.createWriteStream(
                        `${makeFileName(fileInfo, tab)}.csv`,
                        {
                          size: blob.size,
                        }
                      );
                      const readableStream = blob.stream();
                      if (window.WritableStream && readableStream.pipeTo)
                        return readableStream.pipeTo(fileStream);
                    }}>
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
