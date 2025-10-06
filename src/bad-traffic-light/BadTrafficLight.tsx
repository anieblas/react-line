import React, { useState, useEffect, useRef } from 'react';
import './BadTrafficLight.css';

type LightState = 'red' | 'yellow' | 'green' | 'pedestrian_green' | 'emergency' | 'emergency_flash_off' | 'fault';

const BadTrafficLight: React.FC = () => {
  // Multiple state variables - hard to manage
  const [currentLight, setCurrentLight] = useState<LightState>('red');
  const [isEmergency, setIsEmergency] = useState(false);
  const [isFault, setIsFault] = useState(false);
  const [isPedestrianMode, setIsPedestrianMode] = useState(false);
  const [weatherCondition, setWeatherCondition] = useState<'normal' | 'rain' | 'fog'>('normal');
  const [showHistory, setShowHistory] = useState(false);
  const [transitionHistory, setTransitionHistory] = useState<string[]>([]);

  // Refs for timers - can cause memory leaks (using number for browser setTimeout)
  const redTimerRef = useRef<number | undefined>(undefined);
  const yellowTimerRef = useRef<number | undefined>(undefined);
  const greenTimerRef = useRef<number | undefined>(undefined);
  const pedestrianTimerRef = useRef<number | undefined>(undefined);
  const emergencyTimerRef = useRef<number | undefined>(undefined);

  // Complex useEffect with many dependencies - prone to bugs
  useEffect(() => {
    // Clear all existing timers first (race condition potential)
    if (redTimerRef.current) window.clearTimeout(redTimerRef.current);
    if (yellowTimerRef.current) window.clearTimeout(yellowTimerRef.current);
    if (greenTimerRef.current) window.clearTimeout(greenTimerRef.current);
    if (pedestrianTimerRef.current) window.clearTimeout(pedestrianTimerRef.current);
    if (emergencyTimerRef.current) window.clearTimeout(emergencyTimerRef.current);

    // Complex nested conditionals - hard to read and maintain
    if (isFault) {
      setCurrentLight('fault');
      return;
    }

    if (isEmergency) {
      setCurrentLight('emergency');
      // Flashing logic - duplicated and error-prone
      const flash = () => {
        setCurrentLight(prev => prev === 'emergency' ? 'emergency_flash_off' : 'emergency');
      };
      emergencyTimerRef.current = window.setInterval(flash, 500);
      return;
    }

    if (isPedestrianMode) {
      setCurrentLight('pedestrian_green');
      // Pedestrian timer
      pedestrianTimerRef.current = window.setTimeout(() => {
        setIsPedestrianMode(false);
        setCurrentLight('red');
        startRedTimer();
      }, 8000);
      return;
    }

    // Normal cycling logic - duplicated and complex
    const startRedTimer = () => {
      const timing = getWeatherTiming();
      redTimerRef.current = window.setTimeout(() => {
        if (!isEmergency && !isFault && !isPedestrianMode) {
          setCurrentLight('green');
          startGreenTimer();
        }
      }, timing.red);
    };

    const startGreenTimer = () => {
      const timing = getWeatherTiming();
      greenTimerRef.current = window.setTimeout(() => {
        if (!isEmergency && !isFault && !isPedestrianMode) {
          setCurrentLight('yellow');
          startYellowTimer();
        }
      }, timing.green);
    };

    const startYellowTimer = () => {
      const timing = getWeatherTiming();
      yellowTimerRef.current = window.setTimeout(() => {
        if (!isEmergency && !isFault && !isPedestrianMode) {
          setCurrentLight('red');
          startRedTimer();
        }
      }, timing.yellow);
    };

    // Start the cycle based on current state
    if (currentLight === 'red' && !isEmergency && !isFault && !isPedestrianMode) {
      startRedTimer();
    } else if (currentLight === 'green' && !isEmergency && !isFault && !isPedestrianMode) {
      startGreenTimer();
    } else if (currentLight === 'yellow' && !isEmergency && !isFault && !isPedestrianMode) {
      startYellowTimer();
    }

  }, [currentLight, isEmergency, isFault, isPedestrianMode, weatherCondition]); // Too many dependencies!

  // Another useEffect for history - more complexity
  useEffect(() => {
    const newEntry = `${new Date().toLocaleTimeString()}: ${currentLight}`;
    setTransitionHistory(prev => [newEntry, ...prev.slice(0, 9)]);
  }, [currentLight]);

  // Helper function - but still complex
  const getWeatherTiming = () => {
    switch (weatherCondition) {
      case 'rain': return { red: 4000, yellow: 1000, green: 4000 };
      case 'fog': return { red: 5000, yellow: 1000, green: 5000 };
      default: return { red: 3000, yellow: 1000, green: 3000 };
    }
  };

  // Event handlers - lots of imperative logic
  const handleNext = () => {
    if (isEmergency || isFault) return; // Guard clauses everywhere

    if (currentLight === 'red') {
      setCurrentLight('green');
    } else if (currentLight === 'green') {
      setCurrentLight('yellow');
    } else if (currentLight === 'yellow') {
      setCurrentLight('red');
    }
  };

  const handleManualRed = () => {
    if (isEmergency || isFault) return;
    setCurrentLight('red');
  };

  const handleManualYellow = () => {
    if (isEmergency || isFault) return;
    setCurrentLight('yellow');
  };

  const handleManualGreen = () => {
    if (isEmergency || isFault) return;
    setCurrentLight('green');
  };

  const handleEmergency = () => {
    if (isEmergency) {
      setIsEmergency(false);
      setCurrentLight('red');
    } else {
      setIsEmergency(true);
    }
  };

  const handleFault = () => {
    if (isFault) {
      setIsFault(false);
      setCurrentLight('red');
    } else {
      setIsFault(true);
    }
  };

  const handlePedestrianRequest = () => {
    if (!isEmergency && !isFault) {
      setIsPedestrianMode(true);
    }
  };

  const handlePedestrianDone = () => {
    setIsPedestrianMode(false);
    setCurrentLight('red');
  };

  // Complex rendering logic
  const getLightClass = (light: string) => {
    if (isEmergency && (currentLight === 'emergency' || currentLight === 'emergency_flash_off')) {
      return 'emergency';
    }
    if (isFault) {
      return 'fault';
    }
    if (isPedestrianMode) {
      return 'pedestrian';
    }
    return currentLight === light ? 'active' : 'inactive';
  };

  const currentTiming = getWeatherTiming();

  // Cleanup on unmount - easy to forget
  useEffect(() => {
    return () => {
      if (redTimerRef.current) window.clearTimeout(redTimerRef.current);
      if (yellowTimerRef.current) window.clearTimeout(yellowTimerRef.current);
      if (greenTimerRef.current) window.clearTimeout(greenTimerRef.current);
      if (pedestrianTimerRef.current) window.clearTimeout(pedestrianTimerRef.current);
      if (emergencyTimerRef.current) window.clearInterval(emergencyTimerRef.current);
    };
  }, []);

  return (
    <div className="bad-traffic-light-container">
      <div className="bad-traffic-light">
        <div className={`light red ${getLightClass('red')}`}></div>
        <div className={`light yellow ${getLightClass('yellow')}`}></div>
        <div className={`light green ${getLightClass('green')}`}></div>
        {isPedestrianMode && (
          <div className="pedestrian-signal">
            <div className="pedestrian-walk active">🚶</div>
          </div>
        )}
      </div>

      <div className="bad-controls">
        <h3>❌ Bad Implementation (Imperative)</h3>
        <p>Current State: <strong className={`state-${currentLight}`}>{currentLight}</strong></p>

        <div className="bad-status-indicators">
          <div className="status-item">
            <span className="status-label">Weather:</span>
            <span className="status-value">{weatherCondition}</span>
          </div>
          <div className="status-item">
            <span className="status-label">Timing:</span>
            <span className="status-value">R:{currentTiming.red/1000}s Y:{currentTiming.yellow/1000}s G:{currentTiming.green/1000}s</span>
          </div>
        </div>

        <div className="bad-buttons">
          <button onClick={handleNext}>Next (Auto)</button>
          <button onClick={handleManualRed}>Force Red</button>
          <button onClick={handleManualYellow}>Force Yellow</button>
          <button onClick={handleManualGreen}>Force Green</button>
        </div>

        <div className="bad-advanced-controls">
          <h4>Advanced Features (Complex Logic)</h4>

          <div className="control-group">
            <button
              onClick={handleEmergency}
              className={`emergency-btn ${isEmergency ? 'active' : ''}`}
            >
              🚨 {isEmergency ? 'Clear Emergency' : 'Emergency Mode'}
            </button>
          </div>

          <div className="control-group">
            <button
              onClick={handleFault}
              className={`fault-btn ${isFault ? 'active' : ''}`}
            >
              ⚠️ {isFault ? 'Reset Fault' : 'Simulate Fault'}
            </button>
          </div>

          <div className="control-group">
            <label>Weather Conditions:</label>
            <div className="weather-buttons">
              <button
                onClick={() => setWeatherCondition('normal')}
                className={weatherCondition === 'normal' ? 'active' : ''}
              >
                ☀️ Normal
              </button>
              <button
                onClick={() => setWeatherCondition('rain')}
                className={weatherCondition === 'rain' ? 'active' : ''}
              >
                🌧️ Rain
              </button>
              <button
                onClick={() => setWeatherCondition('fog')}
                className={weatherCondition === 'fog' ? 'active' : ''}
              >
                🌫️ Fog
              </button>
            </div>
          </div>

          <div className="control-group">
            <button onClick={handlePedestrianRequest} disabled={isEmergency || isFault}>
              🚶 Pedestrian Request
            </button>
            {isPedestrianMode && (
              <button onClick={handlePedestrianDone}>
                ✅ Pedestrian Done
              </button>
            )}
          </div>

          <div className="control-group">
            <button onClick={() => setShowHistory(!showHistory)}>
              📊 {showHistory ? 'Hide' : 'Show'} Transition History
            </button>
          </div>
        </div>

        {showHistory && (
          <div className="bad-transition-history">
            <h4>State Transition History</h4>
            <div className="history-list">
              {transitionHistory.map((entry, index) => (
                <div key={index} className="history-item">
                  {entry}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bad-info">
          <p><strong>🚨 Problems with this approach:</strong></p>
          <ul>
            <li>Multiple useState hooks - hard to coordinate</li>
            <li>Complex useEffect with many dependencies</li>
            <li>Race conditions with timers</li>
            <li>Nested conditionals everywhere</li>
            <li>Hard to test and debug</li>
            <li>Difficult to add new features</li>
            <li>No clear state transition diagram</li>
            <li>Memory leaks from forgotten cleanup</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BadTrafficLight;