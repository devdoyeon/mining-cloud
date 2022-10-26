import { memo } from 'react';

const DataUploadComp = ({ fileName }) => {
  return (
    <div className='outputWrap'>
      <h4>Uploaded Data</h4>
      {Array.isArray(fileName) ? (
        <div className='fileList'>
          {fileName.reduce((acc, name, idx) => {
            return (
              <>
                {acc}
                <div className='row multi'>
                  <span className='medium'>{idx + 1}</span>
                  <p>{name}</p>
                </div>
              </>
            );
          }, <></>)}
        </div>
      ) : (
        <div className='row'>
          <span className='medium'>Name</span>
          <p>{fileName === '' ? '파일을 업로드해 주세요.' : fileName}</p>
        </div>
      )}
    </div>
  );
};

export default memo(DataUploadComp);
