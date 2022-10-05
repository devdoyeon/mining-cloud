import { useState, useEffect } from 'react';
import streamSaver from 'streamsaver';
import saveAs from 'file-saver';
import Loading from './Common/Loading';
import DataUploadComp from './Common/DataUploadComp';
import Header from './Common/Header';
import SideBar from './Common/SideBar';
import {
  makeFileName,
  fileSetting,
  startFn,
  previewThead,
  previewTbody,
  errorHandler,
  zipParse,
} from 'js/common';
import { featureMapAPI } from 'js/miningAPI';

const FeatureMap = () => {
  const [fileInfo, setFileInfo] = useState({
    file: '',
    name: '',
  });
  const [table, setTable] = useState({
    tBody: [],
    tHead: [],
  });
  const [blob, setBlob] = useState({});
  const [msg, setMsg] = useState('');
  const [tab, setTab] = useState('');
  const [arr, setArr] = useState([]);

  const fileSettingState = { setFileInfo, setTab, setMsg };
  const startParamState = { msg, setMsg, setTab, fileInfo };
  const zipParseState = { setTable, setArr, setMsg };

  useEffect(() => {
    document.title = 'AI 학습용 데이터셋 생성 | MINING CLOUD';
  }, []);

  //! Main Function
  const featureMap = async e => {
    if (startFn(e, startParamState)) {
      const result = await featureMapAPI(
        fileInfo.file,
        e.textContent.toLowerCase()
      );
      if (typeof result === 'object') {
        if (e.textContent === 'Balancing')
          return zipParse(result.data, zipParseState);
        else if (e.textContent === 'Partitioning') {
          const blob = new Blob([result.data], {
            type: 'application/zip',
          });
          setBlob(blob);
          setMsg('download');
        }
      } else return errorHandler(result, fileSettingState);
    } else return;
  };

  return (
    <section className='content-container'>
      <SideBar />
      <div>
        <Header />
        <div className='content-wrap'>
          <h3 className='bold'>AI 학습용 데이터셋 생성</h3>
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
              onClick={e => featureMap(e.target)}
              className={tab === 'Balancing' ? 'active' : ''}>
              Balancing
            </button>
            <button
              onClick={e => featureMap(e.target)}
              className={tab === 'Partitioning' ? 'active' : ''}>
              Partitioning
            </button>
            <br />
            <DataUploadComp fileName={fileInfo.name} />
            {msg === 'download' && (
              <div className='wrap'>
                {tab === 'Balancing' && (
                  <>
                    <h2 className='previewTitle'>Preview</h2>
                    <div className='previewTable'>
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
                  </>
                )}
                {tab === 'Partitioning' && (
                  <div className='downloadBtnWrap'>
                    <button
                      onClick={() => saveAs(blob, makeFileName(fileInfo, tab))}>
                      ZIP 다운로드
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <Loading msg={msg} />
      </div>
    </section>
  );
};

export default FeatureMap;
