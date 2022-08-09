import axios from 'axios';

const errorHandling = async error => {
  const status = error?.response.status;
  switch (status) {
    case 500:
    case 504:
      return 'server';
    default:
      return null;
  }
};

// Param 값을 인자로 받아 데이터 정규화 탭 세 개의 API 통신을 하나로 할 수 있게끔 묶어둠
export const normalizationAPI = async (file, param) => {
  try {
    const headers = {
      'Content-Type': 'multipart/form-data',
    };
    return await axios.post(
      `/api/normalization/${param}`,
      { file },
      { headers }
    );
  } catch (error) {
    return await errorHandling(error);
  }
};

// Dummy Data
export const viewDataAPI = async (sc = 0) => {
  try {
    return await axios.post(`/api/viewdata`);
  } catch (error) {
    return await errorHandling(error);
  }
};

// cycle = 3~23
export const heatMapAPI = async cycle => {
  try {
    return await axios.post(`/api/heatmap?cycle=${cycle}`);
  } catch (error) {
    return await errorHandling(error);
  }
};

export const uploadAPI = async file => {
  try {
    const headers = {
      'Content-Type': 'multipart/form-data',
    };
    return await axios.post(`/api/upload`, { file }, { headers });
  } catch (error) {
    return await errorHandling(error);
  }
};
