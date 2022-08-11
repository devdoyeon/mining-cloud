import $ from 'jquery';

export const fileSetting = (e, { setFileInfo, setTab, setMsg }) => {
  const file = e.target.files[0];
  if (!file) return;
  else {
    setFileInfo({
      file: file,
      name: file.name,
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
