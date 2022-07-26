import { useState, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { RiMenu4Fill } from 'react-icons/ri';

const SideBar = () => {
  const location = useLocation().pathname;
  const [menuBtn, setMenuBtn] = useState(false);

  // 사이드바가 아닌 다른 구역을 클릭했을 때 menuBtn을 false로 변경해 주는 코드
  const outClick = e => {
    for (let p of e.path) {
      if (p.className === 'side-bar true') return;
    }
    window.removeEventListener('click', outClick);
    setMenuBtn(false);
  };
  useEffect(() => {
    if (menuBtn) window.addEventListener('click', outClick);
  }, [menuBtn]);

  return (
    <>
      <section className={`side-bar ${menuBtn}`}>
        <div className='inner column'>
          <div className='top-area'></div>
          <nav>
            <ul className='column'>
              <li className={location === '/' ? 'active' : ''}>
                <Link to='/'>MINING CLOUD</Link>
              </li>
              <li className={location === '/normalization' ? 'active' : ''}>
                <Link to='/normalization'>데이터 정규화</Link>
              </li>
              <li className={location === '/analysis' ? 'active' : ''}>
                <Link to='/analysis'>변수 분석 및 선택</Link>
              </li>
              <li className={location === '/featuremap' ? 'active' : ''}>
                <Link to='/featuremap'>AI 학습용 데이터셋 생성</Link>
              </li>
              <li className={location === '/training' ? 'active' : ''}>
                <Link to='/training'>모델 학습 및 검증</Link>
              </li>
            </ul>
          </nav>
          <footer>
            <p className='copyright'>Copyright &copy; 2022 MINING CLOUD</p>
          </footer>
        </div>
      </section>
      <button
        onClick={e => {
          setMenuBtn(!menuBtn);
          e.stopPropagation();
        }}
        className={`menuBtn`}>
        <RiMenu4Fill />
      </button>
    </>
  );
};

export default memo(SideBar);
