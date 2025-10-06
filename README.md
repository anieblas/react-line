# Traffic Light State Machine Example

A React application demonstrating state machine patterns using XState for managing traffic light behavior.

## Features

- **State Machine**: Uses XState to manage traffic light states (red, yellow, green)
- **Automatic Transitions**: Lights cycle automatically with realistic timing
- **Manual Controls**: Override automatic behavior with manual state changes
- **Visual Feedback**: Animated lights with glow effects
- **TypeScript**: Full TypeScript support for type safety

## State Machine Behavior

The traffic light follows these transitions:

- **Red** (3s) → **Green** (3s) → **Yellow** (1s) → **Red** (repeats)
- Manual controls allow forcing any state at any time

## Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **XState** - State machine library
- **Vite** - Build tool and dev server
- **pnpm** - Package manager

## Getting Started

### Prerequisites

- Node.js (version 20.19+ or 22.12+)
- pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run linting
pnpm lint
```

The application will be available at `http://localhost:5173/`

## Project Structure

```
src/
├── App.tsx              # Main application component
├── App.css              # Application styles
├── TrafficLight.tsx     # Traffic light component with state machine
├── trafficLightMachine.ts # XState machine definition
└── main.tsx            # Application entry point
```

## State Machine Details

The traffic light machine is defined in `trafficLightMachine.ts` and includes:

- Three states: `red`, `yellow`, `green`
- Automatic transitions with timers
- Manual override events: `NEXT`, `MANUAL_RED`, `MANUAL_YELLOW`, `MANUAL_GREEN`
- Proper state management with XState's React integration

## Learning Objectives

This example demonstrates:

- State machine design patterns
- React integration with XState
- TypeScript with complex state management
- Component composition and styling
- Event-driven programming
