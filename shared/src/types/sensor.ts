export interface SensorReading {
  id: string;
  deviceId: string;
  roomId: string;
  timestamp: Date;
  temperature: number; // Celsius
  humidity: number; // Percentage
  pressure: number; // Pascal
}

export interface SensorDevice {
  id: string;
  name: string;
  roomId: string;
  type: 'BME280' | 'SDP810' | 'COMBO';
  status: DeviceStatus;
  lastSeen: Date;
  firmware: string;
  batteryLevel?: number;
  calibration: SensorCalibration;
}

export interface SensorCalibration {
  temperatureOffset: number;
  humidityOffset: number;
  pressureOffset: number;
  lastCalibrated: Date;
}

export enum DeviceStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  ERROR = 'error',
  MAINTENANCE = 'maintenance'
}

export interface SensorAlert {
  id: string;
  deviceId: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

export enum AlertType {
  HIGH_TEMPERATURE = 'high_temperature',
  LOW_TEMPERATURE = 'low_temperature',
  HIGH_HUMIDITY = 'high_humidity',
  LOW_HUMIDITY = 'low_humidity',
  PRESSURE_ANOMALY = 'pressure_anomaly',
  DEVICE_OFFLINE = 'device_offline',
  LOW_BATTERY = 'low_battery',
  CALIBRATION_NEEDED = 'calibration_needed'
}

export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
} 