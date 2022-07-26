import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from 'Components/Home';
import DataAnalysis from 'Components/DataAnalysis';
import FeatureMap from './Components/FeatureMap';
import ModelTraining from 'Components/ModelTraining';
import DataNormalization from 'Components/DataNormalization';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/normalization' element={<DataNormalization />} />
      <Route path='/analysis' element={<DataAnalysis />} />
      <Route path='/featuremap' element={<FeatureMap />} />
      <Route path='/training' element={<ModelTraining />} />
    </Routes>
  );
}

export default App;
