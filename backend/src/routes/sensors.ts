import { Router, Request, Response } from 'express';
import { ApiResponse, SensorReading, SensorDevice } from '@hvac/shared';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Mock data for development
const mockSensorReadings: SensorReading[] = [
  {
    id: 'reading-1',
    deviceId: 'device-1',
    roomId: 'room-1',
    timestamp: new Date(),
    temperature: 22.5,
    humidity: 45,
    pressure: 101325
  },
  {
    id: 'reading-2',
    deviceId: 'device-2',
    roomId: 'room-2',
    timestamp: new Date(),
    temperature: 20.1,
    humidity: 52,
    pressure: 101280
  }
];

// GET /api/sensors - Get all sensors
router.get('/', async (req: Request, res: Response) => {
  try {
    const mockDevices: SensorDevice[] = [
      {
        id: 'device-1',
        name: 'Living Room Sensor',
        roomId: 'room-1',
        type: 'COMBO',
        status: 'online' as any,
        lastSeen: new Date(),
        firmware: '1.0.0',
        batteryLevel: 85,
        calibration: {
          temperatureOffset: 0,
          humidityOffset: 0,
          pressureOffset: 0,
          lastCalibrated: new Date()
        }
      },
      {
        id: 'device-2',
        name: 'Bedroom Sensor',
        roomId: 'room-2',
        type: 'COMBO',
        status: 'online' as any,
        lastSeen: new Date(),
        firmware: '1.0.0',
        batteryLevel: 92,
        calibration: {
          temperatureOffset: 0.5,
          humidityOffset: -2,
          pressureOffset: 0,
          lastCalibrated: new Date()
        }
      }
    ];

    const response: ApiResponse = {
      success: true,
      data: mockDevices,
      timestamp: new Date().toISOString(),
      requestId: uuidv4()
    };

    res.json(response);
  } catch (error) {
    throw error;
  }
});

// GET /api/sensors/:id/data - Get sensor readings for a device
router.get('/:id/data', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, limit = '100' } = req.query;

    // Filter readings by device ID
    let readings = mockSensorReadings.filter(reading => reading.deviceId === id);

    // Apply date filtering if provided
    if (startDate) {
      const start = new Date(startDate as string);
      readings = readings.filter(reading => reading.timestamp >= start);
    }
    
    if (endDate) {
      const end = new Date(endDate as string);
      readings = readings.filter(reading => reading.timestamp <= end);
    }

    // Apply limit
    const limitNum = parseInt(limit as string);
    readings = readings.slice(0, limitNum);

    const response: ApiResponse = {
      success: true,
      data: readings,
      timestamp: new Date().toISOString(),
      requestId: uuidv4()
    };

    res.json(response);
  } catch (error) {
    throw error;
  }
});

// POST /api/sensors/:id/calibrate - Calibrate a sensor
router.post('/:id/calibrate', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { temperatureOffset, humidityOffset, pressureOffset } = req.body;

    // In a real implementation, this would update the device calibration
    const calibrationUpdate = {
      temperatureOffset: temperatureOffset || 0,
      humidityOffset: humidityOffset || 0,
      pressureOffset: pressureOffset || 0,
      lastCalibrated: new Date()
    };

    const response: ApiResponse = {
      success: true,
      data: {
        deviceId: id,
        calibration: calibrationUpdate,
        message: 'Sensor calibration updated successfully'
      },
      timestamp: new Date().toISOString(),
      requestId: uuidv4()
    };

    res.json(response);
  } catch (error) {
    throw error;
  }
});

export default router; 