import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Wifi, 
  Shield, 
  Bell, 
  Moon, 
  Sun,
  Thermometer,
  Database,
  Activity
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Settings: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [autoMode, setAutoMode] = useState(true);
  const [energySaving, setEnergySaving] = useState(false);

  const settingSections = [
    {
      title: 'Appearance',
      icon: isDark ? Moon : Sun,
      items: [
        {
          label: 'Dark Mode',
          description: 'Switch between light and dark themes',
          type: 'toggle',
          value: isDark,
          onChange: toggleTheme,
        },
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        {
          label: 'Push Notifications',
          description: 'Receive alerts about system status',
          type: 'toggle',
          value: notifications,
          onChange: () => setNotifications(!notifications),
        },
      ]
    },
    {
      title: 'System Control',
      icon: SettingsIcon,
      items: [
        {
          label: 'Auto Mode',
          description: 'Automatically adjust temperature based on schedule',
          type: 'toggle',
          value: autoMode,
          onChange: () => setAutoMode(!autoMode),
        },
        {
          label: 'Energy Saving',
          description: 'Optimize for energy efficiency',
          type: 'toggle',
          value: energySaving,
          onChange: () => setEnergySaving(!energySaving),
        },
      ]
    },
    {
      title: 'Network',
      icon: Wifi,
      items: [
        {
          label: 'WiFi Status',
          description: 'Connected to HomeNetwork_5G',
          type: 'info',
          value: 'Connected',
        },
        {
          label: 'MQTT Broker',
          description: 'Device communication status',
          type: 'info',
          value: 'Development Mode',
        },
      ]
    },
    {
      title: 'Security',
      icon: Shield,
      items: [
        {
          label: 'Device Encryption',
          description: 'All device communications are encrypted',
          type: 'info',
          value: 'Enabled',
        },
      ]
    }
  ];

  const systemStats = [
    {
      label: 'Active Devices',
      value: '6',
      icon: Activity,
      color: 'from-blue-400 to-blue-600'
    },
    {
      label: 'Average Temperature',
      value: '22.1°C',
      icon: Thermometer,
      color: 'from-orange-400 to-red-600'
    },
    {
      label: 'Data Points',
      value: '1,247',
      icon: Database,
      color: 'from-purple-400 to-purple-600'
    }
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            System Settings
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Configure your Smart HVAC system preferences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Panels */}
          <div className="lg:col-span-2 space-y-6">
            {settingSections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                className="glass-panel p-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 rounded-full bg-gradient-to-r from-primary-400 to-primary-600">
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-4">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                          {item.label}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.description}
                        </p>
                      </div>
                      
                                             {item.type === 'toggle' && 'onChange' in item && (
                         <motion.button
                           onClick={item.onChange}
                           className={`w-12 h-6 rounded-full p-1 transition-colors ${
                             item.value ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                           }`}
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.95 }}
                         >
                           <motion.div
                             className="w-4 h-4 rounded-full bg-white transition-transform"
                             animate={{ x: item.value ? 24 : 0 }}
                             transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                           />
                         </motion.button>
                       )}
                      
                      {item.type === 'info' && (
                        <div className="text-right">
                          <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                            {item.value}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* System Stats Sidebar */}
          <div className="space-y-6">
            <motion.div
              className="glass-panel p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
                System Overview
              </h2>
              
              <div className="space-y-4">
                {systemStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  >
                    <div className={`p-2 rounded-full bg-gradient-to-r ${stat.color}`}>
                      <stat.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {stat.label}
                      </div>
                      <div className="font-semibold text-gray-800 dark:text-gray-200">
                        {stat.value}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              className="glass-panel p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <motion.button
                  className="w-full p-3 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="font-medium text-gray-800 dark:text-gray-200">
                    Export Data
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Download system logs
                  </div>
                </motion.button>
                
                <motion.button
                  className="w-full p-3 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="font-medium text-gray-800 dark:text-gray-200">
                    Reset Settings
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Restore defaults
                  </div>
                </motion.button>
                
                <motion.button
                  className="w-full p-3 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="font-medium text-gray-800 dark:text-gray-200">
                    System Update
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Check for updates
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 