import { memo } from 'react';

const DataUploadComp = ({ fileName }) => {
  return (
    <div className='outputWrap'>
      <h4>Uploaded Data</h4>
      <div className='row'>
        <span className='medium'>name</span>
        <p>
          {fileName === '' ? '파일을 업로드해 주세요.' : fileName}
        </p>
      </div>
    </div>
  );
};

export default memo(DataUploadComp);
