import axios from "axios";

//회원가입
export const signUp = async (data) => {
    const headers = { 'Content-Type' : 'application/json' }
    try {
        return await axios.post("/api/auth/signup", data, { headers });
    } catch (error) {
        return null;
    }

}

//회원가입
export const signIn = async (data) => {
    const headers = { 'Content-Type' : 'application/json' }
    try {
        return await axios.post("/api/auth/login", data, { headers });
    } catch (error) {
        return null;
    }

}

//이미지 전처리
export const preProcessImg = async (formData) => {
    const headers = {
        'Content-Type': 'multipart/form-data',
        'access_token': 'markis2',
    }
    try {
        return await axios.post("/api/image/preprocess", formData, { headers });
    } catch (error) {
        return null;
    }

}
//학습용 데이터셋 생성
export const markFeatureMap = async (formData) => {
    const headers = {
        'Content-Type': 'multipart/form-data',
        'access_token': 'markis2',
    }
    try {
        return await axios.post("/api/image/featuremap", formData, { headers });
    } catch (error) {
        return null;
    }

}