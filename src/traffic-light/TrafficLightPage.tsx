import React from 'react';
import { Link } from 'react-router-dom';
import TrafficLight from './TrafficLight';

const TrafficLightPage: React.FC = () => {
  return (
    <div className="page">
      <nav className="nav">
        <Link to="/" className="nav-link">← Back to Home</Link>
      </nav>
      <div className="page-content">
        <h1>Traffic Light State Machine</h1>
        <TrafficLight />
      </div>
    </div>
  );
};

export default TrafficLightPage;