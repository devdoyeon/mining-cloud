import $ from 'jquery';

export const fileSetting = (e, { setFileInfo, setTab, setMsg }) => {
  const file = e.target.files[0];
  if (!file) return;
  else {
    setFileInfo(prev => {
      const clone = { ...prev };
      clone.file = file;
      clone.name = file.name;
      return clone;
    });
    setTab('');
    setMsg('');
  }
};

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

export const download = ({ fileInfo, url, tab }) => {
  const ext = fileInfo.ext;
  // 임시로 anchor을 만들어서 실행시켜 주고 없애줌
  const link = document.createElement('a');
  document.body.appendChild(link);
  link.href = url; // csv 다운로드 url
  if (fileInfo.name.split('.').length > 2) {
    const nameArr = fileInfo.name.split('.');
    nameArr.pop();
    link.download = `${nameArr.toString().replaceAll(',', '')}(${tab}).${ext}`; // 파일 이름 수정
  } else link.download = `${fileInfo.name.split('.')[0]}(${tab}).${ext}`; // 파일 이름 수정

  link.click(); // 다운로드 실행
  document.body.removeChild(link);
};

export const csvToTable = (result, setTable) => {
  const arr = result.data.split('\n'); // 줄바꿈 기호 기준 배열 생성
  const previewArr = [];
  for (let str of arr) {
    previewArr.push(str.split(',')); // 배열 속 문자열 배열로 변환
  }
  previewArr.pop(); // 마지막 인덱스는 빈 문자열로 나오므로 제거
  if (previewArr.length <= 10) {
    //@ length가 10 이하일 경우 자르는 기능 없이 모두 렌더
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
    //@ 아닐 경우 자르는 기능 포함하여 렌더
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
