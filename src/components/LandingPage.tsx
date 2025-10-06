import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <header className="hero">
        <h1>Design Patterns</h1>
      </header>

      <main className="patterns-container">
        <section className="pattern-group">
          <h2 className="pattern-title">🚦 State Machine Pattern</h2>
          <p className="pattern-description">
            Learn why state machines are superior for complex state management. Compare XState implementation with anti-patterns that lead to bugs and maintenance nightmares.
          </p>

          <div className="examples-grid">
            <div className="example-card good-example">
              <div className="example-icon">✅</div>
              <h3>XState State Machine</h3>
              <p>Proper state machine implementation with XState - finite states, clear transitions, type safety, and predictable behavior</p>
              <Link to="/traffic-light" className="example-link">
                View State Machine →
              </Link>
            </div>

            <div className="example-card bad-example">
              <div className="example-icon">❌</div>
              <h3>Anti-Pattern: Imperative Logic</h3>
              <p>Traditional React hooks approach - complex useEffect chains, race conditions, memory leaks, and unpredictable state</p>
              <Link to="/bad-traffic-light" className="example-link">
                View Anti-Pattern →
              </Link>
            </div>

            <div className="example-card worst-example">
              <div className="example-icon">💀</div>
              <h3>Anti-Pattern: Boolean State</h3>
              <p>Separate boolean variables - allows impossible states, infinite loops, and complete state corruption</p>
              <Link to="/worst-traffic-light" className="example-link">
                View Horror Show →
              </Link>
            </div>
          </div>
        </section>

        <section className="pattern-group">
          <h2 className="pattern-title">🔄 Behavioral Patterns</h2>
          <p className="pattern-description">
            Patterns that define communication between objects and classes
          </p>

          <div className="examples-grid">
            <div className="example-card coming-soon">
              <div className="example-icon">�️</div>
              <h3>Observer Pattern</h3>
              <p>Coming soon...</p>
            </div>

            <div className="example-card coming-soon">
              <div className="example-icon">🚫</div>
              <h3>Null Object Pattern</h3>
              <p>Coming soon...</p>
            </div>
          </div>
        </section>

        <section className="pattern-group">
          <h2 className="pattern-title">🏗️ Creational Patterns</h2>
          <p className="pattern-description">
            Patterns that deal with object creation mechanisms
          </p>

          <div className="examples-grid">
            <div className="example-card coming-soon">
              <div className="example-icon">🔨</div>
              <h3>Builder Pattern</h3>
              <p>Coming soon...</p>
            </div>
          </div>
        </section>

        <section className="pattern-group">
          <h2 className="pattern-title">🎯 Strategy Patterns</h2>
          <p className="pattern-description">
            Patterns that enable selecting an algorithm at runtime
          </p>

          <div className="examples-grid">
            <div className="example-card coming-soon">
              <div className="example-icon">🎯</div>
              <h3>Strategy Pattern</h3>
              <p>Coming soon...</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>Built with React, TypeScript, and modern design patterns</p>
      </footer>
    </div>
  );
};

export default LandingPage;