import { Router, Request, Response } from 'express';
import { ApiResponse, Room } from '@hvac/shared';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Mock room data
const mockRooms: Room[] = [
  {
    id: 'room-1',
    name: 'Living Room',
    floor: 1,
    area: 300,
    type: 'living_room' as any,
    devices: ['device-1'],
    schedule: [],
    comfortScore: 85,
    settings: {
      targetTemperature: 22,
      targetHumidity: 45,
      temperatureRange: { min: 20, max: 24 },
      humidityRange: { min: 40, max: 60 },
      ventPosition: 50,
      autoMode: true,
      priority: 'high' as any
    }
  }
];

// GET /api/rooms - Get all rooms
router.get('/', async (req: Request, res: Response) => {
  const response: ApiResponse = {
    success: true,
    data: mockRooms,
    timestamp: new Date().toISOString(),
    requestId: uuidv4()
  };
  res.json(response);
});

export default router; 