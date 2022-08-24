import { useState, useEffect } from 'react';
import { ResponsiveBar } from '@nivo/bar';
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
    ext: '',
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
  const [corrUrl, setCorrUrl] = useState('');
  const [correlationUrl, setCorrelationUrl] = useState('');

  const fileSettingState = { setFileInfo, setTab, setMsg, msg };
  const startParamState = { msg, setMsg, setTab, fileInfo };

  useEffect(() => {
    document.title = '변수 분석 및 선택 | MINING CLOUD';
  }, []);

  //= Main Function
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
          //@ Table Data Setting
          const { correlationship, datafrmae, heatmap } = result.data.data;
          const keys = Object.keys(correlationship);
          const values = Object.values(correlationship);
          setCorr(JSON.parse(datafrmae).data); // String to Object
          setHeatMap(heatmap); // Confusion Matrix base64 URL
          setTable({
            tHead: keys,
            tBody: values,
          });

          /*
          ~ Make Csv DataSet
          ~ 테이블의 데이터 양이 커서 Table Export 라이브러리를 사용해 다운로드 받기에는
          ~ 다운로드 시간이 지나치게 많이 걸리기 때문에 데이터를 직접 text/csv 데이터셋에 맞춰
          ~ 가공해 Blob으로 다운로드 받을 수 있게끔 만들어 주어야 함. 
          */
          let correlationStr = `,${keys.toString()}\n`; // Head
          values.forEach((obj, idx) => {
            correlationStr += `${keys[idx]},${Object.values(obj).toString()}\n`;
            // CSV String Data 생성
          });
          const correlationBlob = new Blob([correlationStr], {
            type: 'text/csv',
          }); // 파일화
          setCorrelationUrl(window.URL.createObjectURL(correlationBlob));

          let corrStr = `,,corr\n`; // Head
          JSON.parse(datafrmae).data.forEach(obj => {
            corrStr += `${Object.values(obj).toString()}\n`;
            // CSV String Data 생성
          });
          const corrBlob = new Blob([corrStr], {
            type: 'text/csv',
          }); //파일화
          setCorrUrl(window.URL.createObjectURL(corrBlob));

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
        setMsg('largeData');
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

  //= Corr Preview Tbody
  const correlationTbody = () => {
    return corr.reduce((acc, { level_0, level_1, corr }) => {
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
    }, <></>);
  };

  //= Correlation -> Corr Table Download
  const corrDown = () => {
    const fileName = () => {
      if (fileInfo.name.split('.').length > 2) {
        const nameArr = fileInfo.name.split('.');
        nameArr.pop();
        return `${nameArr.toString().replaceAll(',', '')}(${tab}(corr))`;
      } else return `${fileInfo.name.split('.')[0]}(${tab}(corr))`;
    };
    const link = document.createElement('a');
    document.body.appendChild(link);
    link.href = corrUrl; // csv 다운로드 url
    link.download = fileName();
    link.click(); // 다운로드 실행
    document.body.removeChild(link);
  };

  //= Correlation -> Correlation Table Download
  const correlationDown = () => {
    const fileName = () => {
      if (fileInfo.name.split('.').length > 2) {
        const nameArr = fileInfo.name.split('.');
        nameArr.pop();
        return `${nameArr.toString().replaceAll(',', '')}(${tab}(correlation))`; // 파일 이름 수정
      } else return `${fileInfo.name.split('.')[0]}(${tab}(correlation))`; // 파일 이름 수정
    };
    const link = document.createElement('a');
    document.body.appendChild(link);
    link.href = correlationUrl; // csv 다운로드 url
    link.download = fileName();
    link.click(); // 다운로드 실행
    document.body.removeChild(link);
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
              tab === '상관분석' && msg === 'largeData' && (
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
                    <button onClick={() => correlationDown()}>다운로드</button>
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
                      <tbody>{correlationTbody()}</tbody>
                    </table>
                  </div>
                  <div className='downloadBtnWrap'>
                    <button onClick={() => corrDown()}>다운로드</button>
                  </div>
                  <img
                    src={`data:image/jpg;base64,${heatMap}`} //base64 url
                    alt='Correlation Confusion Matrix'
                  />
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
                        <ResponsiveBar
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
