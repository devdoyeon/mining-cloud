import loadingImg from 'image/loading.gif';

const Loading = ({ msg }) => {
  return (
    <section className='loading-home content-container'>
      {msg === 'loading' && <img src={loadingImg} alt='로딩 이미지' />}
    </section>
  );
};

export default Loading;
