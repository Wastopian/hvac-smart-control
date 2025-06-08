import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function TestApp() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-green-400 mb-4">
          🎉 REACT IS WORKING!
        </h1>
        <p className="text-2xl text-blue-400">✅ Minimal test successful!</p>
        <p className="text-lg text-yellow-400 mt-4">Ready to add back components...</p>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<TestApp />); 