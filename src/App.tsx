import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import TrafficLightPage from './traffic-light/TrafficLightPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/traffic-light" element={<TrafficLightPage />} />
      </Routes>
    </Router>
  );
}

export default App;
