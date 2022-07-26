import { useState } from 'react';

import { fileNamePreview } from 'js/common';

import Loading from 'Components/Loading';
import Header from './Common/Header';
import SideBar from './Common/SideBar';
import DataUploadComp from './Common/DataUploadComp';

const FeatureMap = () => {
  const [uploadFile, setUploadFile] = useState('');
  const [uploadFileName, setUploadFileName] = useState('');
  const [msg, setMsg] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');

  //이미지 피처맵 api 요청
  const makeFeatureMap = async e => {
  };

  const loadingData = { msg, downloadUrl };

  const uploadFileData = { uploadFile, uploadFileName };

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
              onChange={e =>
                fileNamePreview(
                  e.target.files[0],
                  setUploadFile,
                  setUploadFileName
                )
              }
              accept='.csv'
            />
            {/* <input type="file" id="fileUpload" onChange={(e)=>imgPreview(e.target.files,setUploadImg,setUploadImgName)} accept="image/*" multiple/> */}
            <button onClick={e => makeFeatureMap(e.target)}>
              Partitioning
            </button>
            <br />
            <DataUploadComp {...uploadFileData} />
          </div>
        </div>
        <Loading {...loadingData} />
      </div>
    </section>
  );
};

export default FeatureMap;
