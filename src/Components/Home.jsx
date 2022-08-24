import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Common/Header';
import SideBar from './Common/SideBar';
import icon00 from 'image/icon00.png';
import icon01 from 'image/icon01.png';
import icon02 from 'image/icon02.png';
import icon03 from 'image/icon03.png';
import icon04 from 'image/icon04.png';

const Home = () => {
  useEffect(() => {
    document.title = 'MINING CLOUD';
  }, []);

  return (
    <section className='dashboard-home content-container'>
      <SideBar />
      <div>
        <Header />
        <div className='content-wrap'>
          <h2 className='bold'>MINING CLOUD DASHBOARD</h2>
          <div className='row'>
            <div className='linkBox'>
              <Link to='/preprocessing' className='medium'>
                <span>데이터 전처리</span>
                <div>
                  <figure className='row'>
                    <img src={icon00} alt='데이터 전처리 아이콘' />
                  </figure>
                </div>
                <p>데이터 제거/삭제, 채우기/보간</p>
              </Link>
            </div>
            <div className='linkBox'>
              <Link to='/normalization' className='medium'>
                <span>데이터 정규화</span>
                <div>
                  <figure className='row'>
                    <img src={icon01} alt='데이터 정규화 아이콘' />
                  </figure>
                </div>
                <p>정규화, 스케일링, 분위수 변환</p>
              </Link>
            </div>
            <div className='linkBox'>
              <Link to='/analysis' className='medium'>
                <span>변수 분석 및 선택</span>
                <div>
                  <figure className='row'>
                    <img src={icon02} alt='분류 모델 학습 및 검증 아이콘' />
                  </figure>
                </div>
                <p>상관분석, 교차분석, CART 분석</p>
              </Link>
            </div>
          </div>
          <div className='row'>
            <div className='linkBox'>
              <Link to='/featureMap' className='medium'>
                <span>AI 학습용 데이터셋 생성</span>
                <div>
                  <figure className='row'>
                    <img src={icon03} alt='AI 학습용 데이터셋 생성 아이콘' />
                  </figure>
                </div>
                <p>Data Balancing & Partitioning</p>
              </Link>
            </div>
            <div className='linkBox'>
              <Link to='/training' className='medium'>
                <span>모델 학습 및 검증</span>
                <div>
                  <figure className='row'>
                    <img src={icon04} alt='모델 학습 및 검증 아이콘' />
                  </figure>
                </div>
                <p>LR, DT, SVM, DNN, RF, XGBoost</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
