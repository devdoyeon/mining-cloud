import { useState, useEffect } from 'react';
import { ResponsiveHeatMapCanvas } from '@nivo/heatmap';
import { ResponsiveBarCanvas } from '@nivo/bar';
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
  const [bar, setBar] = useState({
    keys: [],
    data: [],
  });
  const [msg, setMsg] = useState('');
  const [tab, setTab] = useState('');
  const [heatMap, setHeatMap] = useState([]);

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
      setHeatMap([]);
      const result = await analysisAPI(fileInfo.file, param);
      if (typeof result === 'object') {
        if (result.data === null)
          return alert('업로드한 파일을 확인해 주세요.');
        //& 상관분석
        if (param === 'correlation') {
          //@ HeatMap Chart Data Setting
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
            setHeatMap(prev => {
              const clone = [...prev];
              clone.push(obj);
              return clone;
            });
          });
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
            {
              //= 상관분석 다운로드 탭
              tab === '상관분석' && msg === 'download' && (
                <div className='wrap'>
                  <div className='chart'>
                    <ResponsiveHeatMapCanvas
                      data={heatMap}
                      margin={{ top: 30, right: 60, bottom: 70, left: 120 }}
                      valueFormat='> .2f'
                      axisBottom={{
                        tickRotation: -20,
                      }}
                      axisTop={false}
                      style={{
                        cursor: 'default',
                      }}
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
                </div>
              )
            }
            {
              //= 교차분석 다운로드 탭
              tab === '교차분석' && msg === 'download' && (
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
              //= CART분석 다운로드 탭
              tab === 'CART분석' && msg === 'download' && (
                <>
                  <div className='row'>
                    <div className='wrap'>
                      <div className='chart cart-chart'>
                        <ResponsiveBarCanvas
                          data={bar.data}
                          keys={bar.keys}
                          margin={{ top: 30, right: 30, bottom: 10, left: 30 }}
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
                </>
              )
            }
          </div>
        </div>
        <Loading msg={msg} />
      </div>
    </section>
  );
};

export default DataAnalysis;
