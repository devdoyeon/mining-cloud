import { memo } from 'react';

const DataUploadComp = ({ uploadFileName }) => {
  return (
    <div className='outputWrap'>
      <h4>Uploaded Data</h4>
      <div className='row'>
        <span className='medium'>name</span>
        <p>
          {uploadFileName === '' ? '파일을 업로드해 주세요.' : uploadFileName}
        </p>
      </div>
    </div>
  );
};

export default memo(DataUploadComp);
