import { Link } from "react-router-dom";

const SideBar = () => {

  return (
    <section className="side-bar">
      <div className="inner column">
        <div className="top-area"></div>
        <nav>
          <ul className="column">
            <li><Link to="/">MINING CLOUD</Link></li>
            <li><Link to="/normalization">데이터 정규화</Link></li>
            <li><Link to="/analysis">변수 분석 및 선택</Link></li>
            <li><Link to="/featuremap">AI 학습용 데이터셋 생성</Link></li>
            <li><Link to="/training">모델 학습 및 검증</Link></li>
          </ul>
        </nav>
        <footer>
          <p className="copyright">Copyright &copy; 2022 MINING CLOUD</p>
        </footer>
      </div>
    </section>
  );
};

export default SideBar;
