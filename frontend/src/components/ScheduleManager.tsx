import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MetallicPaint from './MetallicPaint';
import LetterGlitch from './LetterGlitch';

interface Schedule {
  id: string;
  name: string;
  time: string;
  temperature: number;
  days: string[];
  enabled: boolean;
  room: string;
}

interface ScheduleManagerProps {
  onClose: () => void;
}

const ScheduleManager: React.FC<ScheduleManagerProps> = ({ onClose }) => {
  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      id: '1',
      name: 'Morning Comfort',
      time: '07:00',
      temperature: 72,
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      enabled: true,
      room: 'Living Room'
    },
    {
      id: '2',
      name: 'Night Sleep',
      time: '22:00',
      temperature: 68,
      days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      enabled: true,
      room: 'Master Bedroom'
    },
    {
      id: '3',
      name: 'Afternoon Cool',
      time: '14:00',
      temperature: 70,
      days: ['Sat', 'Sun'],
      enabled: false,
      room: 'Home Office'
    }
  ]);

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newSchedule, setNewSchedule] = useState<Partial<Schedule>>({
    name: '',
    time: '08:00',
    temperature: 72,
    days: [],
    room: 'Living Room'
  });

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const rooms = ['Living Room', 'Master Bedroom', 'Kitchen', 'Home Office', 'Bathroom', 'Guest Room'];

  const toggleSchedule = (id: string) => {
    setSchedules(prev => prev.map(schedule => 
      schedule.id === id ? { ...schedule, enabled: !schedule.enabled } : schedule
    ));
  };

  const deleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(schedule => schedule.id !== id));
  };

  const toggleDay = (day: string) => {
    const currentDays = newSchedule.days || [];
    if (currentDays.includes(day)) {
      setNewSchedule(prev => ({
        ...prev,
        days: currentDays.filter(d => d !== day)
      }));
    } else {
      setNewSchedule(prev => ({
        ...prev,
        days: [...currentDays, day]
      }));
    }
  };

  const addSchedule = () => {
    if (newSchedule.name && newSchedule.days && newSchedule.days.length > 0) {
      const schedule: Schedule = {
        id: Date.now().toString(),
        name: newSchedule.name,
        time: newSchedule.time || '08:00',
        temperature: newSchedule.temperature || 72,
        days: newSchedule.days,
        enabled: true,
        room: newSchedule.room || 'Living Room'
      };
      
      setSchedules(prev => [...prev, schedule]);
      setNewSchedule({
        name: '',
        time: '08:00',
        temperature: 72,
        days: [],
        room: 'Living Room'
      });
      setIsAddingNew(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <MetallicPaint className="bg-gray-900 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <LetterGlitch 
            text="Schedule Manager"
            className="text-3xl font-bold text-white"
            intensity={0.05}
          />
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Existing Schedules */}
        <div className="space-y-4 mb-8">
          {schedules.map((schedule, index) => (
            <motion.div
              key={schedule.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <MetallicPaint className="bg-gray-800 rounded-2xl p-6 border border-gray-600">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">{schedule.name}</h3>
                        <p className="text-sm text-gray-400">{schedule.room}</p>
                      </div>
                      <div className="text-2xl font-bold text-cyan-400">{schedule.time}</div>
                      <div className="text-xl font-bold text-orange-400">{schedule.temperature}°F</div>
                    </div>
                    
                    <div className="flex space-x-2 mt-3">
                      {daysOfWeek.map(day => (
                        <span
                          key={day}
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            schedule.days.includes(day)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-700 text-gray-400'
                          }`}
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleSchedule(schedule.id)}
                      className={`relative w-14 h-8 rounded-full transition-colors ${
                        schedule.enabled 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                          : 'bg-gray-600'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                          schedule.enabled ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    
                    <button
                      onClick={() => deleteSchedule(schedule.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </MetallicPaint>
            </motion.div>
          ))}
        </div>

        {/* Add New Schedule */}
        {!isAddingNew ? (
          <div className="text-center">
            <button
              onClick={() => setIsAddingNew(true)}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold py-3 px-8 rounded-2xl hover:from-cyan-700 hover:to-blue-700 transition-all"
            >
              <LetterGlitch text="+ Add New Schedule" intensity={0.03} />
            </button>
          </div>
        ) : (
          <MetallicPaint className="bg-gray-800 rounded-2xl p-6 border border-gray-600">
            <h3 className="text-xl font-bold text-white mb-4">
              <LetterGlitch text="New Schedule" intensity={0.03} />
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Schedule Name */}
              <div>
                <label className="block text-gray-300 mb-2">Schedule Name</label>
                <input
                  type="text"
                  value={newSchedule.name || ''}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-gray-700 text-white rounded-xl px-4 py-3 border border-gray-600 focus:border-cyan-500 focus:outline-none"
                  placeholder="e.g., Morning Routine"
                />
              </div>

              {/* Room Selection */}
              <div>
                <label className="block text-gray-300 mb-2">Room</label>
                <select
                  value={newSchedule.room || 'Living Room'}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, room: e.target.value }))}
                  className="w-full bg-gray-700 text-white rounded-xl px-4 py-3 border border-gray-600 focus:border-cyan-500 focus:outline-none"
                >
                  {rooms.map(room => (
                    <option key={room} value={room}>{room}</option>
                  ))}
                </select>
              </div>

              {/* Time */}
              <div>
                <label className="block text-gray-300 mb-2">Time</label>
                <input
                  type="time"
                  value={newSchedule.time || '08:00'}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full bg-gray-700 text-white rounded-xl px-4 py-3 border border-gray-600 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {/* Temperature */}
              <div>
                <label className="block text-gray-300 mb-2">Temperature</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="60"
                    max="85"
                    value={newSchedule.temperature || 72}
                    onChange={(e) => setNewSchedule(prev => ({ ...prev, temperature: parseInt(e.target.value) }))}
                    className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xl font-bold text-orange-400 w-16">
                    {newSchedule.temperature || 72}°F
                  </span>
                </div>
              </div>
            </div>

            {/* Days Selection */}
            <div className="mt-6">
              <label className="block text-gray-300 mb-3">Days of Week</label>
              <div className="flex space-x-2">
                {daysOfWeek.map(day => (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      (newSchedule.days || []).includes(day)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4 mt-6">
              <button
                onClick={addSchedule}
                disabled={!newSchedule.name || !newSchedule.days || newSchedule.days.length === 0}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LetterGlitch text="Save Schedule" intensity={0.03} />
              </button>
              
              <button
                onClick={() => {
                  setIsAddingNew(false);
                  setNewSchedule({
                    name: '',
                    time: '08:00',
                    temperature: 72,
                    days: [],
                    room: 'Living Room'
                  });
                }}
                className="px-8 bg-gray-700 text-gray-300 font-semibold py-3 rounded-xl hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </MetallicPaint>
        )}
      </MetallicPaint>
    </div>
  );
};

export default ScheduleManager; 