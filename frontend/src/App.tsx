import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Silk from './components/Silk';
import SplashCursor from './components/SplashCursor';
import ReactBitsDashboard from './pages/ReactBitsDashboard';
import ReactBitsSettings from './pages/ReactBitsSettings';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Beautiful Silk Background */}
      <Silk 
        speed={3}
        scale={1.2}
        color="#2a1a3e"
        noiseIntensity={1.8}
        rotation={0.1}
        className="fixed inset-0 -z-10"
      />

      {/* Interactive Cursor Effect */}
      <SplashCursor 
        SPLAT_RADIUS={0.15}
        SPLAT_FORCE={4000}
        DENSITY_DISSIPATION={2.5}
        VELOCITY_DISSIPATION={1.8}
        COLOR_UPDATE_SPEED={15}
        TRANSPARENT={true}
        BACK_COLOR={{ r: 0.1, g: 0.05, b: 0.2 }}
      />

      {/* Main Application Routes */}
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<ReactBitsDashboard />} />
          <Route path="/dashboard" element={<ReactBitsDashboard />} />
          <Route path="/settings" element={<ReactBitsSettings />} />
        </Routes>
      </div>
    </div>
  );
}

export default App; 