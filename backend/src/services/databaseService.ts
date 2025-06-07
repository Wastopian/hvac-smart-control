import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

export class DatabaseService {
  private db: sqlite3.Database | null = null;
  private dbPath: string;

  constructor() {
    this.dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../data/hvac.db');
    
    // Ensure data directory exists
    const dataDir = path.dirname(this.dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          reject(err);
          return;
        }
        
        console.log('Connected to SQLite database');
        this.createTables()
          .then(() => resolve())
          .catch(reject);
      });
    });
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const run = promisify(this.db.run.bind(this.db));

    // Rooms table
    await run(`
      CREATE TABLE IF NOT EXISTS rooms (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        floor INTEGER NOT NULL,
        area REAL NOT NULL,
        type TEXT NOT NULL,
        settings TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Devices table
    await run(`
      CREATE TABLE IF NOT EXISTS devices (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        room_id TEXT NOT NULL,
        type TEXT NOT NULL,
        status TEXT NOT NULL,
        firmware TEXT NOT NULL,
        battery_level INTEGER,
        calibration TEXT NOT NULL,
        last_seen DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (room_id) REFERENCES rooms (id)
      )
    `);

    // Sensor readings table
    await run(`
      CREATE TABLE IF NOT EXISTS sensor_readings (
        id TEXT PRIMARY KEY,
        device_id TEXT NOT NULL,
        room_id TEXT NOT NULL,
        temperature REAL,
        humidity REAL,
        pressure REAL,
        timestamp DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (device_id) REFERENCES devices (id),
        FOREIGN KEY (room_id) REFERENCES rooms (id)
      )
    `);

    // Room schedules table
    await run(`
      CREATE TABLE IF NOT EXISTS room_schedules (
        id TEXT PRIMARY KEY,
        room_id TEXT NOT NULL,
        name TEXT NOT NULL,
        enabled BOOLEAN DEFAULT true,
        day_of_week TEXT NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        settings TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (room_id) REFERENCES rooms (id)
      )
    `);

    // Alerts table
    await run(`
      CREATE TABLE IF NOT EXISTS alerts (
        id TEXT PRIMARY KEY,
        device_id TEXT NOT NULL,
        type TEXT NOT NULL,
        severity TEXT NOT NULL,
        message TEXT NOT NULL,
        acknowledged BOOLEAN DEFAULT false,
        timestamp DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (device_id) REFERENCES devices (id)
      )
    `);

    // Create indexes for better performance
    await run('CREATE INDEX IF NOT EXISTS idx_sensor_readings_device_timestamp ON sensor_readings (device_id, timestamp)');
    await run('CREATE INDEX IF NOT EXISTS idx_sensor_readings_room_timestamp ON sensor_readings (room_id, timestamp)');
    await run('CREATE INDEX IF NOT EXISTS idx_alerts_device_timestamp ON alerts (device_id, timestamp)');
    await run('CREATE INDEX IF NOT EXISTS idx_devices_room ON devices (room_id)');

    console.log('Database tables created/verified');
  }

  async query(sql: string, params: any[] = []): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      this.db!.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  }

  async get(sql: string, params: any[] = []): Promise<any> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      this.db!.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    });
  }

  async run(sql: string, params: any[] = []): Promise<{ lastID: number; changes: number }> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      this.db!.run(sql, params, function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }

  async close(): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      this.db!.close((err) => {
        if (err) {
          reject(err);
          return;
        }
        console.log('Database connection closed');
        resolve();
      });
    });
  }

  // Utility method to insert mock data for development
  async insertMockData(): Promise<void> {
    console.log('Inserting mock data...');

    // Mock rooms
    const mockRooms = [
      {
        id: 'room-1',
        name: 'Living Room',
        floor: 1,
        area: 300,
        type: 'living_room',
        settings: JSON.stringify({
          targetTemperature: 22,
          targetHumidity: 45,
          temperatureRange: { min: 20, max: 24 },
          humidityRange: { min: 40, max: 60 },
          ventPosition: 50,
          autoMode: true,
          priority: 'high'
        })
      },
      {
        id: 'room-2',
        name: 'Master Bedroom',
        floor: 2,
        area: 250,
        type: 'bedroom',
        settings: JSON.stringify({
          targetTemperature: 20,
          targetHumidity: 50,
          temperatureRange: { min: 18, max: 22 },
          humidityRange: { min: 40, max: 60 },
          ventPosition: 30,
          autoMode: true,
          priority: 'high'
        })
      },
      {
        id: 'room-3',
        name: 'Kitchen',
        floor: 1,
        area: 150,
        type: 'kitchen',
        settings: JSON.stringify({
          targetTemperature: 21,
          targetHumidity: 40,
          temperatureRange: { min: 19, max: 23 },
          humidityRange: { min: 35, max: 55 },
          ventPosition: 70,
          autoMode: true,
          priority: 'medium'
        })
      }
    ];

    for (const room of mockRooms) {
      await this.run(`
        INSERT OR REPLACE INTO rooms (id, name, floor, area, type, settings)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [room.id, room.name, room.floor, room.area, room.type, room.settings]);
    }

    // Mock devices
    const mockDevices = [
      {
        id: 'device-1',
        name: 'Living Room Sensor',
        room_id: 'room-1',
        type: 'COMBO',
        status: 'online',
        firmware: '1.0.0',
        battery_level: 85,
        calibration: JSON.stringify({
          temperatureOffset: 0,
          humidityOffset: 0,
          pressureOffset: 0,
          lastCalibrated: new Date().toISOString()
        }),
        last_seen: new Date().toISOString()
      },
      {
        id: 'device-2',
        name: 'Bedroom Sensor',
        room_id: 'room-2',
        type: 'COMBO',
        status: 'online',
        firmware: '1.0.0',
        battery_level: 92,
        calibration: JSON.stringify({
          temperatureOffset: 0.5,
          humidityOffset: -2,
          pressureOffset: 0,
          lastCalibrated: new Date().toISOString()
        }),
        last_seen: new Date().toISOString()
      }
    ];

    for (const device of mockDevices) {
      await this.run(`
        INSERT OR REPLACE INTO devices (id, name, room_id, type, status, firmware, battery_level, calibration, last_seen)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [device.id, device.name, device.room_id, device.type, device.status, device.firmware, device.battery_level, device.calibration, device.last_seen]);
    }

    console.log('Mock data inserted');
  }
} 