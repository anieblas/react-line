import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import TrafficLightPage from './traffic-light/TrafficLightPage';
import BadTrafficLightPage from './bad-traffic-light/BadTrafficLightPage';
import WorstTrafficLightPage from './worst-traffic-light/WorstTrafficLightPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/traffic-light" element={<TrafficLightPage />} />
        <Route path="/bad-traffic-light" element={<BadTrafficLightPage />} />
        <Route path="/worst-traffic-light" element={<WorstTrafficLightPage />} />
      </Routes>
    </Router>
  );
}

export default App;
