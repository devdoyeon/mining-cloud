import { useState } from "react";

import { activeOn, fileNamePreview } from "js/common";

import Loading from "Components/Loading";
import Header from "./Common/Header";
import SideBar from "./Common/SideBar";
import ImgUploadComp from "./Common/ImgUploadComp";

const DataAnalysis = () => {

    const [uploadFile,setUploadFile] = useState('');
    const [uploadFileName,setUploadFileName] = useState('');
    const [msg,setMsg] = useState('');
    const [downloadUrl,setDownloadUrl] = useState('');

    const dataProcess = async (e) => {
        if(msg === 'loading') {
            alert('다른 작업을 수행하는 중에는 버튼을 클릭할 수 없습니다.');
            return;
        }
        activeOn(e,uploadFile,setMsg); //업로드 파일 체크 후 버튼 및 로딩바 활성화
    }

    const loadingData = {msg,downloadUrl}
    
    const uploadFileData = {uploadFile,uploadFileName}

    return (
        <section className="content-container">
            <SideBar />
            <div>
                <Header />  
                <div className="content-wrap">
                    <h3 className="bold">변수 분석 및 선택</h3><hr />
                    <div>
                        <label htmlFor="fileUpload">파일 업로드</label>
                        <input type="file" id="fileUpload" onChange={(e)=>fileNamePreview(e.target.files[0],setUploadFile,setUploadFileName)} accept=".csv" />
                        <button onClick={(e)=>dataProcess(e.target)}>상관분석</button>
                        <button onClick={(e)=>dataProcess(e.target)}>비교분석</button>
                        <button onClick={(e)=>dataProcess(e.target)}>CART 분석</button><br />
                        <ImgUploadComp {...uploadFileData}/>
                    </div>
                </div>
                <Loading {...loadingData}/>
            </div>
        </section>
    )

}

export default DataAnalysis;