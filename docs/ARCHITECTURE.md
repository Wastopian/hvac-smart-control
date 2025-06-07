# Smart HVAC System Architecture

## Overview

The Smart HVAC System is a modular, full-stack IoT solution designed for intelligent room-by-room climate control. The system follows a microservices architecture with clear separation of concerns and is built for scalability and maintainability.

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   ESP32 Device  │    │   ESP32 Device  │    │   ESP32 Device  │
│  (Living Room)  │    │   (Bedroom)     │    │   (Kitchen)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │ MQTT/WiFi
                                 ▼
                    ┌─────────────────────┐
                    │   MQTT Broker       │
                    │   (Mosquitto)       │
                    └─────────────────────┘
                                 │
                                 ▼
                    ┌─────────────────────┐
                    │   Backend Server    │
                    │   (Node.js/Express) │
                    │                     │
                    │ ┌─────────────────┐ │
                    │ │   SQLite DB     │ │
                    │ └─────────────────┘ │
                    └─────────────────────┘
                                 │ REST API/WebSocket
                                 ▼
                    ┌─────────────────────┐
                    │   Frontend Web UI   │
                    │   (React/TypeScript)│
                    └─────────────────────┘
```

## Component Details

### 1. ESP32 Device Layer
**Purpose**: Sensor data collection and device control
**Technology**: C++ with Arduino framework, PlatformIO

**Features**:
- BME280 sensor integration (temperature, humidity, pressure)
- SDP810 pressure differential sensor simulation
- MQTT communication with backend
- OTA firmware update support
- Watchdog timer for reliability
- WiFi auto-reconnection
- JSON-based telemetry publishing

**Communication Topics**:
- `hvac/devices/{device-id}/telemetry` - Sensor data
- `hvac/devices/{device-id}/status` - Device health
- `hvac/devices/{device-id}/commands` - Device commands
- `hvac/devices/{device-id}/alerts` - Alert messages

### 2. MQTT Broker (Mosquitto)
**Purpose**: Message broker for device communication
**Technology**: Eclipse Mosquitto

**Features**:
- Reliable message delivery (QoS 0-2)
- Persistent sessions
- WebSocket support for web clients
- Topic-based routing
- Configurable authentication/authorization

### 3. Backend Server
**Purpose**: Central data processing and API services
**Technology**: Node.js, Express, TypeScript

**Components**:
- **MQTT Service**: Device communication handler
- **WebSocket Service**: Real-time client communication
- **Database Service**: SQLite data persistence
- **REST API**: HTTP endpoints for frontend
- **Rate Limiting**: API protection
- **Error Handling**: Centralized error management

**Key Services**:
```typescript
// Core services
MqttService        // Device communication
WebSocketService   // Real-time UI updates
DatabaseService    // Data persistence
ComfortService     // Comfort score calculations
AlertService       // Anomaly detection
```

### 4. Frontend Web UI
**Purpose**: User interface for system monitoring and control
**Technology**: React, TypeScript, Material-UI

**Features**:
- Responsive, mobile-first design
- Real-time data visualization
- Room-by-room dashboard
- Comfort score display
- Manual vent override controls
- Scheduling interface
- Alert notifications

**Key Components**:
```typescript
// Page components
Dashboard          // Main room overview
RoomDetail        // Individual room control
Settings          // System configuration

// UI components
RoomCard          // Room status display
ComfortMeter      // Comfort score visualization
ScheduleEditor    // Time-based controls
AlertPanel        // Notification display
```

### 5. Shared Module
**Purpose**: Common types and utilities
**Technology**: TypeScript

**Exports**:
- Type definitions for sensors, rooms, API
- Comfort calculation utilities
- Data validation schemas
- Common constants

## Data Flow

### 1. Sensor Data Collection
```
ESP32 → BME280/SDP810 → JSON Telemetry → MQTT → Backend → SQLite
                                                    ↓
                                              WebSocket → Frontend
```

### 2. User Commands
```
Frontend → REST API → Backend → MQTT → ESP32 Device
```

### 3. Real-time Updates
```
Backend ← MQTT ← ESP32 (sensor data)
Backend → WebSocket → Frontend (live updates)
```

## Database Schema

### Tables
- **rooms**: Room configuration and settings
- **devices**: Device registration and metadata
- **sensor_readings**: Time-series sensor data
- **room_schedules**: Automation schedules
- **alerts**: System alerts and notifications

### Key Relationships
```sql
rooms (1:N) devices (1:N) sensor_readings
rooms (1:N) room_schedules
devices (1:N) alerts
```

## Security Considerations

### Current Implementation (Development)
- No authentication (for rapid prototyping)
- HTTP communication
- Open MQTT broker

### Production Recommendations
- JWT-based authentication
- HTTPS/TLS encryption
- MQTT authentication with ACLs
- Rate limiting and input validation
- Device certificate authentication
- Network segmentation (VLAN for IoT devices)

## Scalability Design

### Horizontal Scaling
- **Backend**: Stateless design enables load balancing
- **Database**: SQLite → PostgreSQL migration path
- **MQTT**: Clustered broker support
- **Frontend**: CDN distribution

### Vertical Scaling
- **Memory**: Efficient data structures
- **CPU**: Async processing
- **Storage**: Time-series data optimization

## Future Expansion Modules

### 1. Cloud Integration
```
Local System → Oracle Cloud → Analytics Dashboard
                ↓
         Remote Monitoring & Control
```

### 2. AI/ML Module
```
Historical Data → Machine Learning → Predictive Comfort
                                         ↓
                                   Smart Scheduling
```

### 3. Subscription Service
```
Premium Features → Payment Gateway → Advanced Analytics
                                         ↓
                                   Energy Optimization
```

## Deployment Architecture

### Development
```bash
# Local development
npm run dev          # Starts both frontend and backend
pio run --target upload  # Flash ESP32 firmware
```

### Production
```bash
# Docker deployment
docker-compose up -d                    # Core services
docker-compose --profile extended up   # With analytics
```

### Services
- **Frontend**: Nginx (port 3000)
- **Backend**: Node.js (port 3001)
- **MQTT**: Mosquitto (port 1883, 9001)
- **Analytics**: InfluxDB (port 8086), Grafana (port 3030)

## Monitoring & Observability

### Health Checks
- **Backend**: `/health` endpoint
- **Devices**: Periodic heartbeat via MQTT
- **Frontend**: Service worker availability

### Logging
- **Backend**: Structured JSON logs
- **MQTT**: Connection and message logs
- **Devices**: Serial output for debugging

### Metrics
- **System**: CPU, memory, network usage
- **Application**: API response times, MQTT throughput
- **Business**: Comfort scores, energy usage patterns

## Testing Strategy

### Unit Testing
- **Backend**: Jest for services and utilities
- **Frontend**: React Testing Library
- **Shared**: Type validation and calculations

### Integration Testing
- **API**: Supertest for endpoint testing
- **MQTT**: Simulated device communication
- **Database**: Migration and query testing

### End-to-End Testing
- **User Flows**: Room monitoring and control
- **Device Communication**: Full sensor → UI flow
- **Error Scenarios**: Network failures, device offline

## Performance Considerations

### Optimization Strategies
- **Database**: Indexed queries, data retention policies
- **Network**: Compressed payloads, connection pooling
- **Frontend**: Code splitting, lazy loading
- **Caching**: Redis for frequently accessed data

### Resource Limits
- **Devices**: 30-second sensor intervals
- **API**: 100 requests/minute rate limit
- **WebSocket**: Max 100 concurrent connections
- **MQTT**: 2KB message size limit

This architecture provides a solid foundation for the Smart HVAC System MVP while maintaining flexibility for future enhancements and scale requirements. 