import { Router, Request, Response } from 'express';
import { ApiResponse } from '@hvac/shared';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// GET /api/system/status - Get system status
router.get('/status', async (req: Request, res: Response) => {
  const response: ApiResponse = {
    success: true,
    data: {
      status: 'healthy',
      uptime: process.uptime(),
      connectedDevices: 2,
      activeRooms: 3,
      totalSensors: 2
    },
    timestamp: new Date().toISOString(),
    requestId: uuidv4()
  };
  
  res.json(response);
});

export default router; 