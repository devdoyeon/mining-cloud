import $ from 'jquery';

//state 값 변경
export const changeParams = (data,value,column,setData) => {
    const clone = {...data};
    clone[column] = value;
    setData(clone);
}

//state 값 변경
export const makeQuery = (textParams) => {
    const query = {};
    const arr = {...textParams};
    for(let i of Object.keys(arr)) query[i] = arr[i];
    return query;
}

//파일이름 및 버퍼처리
export const fileNamePreview = (inputFile,setUploadFile,setUploadFileName) => {
    if(!inputFile) return; //파일 없을때 처리

    const ext = inputFile.name.split('.').pop().toLowerCase(); //확장자 
    if($.inArray(ext,["csv"]) === -1) {
        window.alert('csv 만 업로드 가능');
        return;
    }
    let reader = new FileReader();
    reader.onload = () => {
        setUploadFile(reader.result);
    }
    reader.readAsDataURL(inputFile);
    setUploadFileName(inputFile.name);
}

//버튼 및 로딩바 active 처리
export const activeOn = (event,uploadFile,setMsg) => {
    if(uploadFile === '') {
        alert('파일을 업로드 해주세요');
        return;
    }
    setMsg('loading');
    $('.content-wrap > div button').removeClass('active');
    $(event).addClass('active');
}

//formData 만들기
export const makeFormDataArr = async (uploadImg,uploadImgName) => {
    let bloBin = [];
    let array = [[],[],[],[],[],[],[],[],[],[]];
    let file = [];
    const formData = new FormData();
    for(let i=0;i<uploadImg.length;i++) {
        bloBin.push(atob(uploadImg[i].split(',')[1]));
        for(let j=0;j<bloBin[i].length;j++) {
            array[i].push(bloBin[i].charCodeAt(j));
        }
        file.push(new Blob([new Uint8Array(array[i])], {type: 'image/png'}));
        if(uploadImgName) formData.append('names',uploadImgName[i]);
        formData.append('files',file[i]);
    }
    return formData;
}