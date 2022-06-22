import { Route, Routes } from "react-router-dom";

import Home from "./Home";
import DataNormalization from "./DataNormalization";
import FeatureMap from "./FeatureMap";
import DataAnalysis from "./DataAnalysis";
import ModelTraining from "./ModelTraining";

const Solution = () => {

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/normalization" element={<DataNormalization />} />
            <Route path='/analysis' element={<DataAnalysis />} />
            <Route path="/featuremap" element={<FeatureMap />} />
            <Route path='/training' element={<ModelTraining />} />
        </Routes>
    )

}

export default Solution;