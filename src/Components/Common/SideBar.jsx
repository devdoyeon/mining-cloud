import { useState, useEffect, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { RiMenu4Fill } from "react-icons/ri";

const SideBar = () => {
    const location = useLocation().pathname;
    const [menuBtn, setMenuBtn] = useState("close");

    // 사이드바가 아닌 다른 구역을 클릭했을 때 menuBtn을 false로 변경해 주는 코드
    const outClick = (e) => {
        for (let p of e.path || (e.composedPath && e.composedPath())) {
            if (p.className === "side-bar open") return;
        }
        window.removeEventListener("click", outClick);
        setMenuBtn("close");
    };
    useEffect(() => {
        if (menuBtn === "open") window.addEventListener("click", outClick);
    }, [menuBtn]);

    return (
        <>
            <section className={`side-bar ${menuBtn}`}>
                <div className="inner column">
                    <div className="top-area"></div>
                    <nav>
                        <ul className="column">
                            <li className={location === "/" ? "active" : ""}>
                                <Link to="/">HOME</Link>
                            </li>
                            <li className={location === "/preprocessing" ? "active" : ""}>
                                <Link to="/preprocessing">데이터 전처리</Link>
                            </li>
                            <li className={location === "/normalization" ? "active" : ""}>
                                <Link to="/normalization">데이터 정규화</Link>
                            </li>
                            <li className={location === "/analysis" ? "active" : ""}>
                                <Link to="/analysis">변수 분석 및 선택</Link>
                            </li>
                            <li className={location === "/featureMap" ? "active" : ""}>
                                <Link to="/featureMap">AI 학습용 데이터셋 생성</Link>
                            </li>
                            <li className={location === "/training" ? "active" : ""}>
                                <Link to="/training">모델 학습 및 검증</Link>
                            </li>
                        </ul>
                    </nav>
                    <footer>
                        <p className="copyright">Copyright &copy; 2022 MINING CLOUD</p>
                    </footer>
                </div>
            </section>
            <button
                onClick={(e) => {
                    setMenuBtn("open");
                    e.stopPropagation();
                }}
                className={`menuBtn ${menuBtn}`}
            >
                <RiMenu4Fill />
            </button>
        </>
    );
};

export default memo(SideBar);
