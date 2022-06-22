import loadingImg from 'image/loading.gif';

const Loading = ({msg,downloadUrl}) => {

    return (
        <section className="loading-home content-container">
            {msg === 'loading' && <img src={loadingImg} alt="로딩이미지"/>}
            {downloadUrl && <a href={downloadUrl} download>다운로드</a>}
        </section>
    )

}

export default Loading;