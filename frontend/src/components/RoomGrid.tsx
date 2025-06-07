import React from 'react';
import { motion } from 'framer-motion';
import MetallicPaint from './MetallicPaint';
import LetterGlitch from './LetterGlitch';

interface Room {
  image: string;
  title: string;
  subtitle: string;
  handle: string;
  borderColor: string;
  gradient: string;
  temperature: number;
  humidity: number;
  status: string;
}

interface RoomGridProps {
  rooms: Room[];
  onRoomClick: (room: Room) => void;
}

const RoomGrid: React.FC<RoomGridProps> = ({ rooms, onRoomClick }) => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room, index) => (
        <motion.div
          key={room.handle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onRoomClick(room)}
          className="cursor-pointer"
        >
          <MetallicPaint className="bg-gray-900 rounded-3xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 group">
            {/* Room Image */}
            <div 
              className="w-full h-32 rounded-2xl mb-4 flex items-center justify-center text-white font-bold text-xl relative overflow-hidden"
              style={{ 
                backgroundImage: room.gradient,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div 
                className="absolute inset-0"
                dangerouslySetInnerHTML={{ __html: room.image.replace('data:image/svg+xml,', '').replace(/%3C/g, '<').replace(/%3E/g, '>').replace(/%20/g, ' ').replace(/%27/g, "'").replace(/%22/g, '"').replace(/%23/g, '#').replace(/%3A/g, ':').replace(/%2F/g, '/') }}
              />
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="text-white font-semibold text-sm"
                >
                  Click for Details
                </motion.div>
              </div>
            </div>

            {/* Room Info */}
            <div className="space-y-3">
              <div>
                <LetterGlitch 
                  text={room.title}
                  className="text-xl font-bold text-white"
                  intensity={0.02}
                />
                <div className={`text-sm font-medium ${getStatusColor(room.status)}`}>
                  {room.status.toUpperCase()}
                </div>
              </div>

              {/* Temperature & Humidity */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">{room.temperature}°F</div>
                  <div className="text-xs text-gray-400">Temperature</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{room.humidity}%</div>
                  <div className="text-xs text-gray-400">Humidity</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex space-x-2 pt-2">
                <div className="flex-1 bg-gray-800 rounded-xl px-3 py-2 text-center text-xs text-gray-300">
                  Zone {room.handle.split('-')[1]}
                </div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl px-4 py-2 text-center text-xs text-white font-semibold"
                >
                  Control
                </motion.div>
              </div>
            </div>
          </MetallicPaint>
        </motion.div>
      ))}
    </div>
  );
};

export default RoomGrid; 