import mqtt, { MqttClient } from 'mqtt';
import { EventEmitter } from 'events';
import { DeviceTelemetry, MqttMessage } from '@hvac/shared';

export class MqttService extends EventEmitter {
  private client: MqttClient | null = null;
  private brokerUrl: string;
  private options: mqtt.IClientOptions;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;

  constructor() {
    super();
    
    this.brokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';
    this.options = {
      clientId: `hvac-server-${Date.now()}`,
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
      keepalive: 60,
      connectTimeout: 30000,
      will: {
        topic: 'hvac/server/status',
        payload: JSON.stringify({ status: 'offline', timestamp: new Date().toISOString() }),
        qos: 1,
        retain: true
      }
    };
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.client = mqtt.connect(this.brokerUrl, this.options);

        this.client.on('connect', () => {
          console.log('Connected to MQTT broker');
          this.reconnectAttempts = 0;
          this.subscribeToTopics();
          this.publishServerStatus('online');
          resolve();
        });

        this.client.on('error', (error) => {
          console.error('MQTT connection error:', error);
          if (this.reconnectAttempts === 0) {
            reject(error);
          }
        });

        this.client.on('offline', () => {
          console.log('MQTT client offline');
          this.emit('offline');
        });

        this.client.on('reconnect', () => {
          this.reconnectAttempts++;
          console.log(`MQTT reconnect attempt ${this.reconnectAttempts}`);
          
          if (this.reconnectAttempts > this.maxReconnectAttempts) {
            console.error('Max MQTT reconnect attempts reached');
            this.client?.end();
          }
        });

        this.client.on('message', (topic, payload) => {
          this.handleMessage(topic, payload);
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  private subscribeToTopics(): void {
    if (!this.client) return;

    const topics = [
      'hvac/devices/+/telemetry',
      'hvac/devices/+/status',
      'hvac/devices/+/alerts',
      'hvac/system/discovery'
    ];

    topics.forEach(topic => {
      this.client!.subscribe(topic, { qos: 1 }, (err) => {
        if (err) {
          console.error(`Failed to subscribe to ${topic}:`, err);
        } else {
          console.log(`Subscribed to ${topic}`);
        }
      });
    });
  }

  private handleMessage(topic: string, payload: Buffer): void {
    try {
      const message: MqttMessage = {
        topic,
        payload: JSON.parse(payload.toString()),
        qos: 1,
        timestamp: new Date().toISOString()
      };

      // Route messages based on topic
      if (topic.includes('/telemetry')) {
        this.handleTelemetryMessage(message);
      } else if (topic.includes('/status')) {
        this.handleStatusMessage(message);
      } else if (topic.includes('/alerts')) {
        this.handleAlertMessage(message);
      } else if (topic.includes('/discovery')) {
        this.handleDiscoveryMessage(message);
      }

      // Emit generic message event
      this.emit('message', message);

    } catch (error) {
      console.error('Error parsing MQTT message:', error);
    }
  }

  private handleTelemetryMessage(message: MqttMessage): void {
    const deviceId = this.extractDeviceId(message.topic);
    const { deviceId: _, ...telemetry } = message.payload as DeviceTelemetry;
    
    // Emit telemetry event for processing
    this.emit('telemetry', {
      ...telemetry,
      deviceId,
      timestamp: message.timestamp
    });
  }

  private handleStatusMessage(message: MqttMessage): void {
    const deviceId = this.extractDeviceId(message.topic);
    this.emit('deviceStatus', {
      deviceId,
      status: message.payload.status,
      timestamp: message.timestamp
    });
  }

  private handleAlertMessage(message: MqttMessage): void {
    const deviceId = this.extractDeviceId(message.topic);
    this.emit('deviceAlert', {
      deviceId,
      alert: message.payload,
      timestamp: message.timestamp
    });
  }

  private handleDiscoveryMessage(message: MqttMessage): void {
    this.emit('deviceDiscovery', message.payload);
  }

  private extractDeviceId(topic: string): string {
    const parts = topic.split('/');
    const deviceIndex = parts.findIndex(part => part === 'devices') + 1;
    return parts[deviceIndex] || 'unknown';
  }

  // Public methods for publishing

  publishCommand(deviceId: string, command: any): void {
    if (!this.client?.connected) {
      console.error('MQTT client not connected');
      return;
    }

    const topic = `hvac/devices/${deviceId}/commands`;
    const payload = JSON.stringify({
      ...command,
      timestamp: new Date().toISOString()
    });

    this.client.publish(topic, payload, { qos: 1 }, (err) => {
      if (err) {
        console.error(`Failed to publish command to ${deviceId}:`, err);
      } else {
        console.log(`Command sent to ${deviceId}:`, command.type);
      }
    });
  }

  publishVentControl(deviceId: string, position: number, duration?: number): void {
    this.publishCommand(deviceId, {
      type: 'vent_control',
      position,
      duration,
      id: `cmd-${Date.now()}`
    });
  }

  publishConfiguration(deviceId: string, config: any): void {
    this.publishCommand(deviceId, {
      type: 'configuration',
      config,
      id: `cfg-${Date.now()}`
    });
  }

  publishOTAUpdate(deviceId: string, firmwareUrl: string): void {
    this.publishCommand(deviceId, {
      type: 'ota_update',
      firmwareUrl,
      id: `ota-${Date.now()}`
    });
  }

  private publishServerStatus(status: 'online' | 'offline'): void {
    if (!this.client) return;

    const payload = JSON.stringify({
      status,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0'
    });

    this.client.publish('hvac/server/status', payload, { 
      qos: 1, 
      retain: true 
    });
  }

  // Request device status
  requestDeviceStatus(deviceId?: string): void {
    const topic = deviceId 
      ? `hvac/devices/${deviceId}/commands`
      : 'hvac/devices/broadcast/commands';

    this.publishCommand(deviceId || 'broadcast', {
      type: 'status_request',
      id: `status-${Date.now()}`
    });
  }

  async disconnect(): Promise<void> {
    if (!this.client) return;

    this.publishServerStatus('offline');

    return new Promise((resolve) => {
      this.client!.end(true, {}, () => {
        console.log('MQTT client disconnected');
        resolve();
      });
    });
  }

  isConnected(): boolean {
    return this.client?.connected || false;
  }

  // Generate mock telemetry data for development
  startMockTelemetry(): void {
    if (process.env.NODE_ENV === 'production') {
      console.warn('Mock telemetry should not be used in production');
      return;
    }

    const deviceIds = ['device-1', 'device-2'];
    
    const generateMockData = () => {
      deviceIds.forEach(deviceId => {
        const mockTelemetry: DeviceTelemetry = {
          deviceId,
          sensors: {
            temperature: 20 + Math.random() * 10, // 20-30°C
            humidity: 40 + Math.random() * 20,    // 40-60%
            pressure: 101325 + (Math.random() - 0.5) * 1000 // ~101325 ± 500 Pa
          },
          battery: 80 + Math.random() * 20,
          rssi: -50 - Math.random() * 30,
          firmware: '1.0.0',
          uptime: Math.floor(Math.random() * 86400)
        };

        const { deviceId: _, ...telemetryData } = mockTelemetry;
        this.emit('telemetry', {
          ...telemetryData,
          deviceId,
          timestamp: new Date().toISOString()
        });
      });
    };

    // Generate mock data every 30 seconds
    setInterval(generateMockData, 30000);
    
    // Generate initial data
    generateMockData();
    
    console.log('Mock telemetry started for development');
  }
} 