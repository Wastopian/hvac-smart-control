export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: string;
  requestId: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  stack?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  filter?: Record<string, any>;
}

// Sensor API Types
export interface GetSensorsParams extends QueryParams {
  roomId?: string;
  status?: string;
  type?: string;
}

export interface GetSensorDataParams extends QueryParams {
  startDate?: string;
  endDate?: string;
  interval?: '1m' | '5m' | '15m' | '1h' | '1d';
}

export interface CalibrateSensorRequest {
  temperatureOffset?: number;
  humidityOffset?: number;
  pressureOffset?: number;
}

// Room API Types
export interface CreateRoomRequest {
  name: string;
  floor: number;
  area: number;
  type: string;
  settings?: Partial<RoomSettings>;
}

export interface UpdateRoomRequest extends Partial<CreateRoomRequest> {
  settings?: Partial<RoomSettings>;
}

export interface CreateScheduleRequest {
  name: string;
  dayOfWeek: number[];
  startTime: string;
  endTime: string;
  settings: Partial<RoomSettings>;
}

// Device API Types
export interface ControlVentRequest {
  position: number; // 0-100
  duration?: number; // Optional duration in minutes
  reason?: string;
}

export interface UpdateDeviceConfigRequest {
  name?: string;
  settings?: Record<string, any>;
  schedule?: {
    reportInterval: number;
    sleepMode: boolean;
  };
}

// WebSocket Message Types
export interface WebSocketMessage {
  type: MessageType;
  data: any;
  timestamp: string;
  clientId?: string;
}

export enum MessageType {
  SENSOR_DATA = 'sensor_data',
  DEVICE_STATUS = 'device_status',
  ROOM_UPDATE = 'room_update',
  ALERT = 'alert',
  SYSTEM_STATUS = 'system_status',
  ERROR = 'error'
}

// MQTT Message Types
export interface MqttMessage {
  topic: string;
  payload: any;
  qos: 0 | 1 | 2;
  retain?: boolean;
  timestamp: string;
}

export interface DeviceTelemetry {
  deviceId: string;
  sensors: {
    temperature?: number;
    humidity?: number;
    pressure?: number;
  };
  battery?: number;
  rssi?: number;
  firmware: string;
  uptime: number;
}

import { RoomSettings } from './room'; 