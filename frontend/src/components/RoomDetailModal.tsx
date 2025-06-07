import React, { useState, useEffect } from 'react';
import MetallicPaint from './MetallicPaint';
import LetterGlitch from './LetterGlitch';
import FloatingOrbs from './FloatingOrbs';

interface RoomDetailModalProps {
  room: {
    title: string;
    temperature: number;
    humidity: number;
    status: string;
    borderColor: string;
    gradient: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const RoomDetailModal: React.FC<RoomDetailModalProps> = ({ room, isOpen, onClose }) => {
  const [targetTemp, setTargetTemp] = useState(72);
  const [fanSpeed, setFanSpeed] = useState(3);
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [isScheduled, setIsScheduled] = useState(false);

  useEffect(() => {
    if (room) {
      setTargetTemp(room.temperature);
    }
  }, [room]);

  if (!isOpen || !room) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'text-green-400';
      case 'cool': return 'text-blue-400';
      case 'warm': return 'text-orange-400';
      case 'perfect': return 'text-emerald-400';
      case 'humid': return 'text-yellow-400';
      case 'standby': return 'text-gray-400';
      default: return 'text-white';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="relative">
        {/* Floating Orbs Background */}
        <FloatingOrbs 
          count={8}
          colors={['#4FACFE', '#00F2FE', '#43E97B', '#38F9D7']}
          interactive={true}
        />
        
        <MetallicPaint className="bg-gray-900 rounded-3xl p-8 max-w-2xl w-full border border-gray-700 relative z-10">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <LetterGlitch 
                text={room.title}
                className="text-3xl font-bold text-white"
                intensity={0.05}
              />
              <div className={`text-lg mt-2 ${getStatusColor(room.status)}`}>
                Status: {room.status.toUpperCase()}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Current Readings */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <MetallicPaint className="bg-gray-800 rounded-2xl p-6 border border-gray-600">
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-400">{room.temperature}°F</div>
                <div className="text-sm text-gray-400">Current Temperature</div>
              </div>
            </MetallicPaint>
            
            <MetallicPaint className="bg-gray-800 rounded-2xl p-6 border border-gray-600">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400">{room.humidity}%</div>
                <div className="text-sm text-gray-400">Humidity Level</div>
              </div>
            </MetallicPaint>
          </div>

          {/* Temperature Control */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">
              <LetterGlitch text="Temperature Control" intensity={0.03} />
            </h3>
            <MetallicPaint className="bg-gray-800 rounded-2xl p-6 border border-gray-600">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setTargetTemp(Math.max(60, targetTemp - 1))}
                  className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-white font-bold text-xl hover:from-blue-600 hover:to-cyan-600 transition-all"
                >
                  -
                </button>
                <div className="flex-1 text-center">
                  <div className="text-3xl font-bold text-white">{targetTemp}°F</div>
                  <div className="text-sm text-gray-400">Target Temperature</div>
                </div>
                <button
                  onClick={() => setTargetTemp(Math.min(85, targetTemp + 1))}
                  className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-white font-bold text-xl hover:from-blue-600 hover:to-cyan-600 transition-all"
                >
                  +
                </button>
              </div>
            </MetallicPaint>
          </div>

          {/* Fan Speed Control */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">
              <LetterGlitch text="Fan Speed" intensity={0.03} />
            </h3>
            <MetallicPaint className="bg-gray-800 rounded-2xl p-6 border border-gray-600">
              <div className="flex items-center space-x-4">
                <label className="text-gray-300">Speed:</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={fanSpeed}
                  onChange={(e) => setFanSpeed(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xl font-bold text-green-400 w-8">{fanSpeed}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </MetallicPaint>
          </div>

          {/* Mode Controls */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <MetallicPaint className="bg-gray-800 rounded-2xl p-6 border border-gray-600">
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold">Auto Mode</span>
                <button
                  onClick={() => setIsAutoMode(!isAutoMode)}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    isAutoMode 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                      : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      isAutoMode ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </MetallicPaint>

            <MetallicPaint className="bg-gray-800 rounded-2xl p-6 border border-gray-600">
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold">Scheduled</span>
                <button
                  onClick={() => setIsScheduled(!isScheduled)}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    isScheduled 
                      ? 'bg-gradient-to-r from-purple-500 to-violet-500' 
                      : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      isScheduled ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </MetallicPaint>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <MetallicPaint className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl">
              <button className="w-full py-4 text-white font-bold text-lg">
                <LetterGlitch text="Apply Settings" intensity={0.04} />
              </button>
            </MetallicPaint>
            
            <MetallicPaint className="bg-gray-700 rounded-2xl">
              <button 
                onClick={onClose}
                className="px-8 py-4 text-gray-300 font-semibold hover:text-white transition-colors"
              >
                Cancel
              </button>
            </MetallicPaint>
          </div>
        </MetallicPaint>
      </div>
    </div>
  );
};

export default RoomDetailModal; 