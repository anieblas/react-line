import React, { useState, useEffect, useCallback } from 'react';
import { useMachine } from '@xstate/react';
import { trafficLightMachine } from './trafficLightMachine';
import './TrafficLight.css';

interface TransitionHistory {
  from: string;
  to: string;
  timestamp: Date;
  reason: string;
}

const TrafficLight: React.FC = () => {
  const [state, send] = useMachine(trafficLightMachine, {});
  const [transitionHistory, setTransitionHistory] = useState<TransitionHistory[]>([]);
  const [weatherCondition, setWeatherCondition] = useState<'normal' | 'rain' | 'fog'>('normal');
  const [showHistory, setShowHistory] = useState(false);

  // Track state transitions
  const getTransitionReason = useCallback((): string => {
    if (state.matches('emergency') || state.matches('emergency_flash_off')) return 'emergency';
    if (state.matches('pedestrian_green')) return 'pedestrian_request';
    if (state.matches('fault')) return 'fault_detected';
    return 'normal';
  }, [state]);

  useEffect(() => {
    const newTransition: TransitionHistory = {
      from: 'previous',
      to: state.value.toString(),
      timestamp: new Date(),
      reason: getTransitionReason(),
    };

    setTransitionHistory(prev => [newTransition, ...prev.slice(0, 9)]); // Keep last 10
  }, [state.value, getTransitionReason]);

  const getLightColor = (light: string) => {
    if (state.matches('emergency') || state.matches('emergency_flash_off')) {
      return 'emergency';
    }
    if (state.matches('fault')) {
      return 'fault';
    }
    if (state.matches('pedestrian_green')) {
      return 'pedestrian';
    }
    return state.matches(light) ? 'active' : 'inactive';
  };

  const handleEmergency = () => {
    if (state.matches('emergency') || state.matches('emergency_flash_off')) {
      send({ type: 'CLEAR_EMERGENCY' });
    } else {
      send({ type: 'EMERGENCY' });
    }
  };

  const handleFault = () => {
    if (state.matches('fault')) {
      send({ type: 'RESET_FAULT' });
    } else {
      send({ type: 'FAULT' });
    }
  };

  const handleWeatherChange = (condition: 'normal' | 'rain' | 'fog') => {
    setWeatherCondition(condition);
    // In a real implementation, this would send an event to the machine
    // For demo purposes, we'll just update the local state
  };

  const getWeatherTiming = () => {
    switch (weatherCondition) {
      case 'rain': return { red: 4000, yellow: 1000, green: 4000 };
      case 'fog': return { red: 5000, yellow: 1000, green: 5000 };
      default: return { red: 3000, yellow: 1000, green: 3000 };
    }
  };

  const currentTiming = getWeatherTiming();

  return (
    <div className="traffic-light-container">
      <div className="traffic-light">
        <div className={`light red ${getLightColor('red')}`}></div>
        <div className={`light yellow ${getLightColor('yellow')}`}></div>
        <div className={`light green ${getLightColor('green')}`}></div>
        {state.matches('pedestrian_green') && (
          <div className="pedestrian-signal">
            <div className="pedestrian-walk active">🚶</div>
          </div>
        )}
      </div>

      <div className="controls">
        <h3>Advanced Traffic Light State Machine</h3>
        <p>Current State: <strong className={`state-${state.value}`}>{state.value.toString()}</strong></p>

        <div className="status-indicators">
          <div className="status-item">
            <span className="status-label">Weather:</span>
            <span className="status-value">{weatherCondition}</span>
          </div>
          <div className="status-item">
            <span className="status-label">Timing:</span>
            <span className="status-value">R:{currentTiming.red/1000}s Y:{currentTiming.yellow/1000}s G:{currentTiming.green/1000}s</span>
          </div>
        </div>

        <div className="buttons">
          <button onClick={() => send({ type: 'NEXT' })}>Next (Auto)</button>
          <button onClick={() => send({ type: 'MANUAL_RED' })}>Force Red</button>
          <button onClick={() => send({ type: 'MANUAL_YELLOW' })}>Force Yellow</button>
          <button onClick={() => send({ type: 'MANUAL_GREEN' })}>Force Green</button>
        </div>

        <div className="advanced-controls">
          <h4>Advanced Features</h4>

          <div className="control-group">
            <button
              onClick={handleEmergency}
              className={`emergency-btn ${state.matches('emergency') || state.matches('emergency_flash_off') ? 'active' : ''}`}
            >
              🚨 {state.matches('emergency') || state.matches('emergency_flash_off') ? 'Clear Emergency' : 'Emergency Mode'}
            </button>
          </div>

          <div className="control-group">
            <button
              onClick={handleFault}
              className={`fault-btn ${state.matches('fault') ? 'active' : ''}`}
            >
              ⚠️ {state.matches('fault') ? 'Reset Fault' : 'Simulate Fault'}
            </button>
          </div>

          <div className="control-group">
            <label>Weather Conditions:</label>
            <div className="weather-buttons">
              <button
                onClick={() => handleWeatherChange('normal')}
                className={weatherCondition === 'normal' ? 'active' : ''}
              >
                ☀️ Normal
              </button>
              <button
                onClick={() => handleWeatherChange('rain')}
                className={weatherCondition === 'rain' ? 'active' : ''}
              >
                🌧️ Rain
              </button>
              <button
                onClick={() => handleWeatherChange('fog')}
                className={weatherCondition === 'fog' ? 'active' : ''}
              >
                🌫️ Fog
              </button>
            </div>
          </div>

          <div className="control-group">
            <button onClick={() => send({ type: 'PEDESTRIAN_REQUEST' })}>
              🚶 Pedestrian Request
            </button>
            {state.matches('pedestrian_green') && (
              <button onClick={() => send({ type: 'PEDESTRIAN_DONE' })}>
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
          <div className="transition-history">
            <h4>State Transition History</h4>
            <div className="history-list">
              {transitionHistory.map((transition, index) => (
                <div key={index} className="history-item">
                  <span className="timestamp">
                    {transition.timestamp.toLocaleTimeString()}
                  </span>
                  <span className="transition">
                    {transition.from} → {transition.to}
                  </span>
                  <span className={`reason reason-${transition.reason}`}>
                    {transition.reason}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="info">
          <p><strong>🚦 State Machine Features:</strong></p>
          <ul>
            <li>Automatic cycling with weather-adjusted timing</li>
            <li>Emergency mode with flashing override</li>
            <li>Pedestrian crossing coordination</li>
            <li>Fault detection and recovery</li>
            <li>Weather condition adaptation</li>
            <li>Complete transition history tracking</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TrafficLight;