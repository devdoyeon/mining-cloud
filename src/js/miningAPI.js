import axios from 'axios';

//= Header
const headers = {
  'Content-Type': 'multipart/form-data',
};

//= Binary Data를 ZIP 파일로 만들어야 할 때 사용하는 Header
const zipHeaders = {
  responseType: 'arraybuffer',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};

//# Error Handling
const errorMessage = async error => {
  const status = error?.response.status;
  switch (status) {
    case 500:
    case 504:
      return 'server';
    default:
      return null;
  }
};

//! 데이터 전처리
export const preprocessAPI = async (file, param) => {
  try {
    return await axios.post(`/api/preprocess/${param}`, { file }, zipHeaders);
  } catch (error) {
    return await errorMessage(error);
  }
};

//& 데이터 정규화
export const normalizationAPI = async (file, param) => {
  try {
    return await axios.post(
      `/api/normalization/${param === 'standard scaler' ? 'stdscaler' : param}`,
      { file },
      zipHeaders
    );
  } catch (error) {
    return await errorMessage(error);
  }
};

//@ AI 학습용 데이터셋 생성
export const featureMapAPI = async (file, param) => {
  try {
    return await axios.post(
      `/api/balancing/${param === 'balancing' ? 'fiftyfifty' : param}`,
      { file },
      zipHeaders
    );
  } catch (error) {
    return await errorMessage(error);
  }
};

//- 변수 분석 및 선택
export const analysisAPI = async (file, param) => {
  try {
    return await axios.post(`/api/analysis/${param}`, { file }, { headers });
  } catch (error) {
    return await errorMessage(error);
  }
};

//~ 모델 학습 및 검증
export const trainingAPI = async (files, param) => {
  try {
    return await axios.post(`/api/train/${param}`, files, { headers });
  } catch (error) {
    return await errorMessage(error);
  }
};
