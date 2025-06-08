import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './index.css';

// Simple test component first
function TestDashboard() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
          🎉 HVAC SYSTEM WORKING!
        </h1>
        <p className="text-2xl text-green-400">✅ React is rendering successfully</p>
        <p className="text-xl text-blue-400">✅ Router is working</p>
        <p className="text-lg text-yellow-400 mt-4">Next: Add Silk background component</p>
        <div className="mt-8 text-sm text-gray-400">
          Current time: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Routes>
        <Route path="/" element={<TestDashboard />} />
        <Route path="/dashboard" element={<TestDashboard />} />
      </Routes>
    </div>
  );
}

export default App; 