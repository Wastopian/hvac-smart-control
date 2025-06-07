import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MetallicPaint from '../components/MetallicPaint';
import LetterGlitch from '../components/LetterGlitch';
import ScheduleManager from '../components/ScheduleManager';

const ReactBitsSettings: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    temperature: 72,
    humidity: 45,
    autoMode: true,
    ecoMode: false,
    nightMode: true,
    notifications: true,
    energySaving: 60
  });
  const [showScheduleManager, setShowScheduleManager] = useState(false);

  const handleSliderChange = (key: string, value: number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleToggle = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Header */}
      <div className="text-center py-8">
        <LetterGlitch 
          text="SYSTEM SETTINGS" 
          className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 bg-clip-text text-transparent"
          intensity={0.08}
          duration={0.04}
          delay={1.5}
        />
        <p className="text-lg text-gray-300 mt-4">Configure your ReactBits HVAC experience</p>
      </div>

      {/* Back Button */}
      <div className="mb-8">
        <MetallicPaint className="inline-block bg-gray-800 rounded-full px-6 py-3 border border-gray-600">
          <button
            onClick={() => navigate('/')}
            className="text-white font-semibold hover:text-cyan-400 transition-colors"
          >
            ← <LetterGlitch text="Back to Dashboard" intensity={0.02} />
          </button>
        </MetallicPaint>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Temperature Controls */}
        <MetallicPaint className="bg-gray-900 rounded-3xl p-8 border border-gray-700">
          <h3 className="text-2xl font-bold text-white mb-6">
            <LetterGlitch text="Temperature Control" intensity={0.03} />
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-3">Default Temperature</label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="60"
                  max="85"
                  value={settings.temperature}
                  onChange={(e) => handleSliderChange('temperature', parseInt(e.target.value))}
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
                />
                <span className="text-2xl font-bold text-cyan-400 w-16">
                  {settings.temperature}°F
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-3">Target Humidity</label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="30"
                  max="70"
                  value={settings.humidity}
                  onChange={(e) => handleSliderChange('humidity', parseInt(e.target.value))}
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-2xl font-bold text-blue-400 w-16">
                  {settings.humidity}%
                </span>
              </div>
            </div>
          </div>
        </MetallicPaint>

        {/* System Modes */}
        <MetallicPaint className="bg-gray-900 rounded-3xl p-8 border border-gray-700">
          <h3 className="text-2xl font-bold text-white mb-6">
            <LetterGlitch text="System Modes" intensity={0.03} />
          </h3>
          
          <div className="space-y-6">
            {[
              { key: 'autoMode', label: 'Auto Mode', color: 'text-green-400' },
              { key: 'ecoMode', label: 'Eco Mode', color: 'text-emerald-400' },
              { key: 'nightMode', label: 'Night Mode', color: 'text-indigo-400' },
              { key: 'notifications', label: 'Notifications', color: 'text-yellow-400' }
            ].map(({ key, label, color }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-gray-300">{label}</span>
                <button
                  onClick={() => handleToggle(key)}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    settings[key as keyof typeof settings] 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500' 
                      : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      settings[key as keyof typeof settings] ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </MetallicPaint>

        {/* Energy Settings */}
        <MetallicPaint className="bg-gray-900 rounded-3xl p-8 border border-gray-700">
          <h3 className="text-2xl font-bold text-white mb-6">
            <LetterGlitch text="Energy Management" intensity={0.03} />
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-3">Energy Saving Target</label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.energySaving}
                  onChange={(e) => handleSliderChange('energySaving', parseInt(e.target.value))}
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-2xl font-bold text-green-400 w-16">
                  {settings.energySaving}%
                </span>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="text-sm text-gray-400 mb-2">Current Status</div>
              <div className="text-lg font-semibold text-white">
                Saving <span className="text-green-400">23%</span> energy this month
              </div>
            </div>
          </div>
        </MetallicPaint>

        {/* System Information */}
        <MetallicPaint className="bg-gray-900 rounded-3xl p-8 border border-gray-700">
          <h3 className="text-2xl font-bold text-white mb-6">
            <LetterGlitch text="System Information" intensity={0.03} />
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Firmware Version</span>
              <span className="text-cyan-400 font-mono">v2.1.4</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Last Update</span>
              <span className="text-gray-400">2 days ago</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">System Uptime</span>
              <span className="text-green-400">15d 7h 23m</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Connected Devices</span>
              <span className="text-blue-400">6 zones</span>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-700 space-y-3">
            <button className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold py-3 rounded-xl hover:from-violet-600 hover:to-purple-700 transition-all">
              <LetterGlitch text="Check for Updates" intensity={0.02} />
            </button>
            
            <button 
              onClick={() => setShowScheduleManager(true)}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all"
            >
              <LetterGlitch text="Manage Schedules" intensity={0.02} />
            </button>
          </div>
        </MetallicPaint>
      </div>

      {/* Save Settings */}
      <div className="flex justify-center pt-8">
        <MetallicPaint className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl px-12 py-4">
          <button className="text-white font-bold text-lg">
            <LetterGlitch text="Save Configuration" intensity={0.04} />
          </button>
        </MetallicPaint>
      </div>

      {/* Schedule Manager Modal */}
      {showScheduleManager && (
        <ScheduleManager onClose={() => setShowScheduleManager(false)} />
      )}
    </div>
  );
};

export default ReactBitsSettings; 