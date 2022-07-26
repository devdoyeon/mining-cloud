import { useState } from 'react';
import { activeOn, fileNamePreview } from 'js/common';

import Loading from 'Components/Loading';
import Header from './Common/Header';
import SideBar from './Common/SideBar';
import DataUploadComp from './Common/DataUploadComp';
import { normalizationAPI } from 'js/solutionApi';

const DataNormalization = () => {
  const [uploadFile, setUploadFile] = useState('');
  const [uploadFileName, setUploadFileName] = useState('');
  const [msg, setMsg] = useState('');
  const [tab, setTab] = useState('');
  const [url, setUrl] = useState('');
  let prevent = false;

  //@ input이 onchange될 때 실행시켜 주는 함수
  const fileSetting = e => {
    fileNamePreview(e.target.files[0], setUploadFile, setUploadFileName);
    setTab('');
    setMsg('');
  };

  //@ api 통신
  const normalization = async e => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);
    activeOn(e, uploadFile, setMsg); //업로드 파일 체크
    setTab(e.textContent); // tab setting
    setMsg('loading'); // loading spinner
    // 클릭한 button의 textContent를 가져와 각각 다른 api 통신을 보낼 수 있게 함
    const result = await normalizationAPI(
      uploadFile,
      e.textContent.replaceAll('-', '').toLowerCase()
    );
    setMsg('download'); // 다운로드 버튼 표시
    // console.log(result);
    // console.log(result.data);
    const data = result.data.replaceAll('\\n', '\\r\\n'); // 문자열 데이터를 csv 양식으로 변환
    const blob = new Blob([data], { type: 'text/csv;charset=utf-8' }); // 변환한 문자열을 csv 파일화
    setUrl(window.URL.createObjectURL(blob)); // 위에서 만들어진 csv 파일을 다운로드 받을 수 있는 url 생성
  };

  //@ 다운로드 버튼 클릭 시 실행되는 함수
  const download = () => {
    const ext = uploadFileName.split('.').pop(); // 확장자
    const fileName = uploadFileName.split('.')[0]; // 파일 이름
    // 임시로 anchor을 만들어서 실행시켜 주고 없애줌
    const link = document.createElement('a');
    document.body.appendChild(link);
    link.href = url; // csv 다운로드 url
    link.download = `${fileName}(${tab}).${ext}`; // 파일 이름 수정
    link.click(); // 다운로드 실행
    document.body.removeChild(link);
  };

  return (
    <section className='content-container'>
      <SideBar />
      <div>
        <Header />
        <div className='content-wrap'>
          <h3 className='bold'>데이터 정규화</h3>
          <hr />
          <div>
            <label htmlFor='fileUpload'>파일 업로드</label>
            <input
              type='file'
              id='fileUpload'
              onChange={e => fileSetting(e)}
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
            <br />
            <DataUploadComp uploadFileName={uploadFileName} />
          </div>
          {msg === 'download' && (
            <button onClick={() => download()}>다운로드</button>
          )}
        </div>
        <Loading msg={msg} />
      </div>
    </section>
  );
};

export default DataNormalization;
