# Smart HVAC System MVP

A modular, full-stack Smart HVAC System with real-time monitoring, intelligent vent control, and room-by-room optimization.

## 🏗️ Architecture Overview

```
hvac-system/
├── frontend/          # React + TypeScript homeowner UI
├── backend/           # Node.js + Express server
├── device/            # ESP32 firmware (C++ PlatformIO)
├── shared/            # Common types and utilities
├── docs/              # Architecture documentation
└── deployment/        # Docker, CI/CD configurations
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PlatformIO CLI
- ESP32 development board
- BME280 + SDP810 sensors

### Development Setup

```bash
# Clone and install dependencies
git clone https://github.com/Wastopian/hvac-smart-control.git
cd hvac-smart-control
npm install

# Start backend server
cd backend && PORT=3003 npm run dev

# Start frontend development server
cd frontend && npm run dev:vite

# Upload firmware to ESP32
cd device
pio run --target upload
```

### Access Points
- **Frontend**: http://localhost:3002 (or next available port)
- **Backend API**: http://localhost:3003
- **Health Check**: http://localhost:3003/health

## 📤 GitHub Integration

This project is configured for automatic GitHub synchronization:

### Push Changes to GitHub

```bash
# Method 1: Auto-push with custom message
./scripts/auto-push.sh "Your commit message here"

# Method 2: Quick push with timestamp
./scripts/quick-push.sh

# Method 3: Manual git commands
git add .
git commit -m "Your message"
git push origin master
```

### Repository Information
- **GitHub Repository**: https://github.com/Wastopian/hvac-smart-control
- **Owner**: Wastopian
- **Visibility**: Public

## 📱 Features

### Homeowner UI
- **Room Dashboard**: Real-time temperature, humidity, pressure monitoring
- **Comfort Score**: AI-powered room comfort optimization
- **Manual Override**: Direct vent control with scheduling
- **Alert System**: Notifications for maintenance and anomalies
- **Mobile-First**: Responsive design optimized for smartphones

### Backend Services
- **Real-time Data**: MQTT/WebSocket communication with devices
- **Data Storage**: SQLite for local storage, MongoDB-ready
- **REST API**: Clean endpoints for frontend integration
- **Device Management**: Automatic discovery and configuration

### Device Firmware
- **Sensor Integration**: BME280 (temp/humidity) + SDP810 (pressure)
- **Wi-Fi Connectivity**: Automatic reconnection and OTA updates
- **MQTT Publishing**: Efficient data transmission to backend
- **Low Power**: Optimized sleep modes for battery operation

## 🔧 Module Structure

### Frontend (`/frontend`)
- `src/components/` - Reusable UI components
- `src/pages/` - Main application pages
- `src/hooks/` - Custom React hooks
- `src/services/` - API communication
- `src/types/` - TypeScript definitions

### Backend (`/backend`)
- `src/routes/` - Express route handlers
- `src/services/` - Business logic
- `src/models/` - Database models
- `src/mqtt/` - MQTT client and handlers
- `src/websocket/` - Real-time communication

### Device (`/device`)
- `src/` - Main firmware code
- `lib/` - Custom libraries
- `platformio.ini` - PlatformIO configuration

## 🌐 Communication Flow

```
ESP32 Sensors → MQTT Broker → Backend Server → SQLite DB
                                    ↓
Frontend ← REST API ← WebSocket ← Backend Server
```

## 🔮 Future Expansion

### Planned Modules
- **Cloud Integration**: Oracle Cloud deployment
- **AI/ML**: Room learning algorithms
- **Subscription**: Premium features and analytics
- **OTA Updates**: Remote firmware deployment
- **Multi-Zone**: Support for multiple HVAC zones

### Scalability Considerations
- Microservices architecture ready
- Containerized deployment
- Database migration support
- API versioning
- Event-driven architecture

## 🧪 Development Guidelines

### Code Style
- TypeScript strict mode
- ESLint + Prettier configuration
- Conventional commits
- Component-driven development

### Testing Strategy
- Unit tests for business logic
- Integration tests for API endpoints
- Component testing for UI
- End-to-end testing for critical flows

### CI/CD Pipeline
- Automated testing on pull requests
- Docker containerization
- Deployment to staging/production
- Firmware OTA distribution

## 📋 API Documentation

### Sensor Data Endpoints
- `GET /api/sensors` - List all sensors
- `GET /api/sensors/:id/data` - Get sensor readings
- `POST /api/sensors/:id/calibrate` - Calibrate sensor

### Room Management
- `GET /api/rooms` - List all rooms
- `PUT /api/rooms/:id/settings` - Update room settings
- `POST /api/rooms/:id/schedule` - Set room schedule

### Device Control
- `POST /api/devices/:id/vent` - Control vent position
- `GET /api/devices/:id/status` - Get device status
- `PUT /api/devices/:id/config` - Update device configuration

## 🛠️ Hardware Setup

### ESP32 Wiring
```
BME280 Sensor:
- VCC → 3.3V
- GND → GND
- SCL → GPIO 22
- SDA → GPIO 21

SDP810 Pressure Sensor:
- VCC → 3.3V
- GND → GND
- SCL → GPIO 22
- SDA → GPIO 21
```

### Network Configuration
- Wi-Fi SSID/Password via web portal
- MQTT broker configuration
- Device registration and pairing

## 📊 Monitoring & Analytics

### Real-time Metrics
- Temperature trends
- Humidity patterns
- Pressure differentials
- Energy consumption
- Comfort score history

### Alerts & Notifications
- Filter replacement reminders
- System maintenance alerts
- Abnormal readings detection
- Energy efficiency recommendations

## 🔒 Security Considerations

- Device authentication via certificates
- Encrypted MQTT communication
- API rate limiting
- User authentication and authorization
- Secure OTA updates

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- GitHub Issues for bug reports
- Wiki for detailed documentation
- Discord community for real-time support 