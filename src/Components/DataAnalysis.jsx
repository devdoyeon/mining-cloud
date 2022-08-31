import { useState, useEffect } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import saveAs from 'file-saver';
import Loading from 'Components/Common/Loading';
import DataUploadComp from './Common/DataUploadComp';
import Header from './Common/Header';
import SideBar from './Common/SideBar';
import {
  fileSetting,
  startFn,
  chart2png,
  previewThead,
  table2csv,
  errorHandler,
} from 'js/common';
import { analysisAPI } from 'js/miningAPI';

const DataAnalysis = () => {
  // Common State
  const [fileInfo, setFileInfo] = useState({
    file: '',
    name: '',
  });
  const [table, setTable] = useState({
    tBody: [],
    tHead: [],
  });
  const [msg, setMsg] = useState('');
  const [tab, setTab] = useState('');
  // CART State
  const [bar, setBar] = useState({
    keys: [],
    data: [],
  });
  // Correlation State
  const [corr, setCorr] = useState([]);
  const [heatMap, setHeatMap] = useState('');
  const [corrData, setCorrData] = useState({});

  const fileSettingState = { setFileInfo, setTab, setMsg, msg };
  const startParamState = { msg, setMsg, setTab, fileInfo };

  useEffect(() => {
    document.title = '변수 분석 및 선택 | MINING CLOUD';
  }, []);

  //! Main Function
  const analysis = async e => {
    if (startFn(e, startParamState)) {
      let param;
      switch (e.textContent) {
        case '상관분석':
          param = 'correlation';
          break;
        case '교차분석':
          param = 'cross_anus';
          break;
        case 'CART분석':
          param = 'cart_anus';
          break;
        default:
          return null;
      }
      const result = await analysisAPI(fileInfo.file, param);
      if (typeof result === 'object') {
        if (result.data === null)
          return alert('업로드한 파일을 확인해 주세요.');
        //& 상관분석
        if (param === 'correlation') {
          //@ Table & Confusion Matrix Data Setting
          const { correlationship, datafrmae, heatmap } = result.data.data;
          setCorr(JSON.parse(datafrmae).data); // String to Object
          setTable({
            tHead: Object.keys(correlationship),
            tBody: Object.values(correlationship),
          });
          setCorrData(JSON.parse(datafrmae).data);
          setHeatMap(heatmap); // Confusion Matrix base64 URL
          return setMsg('largeData');
          //& 교차분석
        } else if (param === 'cross_anus') {
          //@ Table Data Setting
          setTable({
            tHead: Object.keys(result.data.data),
            tBody: Object.values(result.data.data),
          });
          //& CART분석
        } else if (param === 'cart_anus') {
          //@ Table Data Setting
          const { importance_df } = result.data.data;
          setTable({
            tHead: Object.keys(importance_df),
            tBody: Object.values(importance_df),
          });
          //@ Bar Chart Data Setting
          const { feature, importance } = importance_df;
          let arr = [];
          for (let i = 0; i < Object.values(feature).length; i++) {
            let obj = {};
            obj[Object.values(feature)[i]] = Object.values(importance)[i];
            arr.push(obj);
          }
          setBar({
            keys: Object.values(feature),
            data: [Object.assign({}, ...arr)],
          });
        }
        setMsg('download');
      } else return errorHandler(result, fileSettingState);
    } else return;
  };

  //= Common Preview Tbody
  const previewTbody = () => {
    if (tab === '상관분석') {
      return table.tHead.reduce((acc, key) => {
        const data = table.tBody.reduce((acc, value) => {
          return (
            <>
              {acc}
              <td>{value[key]}</td>
            </>
          );
        }, <></>);
        return (
          <>
            {acc}
            <tr>
              <td>{key}</td>
              {data}
            </tr>
          </>
        );
      }, <></>);
    } else {
      const length = Object.keys(table.tBody[0]).length;
      const numArr = [];
      for (let i = 0; i < length; i++) {
        numArr.push(i);
      }
      return numArr.reduce((acc, num) => {
        const data = table.tBody.reduce((acc, obj) => {
          return (
            <>
              {acc}
              <td>{obj[num]}</td>
            </>
          );
        }, <></>);
        return (
          <>
            {acc}
            <tr>{data}</tr>
          </>
        );
      }, <></>);
    }
  };

  //= Make CSV File Name
  const makeFileName = str => {
    if (fileInfo.name.split('.').length > 2) {
      const nameArr = fileInfo.name.split('.');
      nameArr.pop();
      return `${nameArr.toString().replaceAll(',', '')}(${tab}(${str}))`;
    } else return `${fileInfo.name.split('.')[0]}(${tab}(${str}))`;
  };

  return (
    <section className='content-container'>
      <SideBar />
      <div>
        <Header />
        <div className='content-wrap'>
          <h3 className='bold'>변수 분석 및 선택</h3>
          <hr />
          <div>
            <label htmlFor='fileUpload'>파일 업로드</label>
            <input
              type='file'
              id='fileUpload'
              onChange={e => fileSetting(e, fileSettingState)}
              accept='.csv'
            />
            <button
              onClick={e => analysis(e.target)}
              className={tab === '상관분석' ? 'active' : ''}>
              상관분석
            </button>
            <button
              onClick={e => analysis(e.target)}
              className={tab === '교차분석' ? 'active' : ''}>
              교차분석
            </button>
            <button
              onClick={e => analysis(e.target)}
              className={tab === 'CART분석' ? 'active' : ''}>
              CART분석
            </button>
            <br />
            <DataUploadComp fileName={fileInfo.name} />
            {msg === 'largeData' && tab === '상관분석' && (
              <div className='wrap'>
                <div className='previewTable correlation'>
                  <table>
                    <thead>
                      <tr>
                        <th>Correlation</th>
                        {previewThead(table)}
                      </tr>
                    </thead>
                    <tbody>{previewTbody()}</tbody>
                  </table>
                </div>
                <div className='downloadBtnWrap'>
                  <button
                    onClick={() => {
                      //- First Table Download
                      let str = `,${table.tHead.toString()}\n`; // Head
                      table.tBody.forEach((obj, idx) => {
                        str += `${table.tHead[idx]},${Object.values(
                          obj
                        ).toString()}\n`;
                        // CSV String Data 생성
                      });
                      const blob = new Blob([str], {
                        type: 'text/csv',
                      }); // 파일화
                      saveAs(blob, makeFileName('correlation'));
                    }}>
                    다운로드
                  </button>
                </div>
                <div className='previewTable corr'>
                  <table>
                    <thead>
                      <tr>
                        <th></th>
                        <th></th>
                        <th>corr</th>
                      </tr>
                    </thead>
                    <tbody>
                      {corr.reduce((acc, { level_0, level_1, corr }) => {
                        return (
                          <>
                            {acc}
                            <tr>
                              <td>{level_0}</td>
                              <td>{level_1}</td>
                              <td>{corr}</td>
                            </tr>
                          </>
                        );
                      }, <></>)}
                    </tbody>
                  </table>
                </div>
                <div className='downloadBtnWrap'>
                  <button
                    onClick={() => {
                      //- Second Table Download
                      let str = `,,corr\n`; // Head
                      corrData.forEach(obj => {
                        str += `${Object.values(obj).toString()}\n`;
                        // CSV String Data 생성
                      });
                      const blob = new Blob([str], {
                        type: 'text/csv',
                      }); //파일화
                      saveAs(blob, makeFileName('corr'));
                    }}>
                    다운로드
                  </button>
                </div>
                <img
                  src={`data:image/jpg;base64,${heatMap}`} //base64 url
                  alt='Correlation Confusion Matrix'
                />
              </div>
            )}
            {msg === 'download' && (
              <>
                {
                  //~ 교차분석
                  tab === '교차분석' && (
                    <div className='wrap'>
                      <div className='previewTable cross'>
                        <table className='exportTable'>
                          <thead>
                            <tr>{previewThead(table)}</tr>
                          </thead>
                          <tbody>{previewTbody()}</tbody>
                        </table>
                      </div>
                      <div className='downloadBtnWrap'>
                        <button
                          onClick={() => table2csv(fileInfo, tab)}
                          className='exportBtn'>
                          다운로드
                        </button>
                      </div>
                    </div>
                  )
                }
                {
                  //~ CART분석
                  tab === 'CART분석' && (
                    <div className='row'>
                      <div className='wrap'>
                        <div className='chart cart-chart'>
                          <ResponsiveBar
                            data={bar.data}
                            keys={bar.keys}
                            margin={{
                              top: 30,
                              right: 30,
                              bottom: 10,
                              left: 30,
                            }}
                            padding={0}
                            groupMode='grouped'
                            colors={{ scheme: 'spectral' }}
                            animate={false}
                            isInteractive={false}
                            enableLabel={false}
                            axisTop={null}
                            axisRight={null}
                            axisBottom={{
                              tickSize: 0,
                              tickPadding: 10,
                            }}
                            axisLeft={{
                              tickSize: 0,
                            }}
                          />
                        </div>
                        <div className='downloadBtnWrap'>
                          <button
                            onClick={() => chart2png(fileInfo, tab)}
                            className='exportBtn'>
                            차트 이미지 다운로드
                          </button>
                        </div>
                      </div>
                      <div className='wrap'>
                        <div className='previewTable cart'>
                          <table className='exportTable'>
                            <thead>
                              <tr>{previewThead(table)}</tr>
                            </thead>
                            <tbody>{previewTbody()}</tbody>
                          </table>
                        </div>
                        <div className='downloadBtnWrap'>
                          <button
                            onClick={() => table2csv(fileInfo, tab)}
                            className='exportBtn'>
                            CSV 다운로드
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                }
              </>
            )}
          </div>
        </div>
        <Loading msg={msg} />
      </div>
    </section>
  );
};

export default DataAnalysis;
