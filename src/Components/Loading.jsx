import loadingImg from 'image/loading.gif';
import { download } from 'js/common';

const Loading = ({ msg }) => {
  return (
    <section className='loading-home content-container'>
      {msg === 'loading' && <img src={loadingImg} alt='로딩이미지' />}
    </section>
  );
};

export default Loading;
