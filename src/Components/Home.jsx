import { Link } from 'react-router-dom';
import icon01 from 'image/icon01.png';
import icon02 from 'image/icon02.png';
import icon03 from 'image/icon03.png';
import icon04 from 'image/icon04.png';
import Header from './Common/Header';
import SideBar from './Common/SideBar';

const Home = () => {
  return (
    <section className='dashboard-home content-container'>
      <SideBar />
      <div>
        <Header />
        <div className='content-wrap'>
          <h2 className='bold'>MINING CLOUD DASHBOARD</h2>
          <div className='row'>
            <div className='linkBox'>
              <Link to='/normalization' className='medium'>
                데이터 정규화 바로가기
              </Link>
              <div>
                <figure className='row'>
                  <img src={icon01} alt='데이터 정규화 아이콘' />
                </figure>
              </div>
              <p>정규화, 스케일링, 분위수 변환</p>
            </div>
            <div className='linkBox'>
              <Link to='/analysis' className='medium'>
                변수 분석 및 선택
              </Link>
              <div>
                <figure className='row'>
                  <img src={icon02} alt='분류 모델 학습 및 검증 아이콘' />
                </figure>
              </div>
              <p>상관분석, 교차분석, CART 분석</p>
            </div>
            <div className='linkBox'>
              <Link to='/featuremap' className='medium'>
                AI 학습용 데이터셋 생성
              </Link>
              <div>
                <figure className='row'>
                  <img src={icon03} alt='AI 학습용 데이터셋 생성 아이콘' />
                </figure>
              </div>
              <p>Data Partitioning</p>
            </div>
            <div className='linkBox'>
              <Link to='/training' className='medium'>
                모델 학습 및 검증
              </Link>
              <div>
                <figure className='row'>
                  <img src={icon04} alt='모델 학습 및 검증 아이콘' />
                </figure>
              </div>
              <p>LR, DT, SVM, DNN, RF, XG</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
