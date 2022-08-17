import axios from 'axios';

const headers = {
  'Content-Type': 'multipart/form-data',
};

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

export const preprocessAPI = async (file, param) => {
  try {
    return await axios.post(`/api/preprocess/${param}`, { file }, { headers });
  } catch (error) {
    return await errorMessage(error);
  }
};

// Param 값을 인자로 받아 데이터 정규화 탭 세 개의 API 통신을 하나로 할 수 있게끔 묶어둠
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

export const analysisAPI = async (file, param) => {
  try {
    return await axios.post(`/api/analysis/${param}`, { file }, { headers });
  } catch (error) {
    return await errorMessage(error);
  }
};

export const trainingAPI = async (file, param) => {
  try {
    return await axios.post(`/api/`), { file }, { headers };
  } catch (error) {
    return await errorMessage(error);
  }
};
