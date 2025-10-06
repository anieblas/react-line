# Design Patterns in React

A collection of interactive examples demonstrating software design patterns implemented with React, TypeScript, and modern state management libraries.

## Current Examples

### 🚦 State Machine Pattern
**Traffic Light State Machine** - Interactive traffic light simulation using XState for managing complex state transitions.

- **Location**: `/traffic-light`
- **Features**: Automatic cycling, manual controls, visual feedback
- **Technologies**: XState, React Hooks

## Project Structure

```
src/
├── components/
│   └── LandingPage.tsx      # Main landing page with example links
├── traffic-light/
│   ├── TrafficLight.tsx     # Traffic light component
│   ├── TrafficLight.css     # Traffic light specific styles
│   ├── TrafficLightPage.tsx # Page wrapper for traffic light example
│   └── trafficLightMachine.ts # XState machine definition
├── App.tsx                  # Main app with routing
├── App.css                  # Global styles (landing page, navigation)
└── main.tsx                # Application entry point
```

## Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **XState** - State machine library
- **React Router** - Client-side routing
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

## Adding New Examples

To add a new design pattern example:

1. Create a new folder under `src/` (e.g., `src/observer-pattern/`)
2. Create your components and logic files
3. Create a page component (e.g., `ObserverPatternPage.tsx`)
4. Add a route in `App.tsx`
5. Add a card to the landing page in `LandingPage.tsx`

## Contributing

This project serves as a learning resource for design patterns in React. Feel free to contribute additional examples or improvements!
