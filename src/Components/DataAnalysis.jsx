import { useState, useEffect } from 'react';
import { ResponsiveHeatMap } from '@nivo/heatmap';
import { analysisAPI } from 'js/solutionApi';
import {
  fileSetting,
  startFn,
  chart2png,
  previewThead,
  table2csv,
  errorHandler,
} from 'js/common';
import Loading from 'Components/Common/Loading';
import Header from './Common/Header';
import SideBar from './Common/SideBar';
import DataUploadComp from './Common/DataUploadComp';

const DataAnalysis = () => {
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
  const [chartData, setChartData] = useState([]);

  const fileSettingState = { setFileInfo, setTab, setMsg };
  const startParamState = { msg, setMsg, setTab, fileInfo };

  useEffect(() => {
    document.title = '변수 분석 및 선택 | MINING CLOUD';
  }, []);

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
      setChartData([]);
      const result = await analysisAPI(fileInfo.file, param);
      console.log(result);
      if (typeof result === 'object') {
        if (param === 'correlation') {
          const { correlationship } = result.data.data;
          const keys = Object.keys(
            correlationship[Object.keys(correlationship)[0]]
          );
          keys.forEach(item => {
            const values = Object.values(correlationship[item]);
            let obj = {
              id: item,
              data: [],
            };
            values.forEach((value, idx) => {
              obj.data.push({ x: keys[idx], y: value });
            });
            setChartData(prev => {
              const clone = [...prev];
              clone.push(obj);
              return clone;
            });
          });
        } else if (param === 'cart_anus') {
          const { importance_df } = result.data.data;
          setTable({
            tHead: Object.keys(importance_df),
            tBody: Object.values(importance_df),
          });
        } else if (param === 'cross_anus') {
          console.log(Object.keys(result.data.data));
          console.log(Object.values(result.data.data));
          setTable({
            tHead: Object.keys(result.data.data),
            tBody: Object.values(result.data.data),
          });
        }
        setMsg('download');
      } else return errorHandler(result, fileSettingState);
    } else return;
  };

  const previewTbody = () => {
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
            {tab === '상관분석' && msg === 'download' && (
              <>
                <div className='chart'>
                  <ResponsiveHeatMap
                    data={chartData}
                    margin={{ top: 30, right: 60, bottom: 60, left: 120 }}
                    valueFormat='> .2f'
                    axisBottom={{
                      tickRotation: 20,
                    }}
                    axisTop={false}
                    colors={{
                      type: 'diverging',
                      scheme: 'greens',
                    }}
                    animate={false}
                    isInteractive={false}
                    legends={[
                      {
                        anchor: 'right',
                        translateX: 40,
                        length: 500,
                        direction: 'column',
                        tickSize: 0,
                      },
                    ]}
                  />
                </div>
                <div className='downloadBtnWrap'>
                  <button onClick={() => chart2png(fileInfo, tab)}>
                    다운로드
                  </button>
                </div>
              </>
            )}
            {(tab === 'CART분석' || tab === '교차분석') && msg === 'download' && (
              <>
                <div className='wrap'>
                  <div
                    className={`previewTable ${
                      (tab === 'CART분석' && 'cart') ||
                      (tab === '교차분석' && 'cross')
                    }`}>
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
