# Development Guide

## Quick Start

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd smart-hvac-system
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

2. **Start Development**
   ```bash
   ./start-dev.sh
   ```

3. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/health

## Development Workflow

### Frontend Development
```bash
cd frontend
npm start        # Start development server
npm test         # Run tests
npm run build    # Build for production
npm run lint     # Run ESLint
```

### Backend Development
```bash
cd backend
npm run dev      # Start with nodemon
npm test         # Run tests
npm run build    # Build TypeScript
npm run lint     # Run ESLint
```

### ESP32 Development
```bash
cd device
pio run          # Compile firmware
pio run -t upload # Upload to device
pio device monitor # Serial monitor
```

## Project Structure

```
smart-hvac-system/
├── README.md                  # Project overview
├── package.json              # Workspace configuration
├── scripts/setup.sh          # Setup script
├── start-dev.sh              # Development launcher
│
├── shared/                    # Common types and utilities
│   ├── src/types/            # TypeScript definitions
│   ├── src/utils/            # Utility functions
│   └── package.json
│
├── frontend/                  # React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Main application pages
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API communication
│   │   └── types/           # Frontend-specific types
│   ├── public/              # Static assets
│   └── package.json
│
├── backend/                   # Node.js server
│   ├── src/
│   │   ├── routes/          # Express route handlers
│   │   ├── services/        # Business logic services
│   │   ├── middleware/      # Express middleware
│   │   └── models/          # Database models
│   ├── data/                # SQLite database
│   └── package.json
│
├── device/                    # ESP32 firmware
│   ├── src/main.cpp         # Main firmware code
│   ├── lib/                 # Custom libraries
│   └── platformio.ini       # PlatformIO configuration
│
├── deployment/                # Infrastructure
│   ├── docker-compose.yml    # Container orchestration
│   ├── mosquitto/           # MQTT broker config
│   └── grafana/             # Analytics dashboards
│
└── docs/                      # Documentation
    ├── ARCHITECTURE.md        # System architecture
    └── DEVELOPMENT.md         # This file
```

## Key Technologies

### Frontend Stack
- **React 18**: UI framework
- **TypeScript**: Type safety
- **Material-UI**: Component library
- **React Query**: Data fetching
- **React Router**: Navigation

### Backend Stack
- **Node.js**: Runtime environment
- **Express**: Web framework
- **TypeScript**: Type safety
- **SQLite**: Database
- **MQTT**: Device communication
- **WebSocket**: Real-time updates

### Device Stack
- **ESP32**: Microcontroller
- **Arduino Framework**: Development platform
- **PlatformIO**: Build system
- **BME280**: Environmental sensor
- **MQTT**: Communication protocol

## API Endpoints

### Sensors
- `GET /api/sensors` - List all sensors
- `GET /api/sensors/:id/data` - Get sensor readings
- `POST /api/sensors/:id/calibrate` - Calibrate sensor

### Rooms
- `GET /api/rooms` - List all rooms
- `PUT /api/rooms/:id/settings` - Update room settings
- `POST /api/rooms/:id/schedule` - Set room schedule

### Devices
- `POST /api/devices/:id/vent` - Control vent position
- `GET /api/devices/:id/status` - Get device status
- `PUT /api/devices/:id/config` - Update device config

### System
- `GET /api/system/status` - Get system health
- `GET /health` - Health check endpoint

## MQTT Topics

### Device Communication
- `hvac/devices/{device-id}/telemetry` - Sensor data (device → server)
- `hvac/devices/{device-id}/status` - Device status (device → server)
- `hvac/devices/{device-id}/commands` - Control commands (server → device)
- `hvac/devices/{device-id}/alerts` - Alert messages (device → server)

### System Topics
- `hvac/server/status` - Server status
- `hvac/system/discovery` - Device discovery

## Development Guidelines

### Code Style
- Use TypeScript strict mode
- Follow ESLint configurations
- Use Prettier for formatting
- Write meaningful commit messages
- Add JSDoc comments for public APIs

### Testing
- Unit tests for business logic
- Integration tests for API endpoints
- Component tests for React components
- Mock external dependencies

### Git Workflow
```bash
# Feature development
git checkout -b feature/room-scheduling
git commit -m "feat: add room scheduling interface"
git push origin feature/room-scheduling

# Create pull request
# After review and merge
git checkout main
git pull origin main
```

## Environment Variables

### Backend (.env)
```bash
PORT=3001
NODE_ENV=development
DATABASE_PATH=./data/hvac.db
MQTT_BROKER_URL=mqtt://localhost:1883
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-secret-key
```

### Device (platformio.ini)
```ini
build_flags = 
    -DWIFI_SSID=\"YourWiFiNetwork\"
    -DWIFI_PASSWORD=\"YourWiFiPassword\"
    -DMQTT_SERVER=\"192.168.1.100\"
    -DMQTT_PORT=1883
```

## Debugging

### Backend Debugging
```bash
# Enable debug logs
DEBUG=hvac:* npm run dev

# Database debugging
sqlite3 backend/data/hvac.db ".tables"
sqlite3 backend/data/hvac.db "SELECT * FROM rooms;"
```

### Frontend Debugging
```bash
# React Developer Tools
# Redux DevTools (if using Redux)
# Browser Network tab for API calls
```

### Device Debugging
```bash
# Serial monitor
pio device monitor

# MQTT debugging
mosquitto_sub -h localhost -t "hvac/devices/+/telemetry"
mosquitto_pub -h localhost -t "hvac/devices/device-1/commands" -m '{"type":"status_request"}'
```

## Common Issues

### MQTT Connection Fails
```bash
# Check if broker is running
nc -z localhost 1883

# Start MQTT broker
cd deployment
docker-compose up -d mosquitto
```

### Frontend Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
rm -rf build
npm run build
```

### ESP32 Upload Fails
```bash
# Check device connection
pio device list

# Erase flash if needed
pio run -t erase

# Monitor during upload
pio run -t upload -t monitor
```

## Performance Optimization

### Frontend
- Use React.memo for expensive components
- Implement virtual scrolling for large lists
- Code splitting with React.lazy
- Optimize bundle size with webpack-bundle-analyzer

### Backend
- Database indexing for frequent queries
- Connection pooling for database
- Caching with Redis for repeated queries
- Rate limiting to prevent abuse

### Device
- Optimize sensor reading intervals
- Use deep sleep when possible
- Minimize MQTT payload size
- Implement local data caching

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Pull Request Guidelines
- Clear description of changes
- Reference related issues
- Include tests for new features
- Update documentation if needed
- Follow the existing code style

## Resources

- [React Documentation](https://reactjs.org/docs/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [ESP32 Programming Guide](https://docs.espressif.com/projects/esp-idf/en/latest/)
- [MQTT Protocol](https://mqtt.org/)
- [Material-UI Components](https://mui.com/) 