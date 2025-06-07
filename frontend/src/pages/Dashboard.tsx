import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Thermometer, Droplets, Wind, TrendingUp, TrendingDown, Eye, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GlowCard from '../components/GlowCard';
import TextReveal from '../components/TextReveal';
import MagneticWrapper from '../components/MagneticWrapper';

// Mock room data with enhanced properties
const mockRooms = [
  {
    id: 'room-1',
    name: 'Living Room',
    type: 'living',
    temperature: 22.5,
    targetTemperature: 22,
    humidity: 45,
    targetHumidity: 45,
    pressure: 1013.2,
    comfortScore: 85,
    status: 'optimal',
    trend: 'stable',
    position: { x: 20, y: 30 },
    airflow: 'good',
    devices: 2,
  },
  {
    id: 'room-2',
    name: 'Master Bedroom',
    type: 'bedroom',
    temperature: 20.1,
    targetTemperature: 20,
    humidity: 52,
    targetHumidity: 50,
    pressure: 1012.8,
    comfortScore: 92,
    status: 'optimal',
    trend: 'rising',
    position: { x: 70, y: 25 },
    airflow: 'excellent',
    devices: 1,
  },
  {
    id: 'room-3',
    name: 'Kitchen',
    type: 'kitchen',
    temperature: 23.8,
    targetTemperature: 21,
    humidity: 38,
    targetHumidity: 40,
    pressure: 1014.1,
    comfortScore: 68,
    status: 'needs_attention',
    trend: 'falling',
    position: { x: 45, y: 65 },
    airflow: 'moderate',
    devices: 3,
  },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'from-emerald-400 to-emerald-600';
      case 'needs_attention': return 'from-amber-400 to-amber-600';
      case 'critical': return 'from-red-400 to-red-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="w-4 h-4" />;
      case 'falling': return <TrendingDown className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getOrbSize = (comfortScore: number) => {
    return Math.max(120, (comfortScore / 100) * 200);
  };

  const generateAirflowPath = (startX: number, startY: number, endX: number, endY: number) => {
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;
    const offset = 20;
    return `M ${startX} ${startY} Q ${midX + offset} ${midY - offset} ${endX} ${endY}`;
  };

  return (
    <div className="relative min-h-screen p-6">
      {/* Header */}
      <motion.div
        className="max-w-7xl mx-auto mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <TextReveal 
          text="Climate Canvas"
          className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2"
          glowColor="rgba(34, 197, 94, 0.6)"
          delay={0.5}
        />
        <motion.p 
          className="text-lg text-gray-600 dark:text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          Your home's atmosphere in motion
        </motion.p>
      </motion.div>

      {/* Kinetic Room Grid */}
      <div className="relative max-w-7xl mx-auto">
        <motion.div 
          className="relative h-[70vh] min-h-[500px] glass-panel p-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Background Grid Pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-10 dark:opacity-5">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Airflow Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {mockRooms.map((room, index) => 
              mockRooms.slice(index + 1).map((targetRoom) => (
                <motion.path
                  key={`${room.id}-${targetRoom.id}`}
                  d={generateAirflowPath(
                    (room.position.x / 100) * 100,
                    (room.position.y / 100) * 100,
                    (targetRoom.position.x / 100) * 100,
                    (targetRoom.position.y / 100) * 100
                  )}
                  stroke="url(#flowGradient)"
                  strokeWidth="2"
                  fill="none"
                  className="airflow-line"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.6 }}
                  transition={{ duration: 2, delay: index * 0.3 }}
                />
              ))
            )}
            <defs>
              <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.8)" />
                <stop offset="50%" stopColor="rgba(34, 197, 94, 0.8)" />
                <stop offset="100%" stopColor="rgba(168, 85, 247, 0.8)" />
              </linearGradient>
            </defs>
          </svg>

          {/* Room Orbs */}
          {mockRooms.map((room, index) => {
            const orbSize = getOrbSize(room.comfortScore);
            const isHovered = hoveredRoom === room.id;

            return (
              <div
                key={room.id}
                className="absolute cursor-pointer"
                style={{
                  left: `${room.position.x}%`,
                  top: `${room.position.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <MagneticWrapper 
                  strength={0.4} 
                  range={120}
                >
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: 1, 
                      opacity: 1,
                      rotate: [0, 360],
                    }}
                    transition={{ 
                      duration: 0.8, 
                      delay: index * 0.2,
                      rotate: { duration: 20, repeat: Infinity, ease: 'linear' }
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onMouseEnter={() => setHoveredRoom(room.id)}
                    onMouseLeave={() => setHoveredRoom(null)}
                    onClick={() => navigate(`/room/${room.id}`)}
                  >
                {/* Main Orb */}
                <motion.div
                  className={`room-orb ${getStatusColor(room.status)} animate-orb-float`}
                  style={{
                    width: `${orbSize}px`,
                    height: `${orbSize}px`,
                    background: `conic-gradient(from 0deg, ${
                      room.status === 'optimal' 
                        ? 'rgba(16, 185, 129, 0.3), rgba(34, 197, 94, 0.6), rgba(16, 185, 129, 0.3)'
                        : room.status === 'needs_attention'
                        ? 'rgba(251, 191, 36, 0.3), rgba(245, 158, 11, 0.6), rgba(251, 191, 36, 0.3)'
                        : 'rgba(239, 68, 68, 0.3), rgba(220, 38, 38, 0.6), rgba(239, 68, 68, 0.3)'
                    })`,
                    filter: `drop-shadow(0 0 ${isHovered ? '30px' : '20px'} ${
                      room.status === 'optimal' ? 'rgba(16, 185, 129, 0.5)' :
                      room.status === 'needs_attention' ? 'rgba(251, 191, 36, 0.5)' :
                      'rgba(239, 68, 68, 0.5)'
                    })`,
                  }}
                >
                  {/* Inner Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                    <h3 className="font-semibold text-sm md:text-base mb-2 text-center">
                      {room.name}
                    </h3>
                    
                    {/* Temperature Display */}
                    <div className="flex items-center space-x-1 mb-2">
                      <Thermometer className="w-4 h-4" />
                      <span className="text-lg font-bold">{room.temperature}°C</span>
                      {getTrendIcon(room.trend)}
                    </div>

                    {/* Comfort Score */}
                    <div className="text-xs opacity-80 mb-1">
                      Comfort: {room.comfortScore}%
                    </div>

                    {/* Additional Metrics */}
                    <div className="flex items-center space-x-3 text-xs opacity-70">
                      <div className="flex items-center space-x-1">
                        <Droplets className="w-3 h-3" />
                        <span>{room.humidity}%</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Wind className="w-3 h-3" />
                        <span>{room.airflow}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pulsing Ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-white/30"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.6, 0, 0.6],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                </motion.div>

                {/* Hover Info Panel */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 glass-panel p-4 min-w-[200px] z-10"
                      initial={{ opacity: 0, y: -10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="text-sm text-gray-800 dark:text-gray-200">
                        <div className="font-semibold mb-2">{room.name}</div>
                        <div className="space-y-1">
                          <div>Target: {room.targetTemperature}°C</div>
                          <div>Humidity: {room.humidity}% (target: {room.targetHumidity}%)</div>
                          <div>Pressure: {room.pressure} hPa</div>
                          <div>Devices: {room.devices} active</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                  </motion.div>
                </MagneticWrapper>
              </div>
            );
          })}
        </motion.div>

        {/* System Overview */}
        <motion.div
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {/* Overall Comfort */}
          <GlowCard 
            className="glass-panel p-6"
            glowColor="rgba(34, 197, 94, 0.4)"
            intensity={1.2}
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Overall Comfort</h3>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {Math.round(mockRooms.reduce((sum, room) => sum + room.comfortScore, 0) / mockRooms.length)}%
                </p>
              </div>
            </div>
          </GlowCard>

          {/* Active Devices */}
          <GlowCard 
            className="glass-panel p-6"
            glowColor="rgba(59, 130, 246, 0.4)"
            intensity={1.2}
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Active Devices</h3>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {mockRooms.reduce((sum, room) => sum + room.devices, 0)}
                </p>
              </div>
            </div>
          </GlowCard>

          {/* Energy Flow */}
          <GlowCard 
            className="glass-panel p-6"
            glowColor="rgba(147, 51, 234, 0.4)"
            intensity={1.2}
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center">
                <Wind className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Air Quality</h3>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  Excellent
                </p>
              </div>
            </div>
          </GlowCard>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard; 