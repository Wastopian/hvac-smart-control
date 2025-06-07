import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MetallicPaint from '../components/MetallicPaint';
import LetterGlitch from '../components/LetterGlitch';
import RoomDetailModal from '../components/RoomDetailModal';
import RoomGrid from '../components/RoomGrid';

// Mock HVAC data with ReactBits styling
const hvacRooms = [
  {
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23667eea' width='400' height='300'/%3E%3Cpath fill='%23764ba2' d='M200 150L300 100L300 200Z'/%3E%3Ctext x='200' y='160' text-anchor='middle' fill='white' font-size='20'%3ELiving%3C/text%3E%3C/svg%3E",
    title: "Living Room",
    subtitle: "72°F • Optimal",
    handle: "HVAC-001",
    borderColor: "#667eea",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    temperature: 72,
    humidity: 45,
    status: "optimal"
  },
  {
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23f093fb' width='400' height='300'/%3E%3Cpath fill='%23f5576c' d='M200 150L100 100L100 200Z'/%3E%3Ctext x='200' y='160' text-anchor='middle' fill='white' font-size='20'%3EBedroom%3C/text%3E%3C/svg%3E",
    title: "Master Bedroom",
    subtitle: "68°F • Cool",
    handle: "HVAC-002",
    borderColor: "#f093fb",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    temperature: 68,
    humidity: 40,
    status: "cool"
  },
  {
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%234facfe' width='400' height='300'/%3E%3Cpath fill='%2300f2fe' d='M200 150L300 250L100 250Z'/%3E%3Ctext x='200' y='160' text-anchor='middle' fill='white' font-size='18'%3EKitchen%3C/text%3E%3C/svg%3E",
    title: "Kitchen",
    subtitle: "75°F • Warm",
    handle: "HVAC-003",
    borderColor: "#4facfe",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    temperature: 75,
    humidity: 50,
    status: "warm"
  },
  {
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%2343e97b' width='400' height='300'/%3E%3Cpath fill='%2338f9d7' d='M150 100L250 100L200 200Z'/%3E%3Ctext x='200' y='160' text-anchor='middle' fill='white' font-size='20'%3EOffice%3C/text%3E%3C/svg%3E",
    title: "Home Office",
    subtitle: "70°F • Perfect",
    handle: "HVAC-004",
    borderColor: "#43e97b",
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    temperature: 70,
    humidity: 42,
    status: "perfect"
  },
  {
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23fa709a' width='400' height='300'/%3E%3Cpath fill='%23fee140' d='M100 150L300 150L200 250Z'/%3E%3Ctext x='200' y='160' text-anchor='middle' fill='white' font-size='18'%3EBathroom%3C/text%3E%3C/svg%3E",
    title: "Bathroom",
    subtitle: "73°F • Humid",
    handle: "HVAC-005",
    borderColor: "#fa709a",
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    temperature: 73,
    humidity: 65,
    status: "humid"
  },
  {
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23a8edea' width='400' height='300'/%3E%3Cpath fill='%23fed6e3' d='M200 100L250 200L150 200Z'/%3E%3Ctext x='200' y='160' text-anchor='middle' fill='%23333' font-size='18'%3EGuest%3C/text%3E%3C/svg%3E",
    title: "Guest Room",
    subtitle: "69°F • Standby",
    handle: "HVAC-006",
    borderColor: "#a8edea",
    gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    temperature: 69,
    humidity: 38,
    status: "standby"
  }
];

const ReactBitsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [systemStats, setSystemStats] = useState({
    totalRooms: 6,
    activeZones: 4,
    energyUsage: 2.4,
    efficiency: 92
  });
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomData, setRoomData] = useState(hvacRooms);

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        ...prev,
        energyUsage: 2.2 + Math.random() * 0.6,
        efficiency: 90 + Math.random() * 5
      }));

      // Update room data with slight variations
      setRoomData(prev => prev.map(room => ({
        ...room,
        temperature: Math.round((room.temperature + (Math.random() - 0.5) * 0.5) * 10) / 10,
        humidity: Math.max(30, Math.min(70, room.humidity + Math.floor((Math.random() - 0.5) * 4)))
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRoomClick = (room: any) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
  };

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Header with Glitch Effect */}
      <div className="text-center py-8">
        <LetterGlitch 
          text="SMART HVAC CONTROL" 
          className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
          intensity={0.1}
          duration={0.03}
          delay={2}
        />
        <p className="text-xl text-gray-300 mt-4">ReactBits Powered Climate Management</p>
      </div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <MetallicPaint className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">{systemStats.totalRooms}</div>
            <div className="text-sm text-gray-400">Total Rooms</div>
          </div>
        </MetallicPaint>

        <MetallicPaint className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">{systemStats.activeZones}</div>
            <div className="text-sm text-gray-400">Active Zones</div>
          </div>
        </MetallicPaint>

        <MetallicPaint className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">{systemStats.energyUsage.toFixed(1)}kW</div>
            <div className="text-sm text-gray-400">Energy Usage</div>
          </div>
        </MetallicPaint>

        <MetallicPaint className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">{systemStats.efficiency.toFixed(0)}%</div>
            <div className="text-sm text-gray-400">Efficiency</div>
          </div>
        </MetallicPaint>
      </div>

      {/* Room Controls Grid */}
      <div className="relative">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          <LetterGlitch text="Room Controls" intensity={0.05} />
        </h2>
        
        <RoomGrid 
          rooms={roomData}
          onRoomClick={handleRoomClick}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-center mt-12">
        <MetallicPaint className="bg-gray-800 rounded-full px-8 py-4 border border-gray-600">
          <button
            onClick={() => navigate('/settings')}
            className="text-white font-semibold hover:text-blue-400 transition-colors"
          >
            <LetterGlitch text="System Settings" intensity={0.03} />
          </button>
        </MetallicPaint>
      </div>

      {/* Room Detail Modal */}
      <RoomDetailModal
        room={selectedRoom}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default ReactBitsDashboard; 