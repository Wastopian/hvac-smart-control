import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  ArrowLeft, 
  Plus, 
  Minus, 
  Power,
  Settings,
  TrendingUp,
  Activity
} from 'lucide-react';

const RoomDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Mock room data
  const roomData = {
    'room-1': {
      name: 'Living Room',
      temperature: 22.5,
      targetTemperature: 22,
      humidity: 45,
      comfortScore: 85,
      status: 'optimal'
    },
    'room-2': {
      name: 'Master Bedroom',
      temperature: 20.1,
      targetTemperature: 20,
      humidity: 52,
      comfortScore: 92,
      status: 'optimal'
    },
    'room-3': {
      name: 'Kitchen',
      temperature: 23.8,
      targetTemperature: 21,
      humidity: 38,
      comfortScore: 68,
      status: 'needs_attention'
    }
  };
  
  const room = roomData[id as keyof typeof roomData];
  const [targetTemp, setTargetTemp] = useState(room?.targetTemperature || 20);

  if (!room) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Room not found</h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const adjustTemperature = (change: number) => {
    setTargetTemp(prev => Math.max(10, Math.min(35, prev + change)));
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => navigate('/')}
              className="p-2 rounded-lg glass-panel hover:scale-105 transition-transform"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-6 h-6" />
            </motion.button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {room.name}
              </h1>
              <p className="text-lg text-emerald-500 font-medium">
                {room.status.replace('_', ' ').toUpperCase()}
              </p>
            </div>
          </div>
          
          {/* Comfort Score Orb */}
          <motion.div
            className="relative w-24 h-24 rounded-full glass-panel flex items-center justify-center"
            style={{
              background: `conic-gradient(from 0deg, rgba(16, 185, 129, 0.3), rgba(34, 197, 94, 0.6))`,
              filter: `drop-shadow(0 0 20px rgba(16, 185, 129, 0.5))`,
            }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <div className="text-center text-white">
              <div className="text-xl font-bold">{room.comfortScore}%</div>
              <div className="text-xs opacity-80">Comfort</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Temperature Control */}
          <motion.div
            className="glass-panel p-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-full bg-gradient-to-r from-red-400 to-orange-400">
                <Thermometer className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Temperature Control
              </h3>
            </div>
            
            <div className="text-center mb-6">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current</div>
              <div className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                {room.temperature}°C
              </div>
            </div>

            <div className="flex items-center justify-center space-x-6">
              <motion.button
                onClick={() => adjustTemperature(-0.5)}
                className="p-4 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Minus className="w-6 h-6" />
              </motion.button>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                  {targetTemp}°C
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Target Temperature
                </div>
              </div>
              
              <motion.button
                onClick={() => adjustTemperature(0.5)}
                className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Plus className="w-6 h-6" />
              </motion.button>
            </div>
          </motion.div>

          {/* Environmental Data */}
          <motion.div
            className="glass-panel p-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Environment
              </h3>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Humidity</span>
                <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  {room.humidity}%
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Air Quality</span>
                <span className="text-lg font-medium text-emerald-600 dark:text-emerald-400">
                  Excellent
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Airflow</span>
                <div className="flex items-center space-x-2">
                  <Wind className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-lg font-medium text-gray-800 dark:text-gray-200">
                    Good
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <motion.button
            className="glass-panel p-6 text-center hover:scale-105 transition-transform"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Power className="w-8 h-8 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              System Power
            </span>
          </motion.button>
          
          <motion.button
            className="glass-panel p-6 text-center hover:scale-105 transition-transform"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="w-8 h-8 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              Advanced Settings
            </span>
          </motion.button>
          
          <motion.button
            className="glass-panel p-6 text-center hover:scale-105 transition-transform"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              Schedule
            </span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default RoomDetail; 