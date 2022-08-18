import axios from 'axios';

const headers = {
  'Content-Type': 'multipart/form-data',
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
    return await axios.post(`/api/preprocess/${param}`, { file }, { headers });
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
      { headers }
    );
  } catch (error) {
    return await errorMessage(error);
  }
};

//@ AI 학습용 데이터셋 생성
export const featureMapAPI = async (file, param) => {
  try {
    const query = () => {
      if (param === 'balancing')
        return {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };
      else
        return {
          responseType: 'arraybuffer',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };
    };
    return await axios.post(
      `/api/balancing/${param === 'balancing' ? 'fiftyfifty' : param}`,
      { file },
      query()
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
export const trainingAPI = async (file, param) => {
  try {
    return await axios.post(`/api/train/${param}`, { file }, { headers })
  } catch (error) {
    return await errorMessage(error);
  }
};
