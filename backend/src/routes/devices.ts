import { Router, Request, Response } from 'express';
import { ApiResponse } from '@hvac/shared';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// POST /api/devices/:id/vent - Control vent position
router.post('/:id/vent', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { position, duration } = req.body;

  const response: ApiResponse = {
    success: true,
    data: {
      deviceId: id,
      ventPosition: position,
      duration,
      message: 'Vent position updated successfully'
    },
    timestamp: new Date().toISOString(),
    requestId: uuidv4()
  };
  
  res.json(response);
});

export default router; 