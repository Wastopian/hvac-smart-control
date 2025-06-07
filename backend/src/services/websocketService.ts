import { Server as HttpServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { WebSocketMessage, MessageType } from '@hvac/shared';

interface ClientConnection {
  id: string;
  ws: WebSocket;
  subscribedRooms: Set<string>;
  isAlive: boolean;
  lastPing: Date;
}

export class WebSocketService {
  private wss: WebSocketServer;
  private clients: Map<string, ClientConnection> = new Map();
  private pingInterval: NodeJS.Timeout | null = null;

  constructor(server: HttpServer) {
    this.wss = new WebSocketServer({ 
      server,
      path: '/ws'
    });

    this.wss.on('connection', (ws, request) => {
      this.handleConnection(ws, request);
    });

    this.startPingInterval();
    console.log('WebSocket server initialized');
  }

  private handleConnection(ws: WebSocket, request: any): void {
    const clientId = uuidv4();
    const client: ClientConnection = {
      id: clientId,
      ws,
      subscribedRooms: new Set(),
      isAlive: true,
      lastPing: new Date()
    };

    this.clients.set(clientId, client);

    console.log(`WebSocket client connected: ${clientId}`);

    // Send welcome message
    this.sendToClient(clientId, {
      type: MessageType.SYSTEM_STATUS,
      data: {
        message: 'Connected to HVAC WebSocket server',
        clientId,
        timestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString(),
      clientId
    });

    // Handle messages from client
    ws.on('message', (data) => {
      this.handleMessage(clientId, data);
    });

    // Handle client disconnect
    ws.on('close', () => {
      console.log(`WebSocket client disconnected: ${clientId}`);
      this.clients.delete(clientId);
    });

    // Handle connection errors
    ws.on('error', (error) => {
      console.error(`WebSocket error for client ${clientId}:`, error);
      this.clients.delete(clientId);
    });

    // Handle pong responses
    ws.on('pong', () => {
      if (this.clients.has(clientId)) {
        this.clients.get(clientId)!.isAlive = true;
        this.clients.get(clientId)!.lastPing = new Date();
      }
    });
  }

  private handleMessage(clientId: string, data: any): void {
    try {
      const message = JSON.parse(data.toString());
      const client = this.clients.get(clientId);
      
      if (!client) return;

      switch (message.type) {
        case 'subscribe_room':
          client.subscribedRooms.add(message.roomId);
          this.sendToClient(clientId, {
            type: MessageType.SYSTEM_STATUS,
            data: { message: `Subscribed to room ${message.roomId}` },
            timestamp: new Date().toISOString(),
            clientId
          });
          break;

        case 'unsubscribe_room':
          client.subscribedRooms.delete(message.roomId);
          this.sendToClient(clientId, {
            type: MessageType.SYSTEM_STATUS,
            data: { message: `Unsubscribed from room ${message.roomId}` },
            timestamp: new Date().toISOString(),
            clientId
          });
          break;

        case 'get_status':
          this.broadcastSystemStatus();
          break;

        default:
          console.log(`Unknown message type from client ${clientId}:`, message.type);
      }

    } catch (error) {
      console.error(`Error handling message from client ${clientId}:`, error);
    }
  }

  // Public methods for broadcasting data

  broadcastSensorData(roomId: string, sensorData: any): void {
    const message: WebSocketMessage = {
      type: MessageType.SENSOR_DATA,
      data: sensorData,
      timestamp: new Date().toISOString()
    };

    this.broadcastToRoom(roomId, message);
  }

  broadcastDeviceStatus(deviceId: string, roomId: string, status: any): void {
    const message: WebSocketMessage = {
      type: MessageType.DEVICE_STATUS,
      data: { deviceId, status },
      timestamp: new Date().toISOString()
    };

    this.broadcastToRoom(roomId, message);
  }

  broadcastRoomUpdate(roomId: string, roomData: any): void {
    const message: WebSocketMessage = {
      type: MessageType.ROOM_UPDATE,
      data: roomData,
      timestamp: new Date().toISOString()
    };

    this.broadcastToRoom(roomId, message);
  }

  broadcastAlert(alert: any): void {
    const message: WebSocketMessage = {
      type: MessageType.ALERT,
      data: alert,
      timestamp: new Date().toISOString()
    };

    this.broadcastToAll(message);
  }

  broadcastSystemStatus(): void {
    const message: WebSocketMessage = {
      type: MessageType.SYSTEM_STATUS,
      data: {
        connectedClients: this.clients.size,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    };

    this.broadcastToAll(message);
  }

  // Private helper methods

  private sendToClient(clientId: string, message: WebSocketMessage): void {
    const client = this.clients.get(clientId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      try {
        client.ws.send(JSON.stringify(message));
      } catch (error) {
        console.error(`Error sending message to client ${clientId}:`, error);
        this.clients.delete(clientId);
      }
    }
  }

  private broadcastToRoom(roomId: string, message: WebSocketMessage): void {
    const subscribedClients = Array.from(this.clients.values())
      .filter(client => client.subscribedRooms.has(roomId));

    subscribedClients.forEach(client => {
      this.sendToClient(client.id, message);
    });
  }

  private broadcastToAll(message: WebSocketMessage): void {
    this.clients.forEach(client => {
      this.sendToClient(client.id, message);
    });
  }

  private startPingInterval(): void {
    this.pingInterval = setInterval(() => {
      this.clients.forEach((client, clientId) => {
        if (!client.isAlive) {
          console.log(`Terminating inactive client: ${clientId}`);
          client.ws.terminate();
          this.clients.delete(clientId);
          return;
        }

        client.isAlive = false;
        if (client.ws.readyState === WebSocket.OPEN) {
          client.ws.ping();
        }
      });
    }, 30000); // Ping every 30 seconds
  }

  // Get connection statistics
  getStats(): any {
    const stats = {
      totalClients: this.clients.size,
      clientsByRoom: new Map<string, number>(),
      clientDetails: Array.from(this.clients.values()).map(client => ({
        id: client.id,
        subscribedRooms: Array.from(client.subscribedRooms),
        isAlive: client.isAlive,
        lastPing: client.lastPing
      }))
    };

    // Count clients by room
    this.clients.forEach(client => {
      client.subscribedRooms.forEach(roomId => {
        const count = stats.clientsByRoom.get(roomId) || 0;
        stats.clientsByRoom.set(roomId, count + 1);
      });
    });

    return stats;
  }

  close(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }

    // Close all client connections
    this.clients.forEach(client => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.close();
      }
    });

    this.clients.clear();
    this.wss.close();
    console.log('WebSocket server closed');
  }
} 