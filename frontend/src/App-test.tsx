import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ReactBitsDashboard from './pages/ReactBitsDashboard';
import ReactBitsSettings from './pages/ReactBitsSettings';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Temporary: No Silk background to test */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-900 via-gray-900 to-indigo-900"></div>

      {/* Test message */}
      <div className="fixed top-4 left-4 bg-green-500 text-black px-4 py-2 rounded z-50">
        🎉 APP IS LOADING! Silk will be added back...
      </div>

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