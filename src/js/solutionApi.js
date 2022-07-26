import axios from 'axios';

// Dummy Data
export const viewDataAPI = async (sc = 0) => {
  try {
    return await axios.post(`/api/viewdata`);
  } catch (error) {
    console.log(error.message);
  }
};

export const normalizationAPI = async (file, param) => {
  try {
    const headers = {
      'Content-Type': 'multipart/form-data',
    };
    return await axios.post(`/api/normalization/${param}`, { file }, { headers });
  } catch (error) {
    console.log(error.message);
  }
};

// cycle = 3~23
export const heatMapAPI = async cycle => {
  try {
    return await axios.post(`/api/heatmap?cycle=${cycle}`);
  } catch (error) {
    console.log(error.message);
  }
};

export const uploadAPI = async file => {
  try {
    const headers = {
      'Content-Type': 'multipart/form-data',
    };
    return await axios.post(`/api/upload`, { file }, { headers });
  } catch (error) {
    console.log(error.message);
  }
};
