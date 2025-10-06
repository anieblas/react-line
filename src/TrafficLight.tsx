import React from 'react';
import { useMachine } from '@xstate/react';
import { trafficLightMachine } from './trafficLightMachine';

const TrafficLight: React.FC = () => {
  const [state, send] = useMachine(trafficLightMachine);

  const getLightColor = (light: string) => {
    return state.matches(light) ? 'active' : 'inactive';
  };

  return (
    <div className="traffic-light-container">
      <div className="traffic-light">
        <div className={`light red ${getLightColor('red')}`}></div>
        <div className={`light yellow ${getLightColor('yellow')}`}></div>
        <div className={`light green ${getLightColor('green')}`}></div>
      </div>

      <div className="controls">
        <h3>Traffic Light State Machine</h3>
        <p>Current State: <strong>{state.value.toString()}</strong></p>

        <div className="buttons">
          <button onClick={() => send({ type: 'NEXT' })}>Next (Auto)</button>
          <button onClick={() => send({ type: 'MANUAL_RED' })}>Force Red</button>
          <button onClick={() => send({ type: 'MANUAL_YELLOW' })}>Force Yellow</button>
          <button onClick={() => send({ type: 'MANUAL_GREEN' })}>Force Green</button>
        </div>

        <div className="info">
          <p>Auto transitions: Red → Green (3s) → Yellow (3s) → Red (1s)</p>
          <p>Manual controls override auto transitions</p>
        </div>
      </div>
    </div>
  );
};

export default TrafficLight;