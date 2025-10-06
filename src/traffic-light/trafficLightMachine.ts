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
        MANUAL_GREEN: 'green',
        PEDESTRIAN_REQUEST: 'pedestrian_green',
        EMERGENCY: 'emergency',
        FAULT: 'fault',
      },
      after: {
        3000: 'green'
      }
    },
    yellow: {
      on: {
        NEXT: 'red',
        MANUAL_RED: 'red',
        MANUAL_YELLOW: 'yellow',
        MANUAL_GREEN: 'green',
        EMERGENCY: 'emergency',
        FAULT: 'fault',
      },
      after: {
        1000: 'red'
      }
    },
    green: {
      on: {
        NEXT: 'yellow',
        MANUAL_RED: 'red',
        MANUAL_YELLOW: 'yellow',
        MANUAL_GREEN: 'green',
        PEDESTRIAN_REQUEST: 'pedestrian_green',
        EMERGENCY: 'emergency',
        FAULT: 'fault',
      },
      after: {
        3000: 'yellow'
      }
    },
    pedestrian_green: {
      on: {
        PEDESTRIAN_DONE: 'red',
        EMERGENCY: 'emergency',
        FAULT: 'fault',
      },
      after: {
        8000: 'red', // Give pedestrians 8 seconds to cross
      },
    },
    emergency: {
      on: {
        CLEAR_EMERGENCY: 'red',
      },
      after: {
        500: 'emergency_flash_off',
      },
    },
    emergency_flash_off: {
      on: {
        CLEAR_EMERGENCY: 'red',
      },
      after: {
        500: 'emergency',
      },
    },
    fault: {
      on: {
        RESET_FAULT: 'red',
      },
    },
  }
});