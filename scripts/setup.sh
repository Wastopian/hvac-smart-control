#!/bin/bash

# Smart HVAC System Setup Script
# This script sets up the development environment and initializes the project

set -e

echo "🏠 Smart HVAC System Setup"
echo "=========================="

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node --version)"
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✅ npm $(npm --version) detected"

# Check Docker (optional)
if command -v docker &> /dev/null; then
    echo "✅ Docker $(docker --version | cut -d' ' -f3 | cut -d',' -f1) detected"
    DOCKER_AVAILABLE=true
else
    echo "⚠️  Docker not found (optional for production deployment)"
    DOCKER_AVAILABLE=false
fi

# Check PlatformIO (optional)
if command -v pio &> /dev/null; then
    echo "✅ PlatformIO $(pio --version) detected"
    PIO_AVAILABLE=true
else
    echo "⚠️  PlatformIO not found (needed for ESP32 development)"
    echo "   Install with: pip install platformio"
    PIO_AVAILABLE=false
fi

echo ""

# Install dependencies
echo "📦 Installing dependencies..."

# Root dependencies
echo "Installing root dependencies..."
npm install

# Build shared module first
echo "Building shared module..."
cd shared
npm run build
cd ..

# Backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

# Frontend dependencies  
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "✅ Dependencies installed successfully"
echo ""

# Setup environment files
echo "⚙️  Setting up environment configuration..."

# Backend environment
if [ ! -f "backend/.env" ]; then
    echo "Creating backend/.env from template..."
    cp backend/env.example backend/.env
    echo "✅ Created backend/.env - please review and update the configuration"
else
    echo "✅ backend/.env already exists"
fi

# Create data directories
echo "Creating data directories..."
mkdir -p backend/data
mkdir -p deployment/mosquitto/data
mkdir -p deployment/mosquitto/log

echo "✅ Environment setup complete"
echo ""

# Database initialization
echo "💾 Initializing database..."
cd backend
npm run build
node -e "
const { DatabaseService } = require('./dist/services/databaseService');
const db = new DatabaseService();
db.initialize()
  .then(() => db.insertMockData())
  .then(() => {
    console.log('✅ Database initialized with mock data');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Database initialization failed:', err);
    process.exit(1);
  });
"
cd ..

echo ""

# ESP32 setup (if PlatformIO available)
if [ "$PIO_AVAILABLE" = true ]; then
    echo "📡 ESP32 firmware setup..."
    cd device
    
    echo "Updating PlatformIO library registry..."
    pio lib update
    
    echo "Installing ESP32 platform and libraries..."
    pio platform install espressif32
    
    echo "✅ ESP32 environment ready"
    echo "   To upload firmware: cd device && pio run --target upload"
    cd ..
else
    echo "⚠️  Skipping ESP32 setup (PlatformIO not available)"
fi

echo ""

# Docker setup (if available)
if [ "$DOCKER_AVAILABLE" = true ]; then
    echo "🐳 Docker environment setup..."
    
    # Create Docker network
    if ! docker network ls | grep -q hvac-network; then
        docker network create hvac-network
        echo "✅ Created Docker network: hvac-network"
    else
        echo "✅ Docker network hvac-network already exists"
    fi
    
    echo "   To start with Docker: cd deployment && docker-compose up -d"
else
    echo "⚠️  Skipping Docker setup (Docker not available)"
fi

echo ""

# Development server setup
echo "🚀 Development server setup..."

# Create start script
cat > start-dev.sh << 'EOF'
#!/bin/bash

echo "🏠 Starting Smart HVAC Development Environment"
echo "=============================================="

# Load nvm and use Node.js 18 if available
if [ -s "$HOME/.nvm/nvm.sh" ]; then
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
    
    if nvm list | grep -q "v18"; then
        nvm use 18
        echo "✅ Using Node.js $(node --version)"
    fi
else
    echo "ℹ️  Using system Node.js $(node --version)"
fi

# Check if MQTT broker is running
if ! nc -z localhost 1883 2>/dev/null; then
    echo "⚠️  MQTT broker not running on localhost:1883"
    echo "   Start with: cd deployment && docker-compose up -d mosquitto"
    echo "   Or install and start Mosquitto locally"
    echo "   System will run in development mode with mock data"
fi

# Start the development servers
echo "Starting development servers..."
npm run dev
EOF

chmod +x start-dev.sh

echo "✅ Created start-dev.sh script"
echo ""

# Summary
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "📁 Project Structure:"
echo "   ├── frontend/     - React + TypeScript UI"
echo "   ├── backend/      - Node.js + Express API"
echo "   ├── device/       - ESP32 firmware (C++)"
echo "   ├── shared/       - Common types and utilities"
echo "   ├── deployment/   - Docker and infrastructure"
echo "   └── docs/         - Documentation"
echo ""
echo "🚀 Quick Start:"
echo "   1. Development: ./start-dev.sh"
echo "   2. Production:  cd deployment && docker-compose up -d"
echo "   3. ESP32:       cd device && pio run --target upload"
echo ""
echo "📖 Next Steps:"
echo "   • Review backend/.env configuration"
echo "   • Update WiFi credentials in device/platformio.ini"
echo "   • Read docs/ARCHITECTURE.md for detailed information"
echo ""
echo "🌐 Access Points:"
echo "   • Frontend:  http://localhost:3000"
echo "   • Backend:   http://localhost:3001"
echo "   • API Docs:  http://localhost:3001/health"
echo ""

if [ "$DOCKER_AVAILABLE" = true ]; then
    echo "🐳 Docker Services (when running):"
    echo "   • MQTT Broker: localhost:1883"
    echo "   • WebSocket:   localhost:9001"
    echo "   • Grafana:     http://localhost:3030 (with --profile extended)"
    echo ""
fi

echo "Happy coding! 🎯" 