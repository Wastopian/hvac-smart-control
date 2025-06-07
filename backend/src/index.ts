import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import dotenv from 'dotenv';

import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { WebSocketService } from './services/websocketService';
import { MqttService } from './services/mqttService';
import { DatabaseService } from './services/databaseService';

// Routes
import sensorRoutes from './routes/sensors';
import roomRoutes from './routes/rooms';
import deviceRoutes from './routes/devices';
import systemRoutes from './routes/system';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3003;

// Initialize services
const databaseService = new DatabaseService();
const websocketService = new WebSocketService(server);
const mqttService = new MqttService();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3002',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
app.use('/api/sensors', sensorRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/system', systemRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log('Received shutdown signal, closing server gracefully...');
  
  // Close WebSocket connections
  websocketService.close();
  
  // Disconnect MQTT
  await mqttService.disconnect();
  
  // Close database connections
  await databaseService.close();
  
  // Close HTTP server
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server
const startServer = async () => {
  try {
    // Initialize database
    await databaseService.initialize();
    console.log('Database initialized');
    
    // Try to connect to MQTT broker (optional in development)
    try {
      await mqttService.connect();
      console.log('Connected to MQTT broker');
    } catch (mqttError) {
      console.warn('MQTT broker not available, running in development mode without MQTT');
      console.warn('To enable MQTT, start a broker on localhost:1883 or configure MQTT_BROKER_URL');
      
      // Start mock telemetry for development
      if (process.env.NODE_ENV !== 'production') {
        mqttService.startMockTelemetry();
      }
    }
    
    // Start HTTP server
    server.listen(PORT, () => {
      console.log(`🚀 HVAC Backend Server running on port ${PORT}`);
      console.log(`📊 WebSocket server ready for real-time data`);
      console.log(`📡 Device communication: ${mqttService.isConnected() ? 'MQTT connected' : 'Development mode (mock data)'}`);
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Export for testing
export { app, server }; 