import { useState, useEffect } from 'react';
import { ResponsiveHeatMap } from '@nivo/heatmap';
import Loading from 'Components/Common/Loading';
import DataUploadComp from 'Components/Common/DataUploadComp';
import Header from 'Components/Common/Header';
import SideBar from 'Components/Common/SideBar';
import {
  fileSetting,
  startFn,
  table2csv,
  previewThead,
  chart2png,
} from 'js/common';
import { trainingAPI } from 'js/miningAPI';

const ModelTraining = () => {
  const [fileInfo, setFileInfo] = useState({
    file: '',
    name: '',
  });
  const [table, setTable] = useState({
    tBody: [],
    tHead: [],
  });
  const [matrix, setMatrix] = useState({
    data: [],
    min: '',
    max: '',
  });
  const [msg, setMsg] = useState('');
  const [tab, setTab] = useState('');
  const [guide, setGuide] = useState({
    // 업로드 가능한 파일명 가이드
    btn: false, // 가이드 토글 버튼
    view: false, // 가이드 렌더 여부
  });

  useEffect(() => {
    document.title = '모델 학습 및 검증 | MINING CLOUD';
  }, []);

  useEffect(() => {
    if (!guide.btn) return; // guide.btn이 true일 때만 작동
    setGuide(prev => {
      const clone = { ...prev };
      clone.view = true; // 토글 버튼이 클릭 됐을 때 렌더됨
      return clone;
    });
    setTimeout(() => {
      // 3초 뒤 렌더 해제 및 토글 버튼 상태도 false로 변경
      setGuide({
        btn: false,
        view: false,
      });
    }, 3000);
  }, [guide.btn]);

  const fileSettingState = { setFileInfo, setTab, setMsg };
  const startParamState = { msg, setMsg, setTab, fileInfo };

  const training = async e => {
    if (startFn(e, startParamState)) {
      let param;
      switch (e.textContent) {
        case 'LR':
          param = 'regression';
          break;
        case 'DT':
          param = 'deccisiontree';
          break;
        case 'SVM':
          param = 'svm';
          break;
        case 'DNN':
          param = 'dnn';
          break;
        case 'RF':
          param = 'randomforest';
          break;
        case 'XGBoost':
          param = 'xgboost';
          break;
        default:
          return null;
      }
      const trainResult = await trainingAPI(fileInfo.file, param);
      if (typeof trainResult === 'object') {
        const { conf_mat, result } = trainResult.data.data;
        //@ Confusion Matrix Data Setting
        let dataArr = [];
        let numArr = [];
        conf_mat.forEach((arr, idx) => {
          const obj = {
            id: idx,
            data: [
              { x: 0, y: arr[0] },
              { x: 1, y: arr[1] },
            ],
          };
          numArr.push(...arr);
          dataArr.push(obj);
        });
        setMatrix({
          data: dataArr,
          min: Math.min(...numArr),
          max: Math.max(...numArr),
        });
        //@ Table Data Setting
        setTable({
          tHead: Object.values(result.지표),
          tBody: Object.values(result.결과값),
        });
        setMsg('download');
      }
    } else return;
  };

  return (
    <section className='content-container'>
      <SideBar />
      <div>
        <Header />
        <div className='content-wrap'>
          <h3 className='bold'>모델 학습 및 검증</h3>
          <hr />
          <div>
            <label htmlFor='fileUpload'>파일 업로드</label>
            <input
              type='file'
              id='fileUpload'
              onChange={e => {
                if (e.target.files.length === 1)
                  return alert(
                    `6개의 파일이 필요합니다.\n확인하신 뒤 다시 업로드해 주세요.`
                  );
                fileSetting(e, fileSettingState);
              }}
              accept='.csv'
              multiple
            />
            <button
              onClick={e => training(e.target)}
              className={tab === 'LR' ? 'active' : 'lr'}>
              LR
            </button>
            <button
              onClick={e => training(e.target)}
              className={tab === 'DT' ? 'active' : 'dt'}>
              DT
            </button>
            <button
              onClick={e => training(e.target)}
              className={tab === 'SVM' ? 'active' : 'svm'}>
              SVM
            </button>
            <button
              onClick={e => training(e.target)}
              className={tab === 'DNN' ? 'active' : 'dnn'}>
              DNN
            </button>
            <button
              onClick={e => training(e.target)}
              className={tab === 'RF' ? 'active' : 'rf'}>
              RF
            </button>
            <button
              onClick={e => training(e.target)}
              className={tab === 'XGBoost' ? 'active' : 'xg'}>
              XGBoost
            </button>
            <br />
            <p className='trainGuide'>
              <span className='bold'>
                AI 학습용 데이터셋 생성{' '}
                <span className='bold highlight'>Partitioning</span>
              </span>
              에서{' '}
              <span
                className='guideToggle'
                onClick={() =>
                  setGuide(prev => {
                    const clone = { ...prev };
                    clone.btn = true;
                    return clone;
                  })
                }>
                다운로드한 파일
              </span>
              만 업로드 가능합니다.
            </p>
            <div className={`guideBox ${!guide.view ? 'none' : ''}`}>
              <span className='bold highlight'>업로드 가능 파일: </span>
              y_val.csv, y_train.csv, y_test.csv, x_val.csv, x_train.csv,{' '}
              x_test.csv
            </div>
            <DataUploadComp fileName={fileInfo.name} />
            {msg === 'download' && (
              <div className='wrap'>
                <div className='train-chart chart'>
                  <ResponsiveHeatMap
                    data={matrix.data}
                    margin={{ top: 30, right: 80, bottom: 40, left: 30 }}
                    valueFormat='> .2f'
                    axisBottom={{}}
                    axisTop={false}
                    minValue={matrix.min}
                    maxValue={matrix.max}
                    style={{
                      cursor: 'default',
                    }}
                    colors={{
                      type: 'diverging',
                      scheme: 'plasma',
                    }}
                    sliceLabelsTextColor='#333333'
                    borderWidth={1}
                    borderColor='black'
                    labelTextColor={
                      ({ data }) =>
                        data.y > (matrix.max + matrix.min) / 2
                          ? 'black'
                          : 'white'
                      // value가 Min-Max의 평균보다 클 때 노드 색상이 밝아짐
                      // value가 Min-Max의 평균보다 클 때 노드 색상이 어두워짐
                      // 따라서 가독성을 위해 value에 따라 label text color를 조작해 준다.
                    }
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
                <div className='previewTable train'>
                  <table className='exportTable'>
                    <thead>
                      <tr>{previewThead(table)}</tr>
                    </thead>
                    <tbody>
                      <tr>
                        {table.tBody.reduce((acc, item) => {
                          return (
                            <>
                              {acc}
                              <td>{item}</td>
                            </>
                          );
                        }, <></>)}
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className='downloadBtnWrap'>
                  <button onClick={() => chart2png(fileInfo, tab)}>
                    이미지 다운로드
                  </button>
                  <button onClick={() => table2csv(fileInfo, tab)}>
                    표 다운로드
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <Loading msg={msg} />
      </div>
    </section>
  );
};

export default ModelTraining;
