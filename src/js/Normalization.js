import {
  zScoreAPI,
  heatMapAPI,
  minMaxAPI,
  uploadAPI,
  viewDataAPI,
} from './solutionApi';

let prevent = false;

export const zScore = async ({ uploadFile, setMsg, setUrl }) => {
  if (prevent) return;
  prevent = true;
  setTimeout(() => {
    prevent = false;
  }, 200);
  setMsg('loading');
  const result = await zScoreAPI(uploadFile);
  console.log(result)
  console.log(result.data)
  setMsg('download');
  const str = result.data;
  const data = str.replaceAll('\\n', '\\r\\n');
  let blob = new Blob([data], { type: 'text/csv;charset=utf-8' });
  setUrl(window.URL.createObjectURL(blob));
}