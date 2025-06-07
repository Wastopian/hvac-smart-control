export interface Room {
  id: string;
  name: string;
  floor: number;
  area: number; // Square feet
  type: RoomType;
  settings: RoomSettings;
  devices: string[]; // Device IDs
  schedule: RoomSchedule[];
  comfortScore: number; // 0-100
}

export enum RoomType {
  LIVING_ROOM = 'living_room',
  BEDROOM = 'bedroom',
  KITCHEN = 'kitchen',
  BATHROOM = 'bathroom',
  OFFICE = 'office',
  BASEMENT = 'basement',
  ATTIC = 'attic',
  GARAGE = 'garage'
}

export interface RoomSettings {
  targetTemperature: number; // Celsius
  targetHumidity: number; // Percentage
  temperatureRange: {
    min: number;
    max: number;
  };
  humidityRange: {
    min: number;
    max: number;
  };
  ventPosition: number; // 0-100 percentage
  autoMode: boolean;
  priority: RoomPriority;
}

export enum RoomPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface RoomSchedule {
  id: string;
  name: string;
  enabled: boolean;
  dayOfWeek: number[]; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  settings: Partial<RoomSettings>;
}

export interface ComfortMetrics {
  temperature: {
    current: number;
    target: number;
    deviation: number;
    trend: 'rising' | 'falling' | 'stable';
  };
  humidity: {
    current: number;
    target: number;
    deviation: number;
    trend: 'rising' | 'falling' | 'stable';
  };
  airflow: {
    current: number;
    target: number;
    ventPosition: number;
  };
  overall: {
    score: number; // 0-100
    factors: ComfortFactor[];
  };
}

export interface ComfortFactor {
  name: string;
  weight: number;
  score: number;
  description: string;
} 