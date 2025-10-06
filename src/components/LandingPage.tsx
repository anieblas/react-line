import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <header className="hero">
        <h1>Design Patterns in React</h1>
        <p>Interactive examples of software design patterns implemented with React and TypeScript</p>
      </header>

      <main className="examples-grid">
        <div className="example-card">
          <div className="example-icon">🚦</div>
          <h3>State Machine</h3>
          <p>Traffic light state machine using XState for managing complex state transitions</p>
          <Link to="/traffic-light" className="example-link">
            View Example →
          </Link>
        </div>

        <div className="example-card coming-soon">
          <div className="example-icon">🔄</div>
          <h3>Observer Pattern</h3>
          <p>Coming soon...</p>
        </div>

        <div className="example-card coming-soon">
          <div className="example-icon">🏗️</div>
          <h3>Builder Pattern</h3>
          <p>Coming soon...</p>
        </div>

        <div className="example-card coming-soon">
          <div className="example-icon">🎯</div>
          <h3>Strategy Pattern</h3>
          <p>Coming soon...</p>
        </div>
      </main>

      <footer className="footer">
        <p>Built with React, TypeScript, and modern design patterns</p>
      </footer>
    </div>
  );
};

export default LandingPage;