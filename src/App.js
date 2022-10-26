import 'App.css';
import { Routes, Route } from 'react-router-dom';
import Home from 'Pages/Home';
import DataPreprocessing from 'Pages/DataPreprocessing';
import DataNormalization from 'Pages/DataNormalization';
import DataAnalysis from 'Pages/DataAnalysis';
import FeatureMap from 'Pages/FeatureMap';
import ModelTraining from 'Pages/ModelTraining';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/preprocessing' element={<DataPreprocessing />} />
      <Route path='/normalization' element={<DataNormalization />} />
      <Route path='/analysis' element={<DataAnalysis />} />
      <Route path='/featureMap' element={<FeatureMap />} />
      <Route path='/training' element={<ModelTraining />} />
    </Routes>
  );
}

export default App;
