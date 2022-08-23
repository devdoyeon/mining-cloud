import $ from 'jquery';
import html2canvas from 'html2canvas';
import { TableExport } from 'tableexport';

//! Error
//& Preparation
//@ File
//- Preview & Download

//! 에러 메시지 배열
const errorList = {
  server: '잠시 후 다시 시도해 주세요.',
  null: '업로드한 파일을 다시 확인해 주세요.',
};

//! 에러 발생 시 실행할 함수
export const errorHandler = (result, { setFileInfo, setTab, setMsg }) => {
  alert(errorList[result]);
  setMsg('');
  setTab('');
  setFileInfo(prev => {
    const clone = { ...prev };
    clone.file = '';
    clone.name = '';
    return clone;
  });
  return;
};

//& 함수 실행 전 상태 확인해 주는 함수
export const startFn = (e, { msg, setMsg, setTab, fileInfo }) => {
  if (msg === 'loading') {
    alert('다른 작업을 수행하는 중에는 버튼을 클릭할 수 없습니다.');
    return false;
  } else if (fileInfo.file === '') {
    setTab('');
    alert('데이터를 업로드해 주세요.');
    return false;
  } else {
    $('.content-wrap > div button').removeClass('active');
    $(e).addClass('active');
    setTab(e.textContent); // tab setting
    setMsg('loading'); // loading spinner
    return true;
  }
};

//@ file Input onChange 시 실행되는 함수
export const fileSetting = (e, { setFileInfo, setTab, setMsg }) => {
  const file = e.target.files[0];
  if (!file) return;
  if (e.target.files[1]) {
    let nameArr = [];
    let trainName = [
      'y_val.csv',
      'y_train.csv',
      'y_test.csv',
      'x_val.csv',
      'x_train.csv',
      'x_test.csv',
    ];
    let wrongNum = 0;
    const formData = new FormData();
    for (let i = 0; i < e.target.files.length; i++) {
      formData.append('files', e.target.files[i]);
      if (!trainName.includes(e.target.files[i].name)) {
        wrongNum += 1;
      }
      nameArr.push(e.target.files[i].name);
    }
    if (nameArr.length !== 6)
      return alert(
        `6개의 파일이 필요합니다.\n확인하신 뒤 다시 업로드해 주세요.`
      );
    if (wrongNum > 0)
      return alert(
        `${wrongNum}개의 파일명이 잘못되었습니다.\n파일명을 확인해 주세요.`
      );
    setFileInfo({
      file: formData,
      name: nameArr,
    });
  } else {
    setFileInfo({
      file: file,
      name: file.name,
    });
  }
  setTab('');
  setMsg('');
};

//@ 파일명 만들어주는 함수
export const makeFileName = (fileInfo, tab) => {
  if (Array.isArray(fileInfo.name)) {
    return `${tab} Confusion Matrix`;
  } else if (fileInfo.name.split('.').length > 2) {
    const nameArr = fileInfo.name.split('.');
    nameArr.pop();
    return `${nameArr.toString().replaceAll(',', '')}(${tab})`; // 파일 이름 수정
  } else return `${fileInfo.name.split('.')[0]}(${tab})`; // 파일 이름 수정
};

//- API로 받아오는 파일 다운로드 해주는 함수
export const download = ({ fileInfo, url, tab }) => {
  // 임시로 anchor을 만들어서 실행시켜 주고 없애줌
  const link = document.createElement('a');
  document.body.appendChild(link);
  link.href = url; // csv 다운로드 url
  link.download = makeFileName(fileInfo, tab);
  link.click(); // 다운로드 실행
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

//- 라이브러리로 만든 차트 png 파일로 다운로드 해주는 함수
export const chart2png = (fileInfo, tab) => {
  html2canvas(document.querySelector('.chart'), {
    scale: tab === 'CART분석' ? 3 : 2,
  }).then(canvas => {
    const link = document.createElement('a');
    document.body.appendChild(link);
    link.href = canvas.toDataURL('image/png', 1.0);
    link.download = `${makeFileName(fileInfo, tab)}.png`;
    link.click();
    document.body.removeChild(link);
  });
};

//- 테이블을 csv 파일로 내보내 주는 함수
export const table2csv = (fileInfo, tab) => {
  TableExport($('.exportTable')).remove();
  TableExport.prototype.defaultButton = 'download';
  TableExport($('.exportTable'), {
    filename: makeFileName(fileInfo, tab),
    formats: ['csv'],
  });
  $('.download').hide();
  $('.download').trigger('click');
};

//- API에서 받아오는 csv 데이터 테이블로 렌더할 수 있도록 데이터셋 생성해 주는 함수
export const csv2table = (text, setTable) => {
  const arr = text.split('\n'); // 줄바꿈 기호 기준 배열 생성
  const previewArr = [];
  for (let str of arr) {
    previewArr.push(str.split(',')); // 배열 속 문자열 배열로 변환
  }
  previewArr.pop(); // 마지막 인덱스는 빈 문자열로 나오므로 제거
  if (previewArr.length <= 10) {
    //- length가 10 이하일 경우 자르는 기능 없이 모두 렌더
    const bodyArr = previewArr.slice(1);
    bodyArr.forEach(arr => {
      const idx = previewArr.indexOf(arr) + 1;
      arr.unshift(idx);
    });
    setTable({
      tBody: previewArr.slice(1),
      tHead: previewArr[0],
    });
  } else {
    //- 아닐 경우 자르는 기능 포함하여 렌더
    const length = previewArr[0].length + 1; // 중간에 끊기 위해 길이 구한 뒤
    const middle = new Array(length).fill('...'); // 길이만큼 ...으로 채워주고
    const first = []; // 미리보기로 보여줄 데이터
    previewArr.slice(1, 5).forEach(arr => {
      const numArr = [];
      arr.forEach(str => {
        numArr.push(str);
      });
      const idx = previewArr.indexOf(arr) + 1;
      numArr.unshift(idx); // column number
      first.push(numArr);
    });
    const last = []; // 마지막 쪽 미리보기
    previewArr.slice(-4).forEach(arr => {
      const numArr = [];
      arr.forEach(str => {
        numArr.push(str);
      });
      const idx = previewArr.indexOf(arr) + 1;
      numArr.unshift(idx); // column number
      last.push(numArr);
    });
    setTable({
      tBody: [...first, middle, ...last],
      tHead: previewArr[0],
    });
  }
};

//- 미리보기 테이블 Thead 렌더
export const previewThead = table => {
  return table.tHead.reduce((acc, item) => {
    return (
      <>
        {acc}
        <th>{item}</th>
      </>
    );
  }, <></>);
};

//- 미리보기 테이블 Tbody 렌더
export const previewTbody = table => {
  const length = table.tHead.length + 1;
  const numArr = [];
  for (let i = 0; i < length; i++) {
    numArr.push(i);
  }
  return table.tBody.reduce((acc, item, idx) => {
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
