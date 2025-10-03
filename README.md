# Some Nerdy Running Stats Page 📊

A comprehensive React TypeScript application for analyzing running data with a modern tabbed interface. This app demonstrates advanced React patterns, state management, analytics integration, and real-time data visualization.

## ✨ Features

### 🏃 Multi-Perspective Content

- **"Why I Hate Running"** - Humorous take on running struggles
- **"Why I Love Running"** - Positive aspects of running
- **Activity Analyzer** - Upload and analyze TCX files with detailed statistics
- **Settings** - Customize app appearance and theme

### 📊 Advanced Data Analysis

- **TCX File Upload** - Support for Garmin/GPS running data files
- **Route Visualization** - Interactive maps with Leaflet.js showing your running routes
- **Detailed Statistics** - Distance, pace, heart rate, elevation, cadence analysis
- **Real-time Processing** - Parse GPS trackpoints, calculate metrics, and display results

### 🎨 Dynamic Theming & UI

- **Color Picker** - Ring-shaped color selector with vibrant color palette
- **Dynamic Icons** - Emoji icons with color filtering (currently showing original colors)
- **Responsive Design** - Adaptive layout with mobile-friendly interface
- **Glassmorphism UI** - Modern design with backdrop blur effects

### 🔧 Advanced Interactions

- **Folder-Style Tabs** - Clean tabbed interface with active state indicators
- **Interactive Side Panel** - Detailed views with slide animations
- **Smart Filtering** - Real-time table filtering with result counting
- **Map Controls** - Reset view functionality with smart visibility

### 📈 Analytics & State Management

- **React Sweet State** - Global state management with actions and hooks
- **Comprehensive Analytics** - Track user interactions, file uploads, and navigation
- **State Persistence** - Maintain app state across tab switches and interactions

## 🛠 Tech Stack

- **React 18** with TypeScript
- **React Sweet State** for global state management
- **Leaflet.js** for interactive maps
- **CSS3** with custom properties and animations
- **Modern ES6+** with async/await patterns

## 📁 Project Structure

```
src/
├── components/
│   ├── ActivityAnalyzer.tsx    # TCX file upload and analysis
│   ├── AppButton.tsx          # Reusable tab button component
│   ├── AppSettings.tsx        # Settings panel with color picker
│   ├── AppTable.tsx           # Data table with filtering
│   ├── ColorPicker.tsx        # Ring-shaped color picker
│   ├── FileUpload.tsx         # Drag & drop file upload
│   ├── FilterInput.tsx        # Table filtering component
│   ├── FitFileStats.tsx       # Detailed statistics display
│   ├── Icon.tsx               # Reusable icon component
│   ├── Map.tsx                # Interactive route map
│   ├── SidePanel.tsx          # Detailed view panel
│   └── StatsSummary.tsx       # Statistics summary cards
├── hooks/
│   └── useStateActions.ts     # Custom hook for state actions
├── providers/
│   └── analyticsProvider.ts   # Analytics logging service
├── store/
│   └── appStore.ts            # React Sweet State store
├── utils/
│   └── runningContent.ts      # Static content and utilities
├── App.tsx                    # Main application component
├── App.css                    # Global styles and animations
└── index.tsx                  # Application entry point
```

## 🚀 Getting Started

### Prerequisites

This project uses **Yarn** as the package manager:

```bash
npm install -g yarn
```

### Installation & Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd running-sucks-app
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Start development server**

   ```bash
   yarn start
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📋 Available Scripts

| Command      | Description                 |
| ------------ | --------------------------- |
| `yarn start` | Start development server    |
| `yarn build` | Build for production        |
| `yarn test`  | Run test suite              |
| `yarn eject` | Eject from Create React App |

## 🎯 Key Features Explained

### TCX File Analysis

Upload GPS running data files (.tcx format) to get:

- **Route Mapping** - See your actual running path on an interactive map
- **Performance Metrics** - Distance, pace, heart rate, elevation gain
- **Detailed Breakdowns** - Lap-by-lap analysis with cadence data

### Dynamic Theming

- **Color Picker** - Choose from vibrant colors (80-100% saturation)
- **Real-time Updates** - Theme changes apply instantly across the app
- **CSS Custom Properties** - Efficient color management system

### Smart UI Interactions

- **Context-Aware Side Panel** - Shows different content based on current tab
- **Intelligent Filtering** - Filter table data with live result counts
- **Responsive Maps** - Auto-fit routes with manual reset capability

## 📊 Analytics Events

The app tracks comprehensive user interactions:

- **Navigation**: Tab changes, settings access
- **File Operations**: Upload start/success/error events
- **Map Interactions**: Route resets and view changes
- **UI Interactions**: Button clicks, row selections, filter usage

Check browser console to see analytics in action.

## 🎨 Design Features

- **Glassmorphism** - Backdrop blur effects and transparency
- **Smooth Animations** - CSS transitions and keyframe animations
- **Dark Theme** - Professional dark interface with accent colors
- **Mobile Responsive** - Adaptive layout for all screen sizes
- **Custom Scrollbars** - Auto-hiding scrollbars with smooth transitions

## 🔧 State Management

Uses React Sweet State with:

- **Centralized Store** - Single source of truth for app state
- **Action-Based Updates** - Predictable state mutations
- **Analytics Integration** - Actions trigger analytics events
- **Type Safety** - Full TypeScript integration

## 🗺 Map Integration

- **Leaflet.js** - Professional mapping library
- **OpenStreetMap** - Free, open-source map tiles
- **Route Visualization** - GPS trackpoints rendered as polylines
- **Interactive Controls** - Zoom, pan, and reset functionality
- **Custom Markers** - Start/end point indicators

## 📱 Responsive Design

Optimized for:

- **Desktop** - Full feature set with side-by-side layouts
- **Tablet** - Stacked components with touch-friendly controls
- **Mobile** - Compact interface with gesture support

## 🔍 Browser Support

- **Modern Browsers** - Chrome, Firefox, Safari, Edge
- **ES6+ Features** - Async/await, arrow functions, destructuring
- **CSS Grid & Flexbox** - Modern layout techniques

## 🤝 Contributing

This is a demonstration project showcasing modern React development patterns. Feel free to explore the code and adapt patterns for your own projects.

## 📚 Learn More

- [React Documentation](https://reactjs.org/)
- [React Sweet State](https://github.com/atlassian/react-sweet-state)
- [Leaflet.js](https://leafletjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Create React App](https://create-react-app.dev/)

---

_Built with ❤️ using React, TypeScript, and modern web technologies_
