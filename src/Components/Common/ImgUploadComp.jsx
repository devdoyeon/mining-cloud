const ImgUploadComp = ({ uploadFileName }) => {
    return (
        <div className="ouputWrap">
            <h4>Uploaded Data</h4>
            <div className="row">
                <span className="medium">name</span>
                <p>{uploadFileName === "" ? "파일을 업로드 해주세요." : uploadFileName}</p>
            </div>
        </div>
    );
};

export default ImgUploadComp;
