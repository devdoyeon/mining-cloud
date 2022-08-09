import { useState, useEffect } from 'react';
import { fileSetting } from 'js/common';

import Loading from 'Components/Loading';
import Header from './Common/Header';
import SideBar from './Common/SideBar';
import DataUploadComp from './Common/DataUploadComp';
import $ from 'jquery';
import { normalizationAPI } from 'js/solutionApi';
import { errorList } from 'js/array';

const DataNormalization = () => {
  const [uploadFile, setUploadFile] = useState('');
  const [uploadFileName, setUploadFileName] = useState('');
  const [msg, setMsg] = useState('');
  const [tab, setTab] = useState('');
  const [url, setUrl] = useState('');
  const [tBody, setTbody] = useState([]);
  const [thead, setThead] = useState([]);
  let prevent = false;

  const fileSettingState = { setUploadFile, setUploadFileName, setTab, setMsg };

  useEffect(() => {
    document.title = '데이터 정규화 | MINING CLOUD';
  }, []);

  //@ api 통신
  const normalization = async e => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);
    if (uploadFile === '') {
      alert('데이터를 업로드해 주세요.');
      setTab('');
      return;
    }
    $('.content-wrap > div button').removeClass('active');
    $(e).addClass('active');
    setTab(e.textContent); // tab setting
    setMsg('loading'); // loading spinner
    // 클릭한 button의 textContent를 가져와 각각 다른 api 통신을 보낼 수 있게 함
    const result = await normalizationAPI(
      uploadFile,
      e.textContent.replaceAll('-', '').toLowerCase()
    );
    if (typeof result === 'object') {
      setMsg('download'); // 다운로드 버튼 표시
      const blob = new Blob([result.data], { type: 'text/csv;charset=utf-8' }); // 변환한 문자열을 csv 파일화
      setUrl(window.URL.createObjectURL(blob)); // 위에서 만들어진 csv 파일을 다운로드 받을 수 있는 url 생성
      //& preview table 렌더하기 위한 데이터셋 작업
      const arr = result.data.split('\n'); // 줄바꿈 기호 기준 배열 생성
      const previewArr = [];
      for (let str of arr) {
        previewArr.push(str.split(',')); // 배열 속 문자열 배열로 변환
      }
      previewArr.pop(); // 마지막 인덱스는 빈 문자열로 나오므로 제거
      if (previewArr.length <= 10) {
        setThead(previewArr[0]);
        const bodyArr = previewArr.slice(1);
        bodyArr.forEach(arr => {
          const idx = previewArr.indexOf(arr) + 1;
          arr.unshift(idx);
        });
        setTbody(previewArr.slice(1));
      } else {
        const length = previewArr[0].length + 1; // 중간에 끊기 위해 길이 구한 뒤
        const middle = new Array(length).fill('...'); // 길이만큼 ...으로 채워주고
        const first = []; // 미리보기로 보여줄 데이터
        previewArr.slice(1, 5).forEach(arr => {
          const numArr = [];
          arr.forEach(str => {
            numArr.push(Number(str).toFixed(6));
          });
          const idx = previewArr.indexOf(arr) + 1;
          numArr.unshift(idx); // column number
          first.push(numArr);
        });
        const last = []; // 마지막 쪽 미리보기
        previewArr.slice(-4).forEach(arr => {
          const numArr = [];
          arr.forEach(str => {
            numArr.push(Number(str).toFixed(6));
          });
          const idx = previewArr.indexOf(arr) + 1;
          numArr.unshift(idx); // column number
          last.push(numArr);
        });
        setTbody([...first, middle, ...last]); //tbody
        setThead(previewArr[0]); //thead
      }
    } else return alert(errorList[result]);
  };

  //@ Render Preview Table Head
  const previewThead = () => {
    return thead.reduce((acc, item) => {
      return (
        <>
          {acc}
          <th>{item}</th>
        </>
      );
    }, <></>);
  };

  //@ Render Preview Table Body
  const previewTbody = () => {
    const length = thead.length + 1;
    const numArr = [];
    for (let i = 0; i < length; i++) {
      numArr.push(i);
    }
    return tBody.reduce((acc, item, idx) => {
      const data = numArr.reduce((acc, num) => {
        return (
          <>
            {acc}
            <td>{item[num]}</td>
          </>
        );
      }, <></>);
      return (
        <>
          {acc}
          <tr className={idx % 2 === 0 ? 'gray' : ''}>{data}</tr>
        </>
      );
    }, <></>);
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
            <br />
            <DataUploadComp uploadFileName={uploadFileName} />
            {msg === 'download' && (
              <>
                <h2 className='previewTitle'>Preview</h2>
                <div className='previewTable'>
                  <table>
                    <thead>
                      <tr>
                        <th>1</th>
                        {previewThead()}
                      </tr>
                    </thead>
                    <tbody>{previewTbody()}</tbody>
                  </table>
                </div>
                <div className='downloadBtnWrap'>
                  <button onClick={() => download()}>다운로드</button>
                </div>
              </>
            )}
          </div>
        </div>
        <Loading msg={msg} />
      </div>
    </section>
  );
};

export default DataNormalization;
