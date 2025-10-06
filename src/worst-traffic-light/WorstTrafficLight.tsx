import React, { useState, useEffect, useCallback } from 'react';
import './WorstTrafficLight.css';

const WorstTrafficLight: React.FC = () => {
  // THE WORST POSSIBLE WAY: Separate boolean states for each light
  // This allows impossible states like all lights on or no lights on!
  const [redLight, setRedLight] = useState(true);
  const [yellowLight, setYellowLight] = useState(false);
  const [greenLight, setGreenLight] = useState(false);

  // Even more state variables for complex features
  const [isEmergency, setIsEmergency] = useState(false);
  const [isFault, setIsFault] = useState(false);
  const [isPedestrianMode, setIsPedestrianMode] = useState(false);
  const [weatherCondition, setWeatherCondition] = useState<'normal' | 'rain' | 'fog'>('normal');
  const [showHistory, setShowHistory] = useState(false);
  const [transitionHistory, setTransitionHistory] = useState<string[]>([]);

  // Multiple timers that can conflict - using number for browser timers
  const [redTimer, setRedTimer] = useState<number | null>(null);
  const [yellowTimer, setYellowTimer] = useState<number | null>(null);
  const [greenTimer, setGreenTimer] = useState<number | null>(null);
  const [pedestrianTimer, setPedestrianTimer] = useState<number | null>(null);
  const [emergencyTimer, setEmergencyTimer] = useState<number | null>(null);

  const getWeatherTiming = useCallback(() => {
    switch (weatherCondition) {
      case 'rain': return { red: 4000, yellow: 1000, green: 4000 };
      case 'fog': return { red: 5000, yellow: 1000, green: 5000 };
      default: return { red: 3000, yellow: 1000, green: 3000 };
    }
  }, [weatherCondition]);

  useEffect(() => {
    if (redTimer) window.clearTimeout(redTimer);
    if (yellowTimer) window.clearTimeout(yellowTimer);
    if (greenTimer) window.clearTimeout(greenTimer);
    if (pedestrianTimer) window.clearTimeout(pedestrianTimer);
    if (emergencyTimer) window.clearInterval(emergencyTimer);

    // Emergency mode - overrides everything
    if (isEmergency) {
      // This could leave lights in invalid states!
      const flash = () => {
        setRedLight(prev => !prev);
        setYellowLight(prev => !prev);
        setGreenLight(prev => !prev);
      };
      setEmergencyTimer(window.setInterval(flash, 500));
      return;
    }

    // Fault mode - who knows what state we're in?
    if (isFault) {
      setRedLight(true);
      setYellowLight(false);
      setGreenLight(false);
      return;
    }

    // Pedestrian mode - modifies existing state unpredictably
    if (isPedestrianMode) {
      setGreenLight(true); // This might conflict with other lights!
      setRedLight(false);
      setYellowLight(false);
      setPedestrianTimer(window.setTimeout(() => {
        setIsPedestrianMode(false);
        setGreenLight(false);
        setRedLight(true); // Back to red, but what if emergency happened?
      }, 8000));
      return;
    }

    // Normal cycling - extremely fragile
    if (redLight && !yellowLight && !greenLight) {
      // Red to Green transition
      const timing = getWeatherTiming();
      setRedTimer(window.setTimeout(() => {
        if (!isEmergency && !isFault && !isPedestrianMode) {
          setRedLight(false);
          setGreenLight(true);
        }
      }, timing.red));
    } else if (!redLight && !yellowLight && greenLight) {
      // Green to Yellow transition
      const timing = getWeatherTiming();
      setGreenTimer(window.setTimeout(() => {
        if (!isEmergency && !isFault && !isPedestrianMode) {
          setGreenLight(false);
          setYellowLight(true);
        }
      }, timing.green));
    } else if (!redLight && yellowLight && !greenLight) {
      // Yellow to Red transition
      const timing = getWeatherTiming();
      setYellowTimer(window.setTimeout(() => {
        if (!isEmergency && !isFault && !isPedestrianMode) {
          setYellowLight(false);
          setRedLight(true);
        }
      }, timing.yellow));
    }

    // This useEffect depends on EVERYTHING - changes constantly!
  }, [isEmergency, isFault, isPedestrianMode, weatherCondition, emergencyTimer, getWeatherTiming, greenLight, greenTimer, pedestrianTimer, redLight, redTimer, yellowLight, yellowTimer]); // Even more dependencies - this causes infinite loops!

  // History tracking - another useEffect!
  useEffect(() => {
    const state = `${redLight ? 'R' : ''}${yellowLight ? 'Y' : ''}${greenLight ? 'G' : ''}`;
    const entry = `${new Date().toLocaleTimeString()}: ${state || 'NO LIGHTS!'}`;
    setTransitionHistory(prev => [entry, ...prev.slice(0, 9)]);
  }, [redLight, yellowLight, greenLight]);

  // Remove duplicate getWeatherTiming function
  // const getWeatherTiming = () => {
  //   switch (weatherCondition) {
  //     case 'rain': return { red: 4000, yellow: 1000, green: 4000 };
  //     case 'fog': return { red: 5000, yellow: 1000, green: 5000 };
  //     default: return { red: 3000, yellow: 1000, green: 3000 };
  //   }
  // };

  // Event handlers that can break everything
  const handleNext = () => {
    if (isEmergency || isFault) return;

    // Manual state transitions - can create invalid states!
    if (redLight) {
      setRedLight(false);
      setGreenLight(true);
    } else if (greenLight) {
      setGreenLight(false);
      setYellowLight(true);
    } else if (yellowLight) {
      setYellowLight(false);
      setRedLight(true);
    }
  };

  const handleManualRed = () => {
    if (isEmergency || isFault) return;
    // This can create invalid states!
    setRedLight(true);
    setYellowLight(false);
    setGreenLight(false);
  };

  const handleManualYellow = () => {
    if (isEmergency || isFault) return;
    // Invalid state possible!
    setRedLight(false);
    setYellowLight(true);
    setGreenLight(false);
  };

  const handleManualGreen = () => {
    if (isEmergency || isFault) return;
    // Invalid state possible!
    setRedLight(false);
    setYellowLight(false);
    setGreenLight(true);
  };

  const handleEmergency = () => {
    if (isEmergency) {
      setIsEmergency(false);
      // What state are we returning to? No idea!
      setRedLight(true);
      setYellowLight(false);
      setGreenLight(false);
    } else {
      setIsEmergency(true);
    }
  };

  const handleFault = () => {
    if (isFault) {
      setIsFault(false);
      setRedLight(true);
      setYellowLight(false);
      setGreenLight(false);
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
    setGreenLight(false);
    setRedLight(true);
  };

  // Calculate current state - extremely error-prone
  const getCurrentState = () => {
    if (isEmergency) return 'emergency';
    if (isFault) return 'fault';
    if (isPedestrianMode) return 'pedestrian_green';
    if (redLight && !yellowLight && !greenLight) return 'red';
    if (!redLight && yellowLight && !greenLight) return 'yellow';
    if (!redLight && !yellowLight && greenLight) return 'green';
    return 'invalid_state'; // This should never happen... but it will!
  };

  const currentState = getCurrentState();
  const currentTiming = getWeatherTiming();

  return (
    <div className="worst-traffic-light-container">
      <div className="worst-traffic-light">
        <div className={`light red ${redLight ? 'active' : 'inactive'}`}></div>
        <div className={`light yellow ${yellowLight ? 'active' : 'inactive'}`}></div>
        <div className={`light green ${greenLight ? 'active' : 'inactive'}`}></div>
        {isPedestrianMode && (
          <div className="pedestrian-signal">
            <div className="pedestrian-walk active">🚶</div>
          </div>
        )}
      </div>

      <div className="worst-controls">
        <h3>🚨🚨 ABSOLUTELY HORRIFIC Implementation 🚨🚨</h3>
        <p>Current State: <strong className={`state-${currentState}`}>{currentState}</strong></p>

        {/* Show the boolean states - this is the problem! */}
        <div className="boolean-states">
          <h4>Boolean State Variables (The Problem!):</h4>
          <div className="state-indicators">
            <span className={`bool-indicator ${redLight ? 'true' : 'false'}`}>
              Red: {redLight ? 'true' : 'false'}
            </span>
            <span className={`bool-indicator ${yellowLight ? 'true' : 'false'}`}>
              Yellow: {yellowLight ? 'true' : 'false'}
            </span>
            <span className={`bool-indicator ${greenLight ? 'true' : 'false'}`}>
              Green: {greenLight ? 'true' : 'false'}
            </span>
          </div>
          <p className="warning">
            ❌ {redLight && yellowLight && greenLight && 'ALL LIGHTS ON!'}
            {!redLight && !yellowLight && !greenLight && 'NO LIGHTS ON!'}
            {redLight && yellowLight && !greenLight && 'RED + YELLOW!'}
            {redLight && !yellowLight && greenLight && 'RED + GREEN!'}
            {!redLight && yellowLight && greenLight && 'YELLOW + GREEN!'}
          </p>
        </div>

        <div className="worst-status-indicators">
          <div className="status-item">
            <span className="status-label">Weather:</span>
            <span className="status-value">{weatherCondition}</span>
          </div>
          <div className="status-item">
            <span className="status-label">Timing:</span>
            <span className="status-value">R:{currentTiming.red/1000}s Y:{currentTiming.yellow/1000}s G:{currentTiming.green/1000}s</span>
          </div>
        </div>

        <div className="worst-buttons">
          <button onClick={handleNext}>Next (Auto)</button>
          <button onClick={handleManualRed}>Force Red</button>
          <button onClick={handleManualYellow}>Force Yellow</button>
          <button onClick={handleManualGreen}>Force Green</button>
        </div>

        <div className="worst-advanced-controls">
          <h4>Advanced Features (Even More Complex!)</h4>

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
          <div className="worst-transition-history">
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

        <div className="worst-info">
          <p><strong>💀 WHY THIS IS ABSOLUTELY HORRIFIC:</strong></p>
          <ul>
            <li><strong>Invalid States Possible:</strong> All lights on, no lights on, multiple lights on simultaneously</li>
            <li><strong>No Type Safety:</strong> Boolean flags allow impossible combinations</li>
            <li><strong>Race Conditions:</strong> Multiple timers can conflict and overwrite each other</li>
            <li><strong>Unpredictable Behavior:</strong> State can become corrupted with no way to recover</li>
            <li><strong>Extremely Hard to Debug:</strong> Which combination of booleans represents which state?</li>
            <li><strong>No State Transitions:</strong> Impossible to track or visualize state changes</li>
            <li><strong>Memory Leaks:</strong> Timers not properly cleaned up</li>
            <li><strong>Complex Logic Everywhere:</strong> Every component needs to check multiple conditions</li>
            <li><strong>Impossible to Test:</strong> How do you test all possible boolean combinations?</li>
            <li><strong>No Single Source of Truth:</strong> State is scattered across multiple variables</li>
          </ul>
          <p className="comparison">
            <strong>🚦 Good State Machine:</strong> 1 state variable, 7 valid states, clear transitions<br/>
            <strong>❌ This Horror:</strong> 3+ state variables, infinite invalid states, chaos
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorstTrafficLight;