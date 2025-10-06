import { createMachine } from 'xstate';

export const trafficLightMachine = createMachine({
  id: 'trafficLight',
  initial: 'red',
  states: {
    red: {
      on: {
        NEXT: 'green',
        MANUAL_RED: 'red',
        MANUAL_YELLOW: 'yellow',
        MANUAL_GREEN: 'green'
      },
      after: {
        3000: 'green' // Auto transition after 3 seconds
      }
    },
    yellow: {
      on: {
        NEXT: 'red',
        MANUAL_RED: 'red',
        MANUAL_YELLOW: 'yellow',
        MANUAL_GREEN: 'green'
      },
      after: {
        1000: 'red' // Auto transition after 1 second
      }
    },
    green: {
      on: {
        NEXT: 'yellow',
        MANUAL_RED: 'red',
        MANUAL_YELLOW: 'yellow',
        MANUAL_GREEN: 'green'
      },
      after: {
        3000: 'yellow' // Auto transition after 3 seconds
      }
    }
  }
});