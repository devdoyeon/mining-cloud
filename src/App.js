import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "Components/Home";
import DataPreprocessing from "Components/DataPreprocessing";
import DataNormalization from "Components/DataNormalization";
import DataAnalysis from "Components/DataAnalysis";
import FeatureMap from "./Components/FeatureMap";
import ModelTraining from "Components/ModelTraining";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/preprocessing" element={<DataPreprocessing />} />
            <Route path="/normalization" element={<DataNormalization />} />
            <Route path="/analysis" element={<DataAnalysis />} />
            <Route path="/featureMap" element={<FeatureMap />} />
            <Route path="/training" element={<ModelTraining />} />
        </Routes>
    );
}

export default App;
