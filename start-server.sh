#!/bin/bash

# Jet2 Server Startup Script

echo "🚀 Starting Jet2 Server..."
echo "=========================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js version 16 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1)

if [ "$MAJOR_VERSION" -lt 16 ]; then
    echo "❌ Node.js version $NODE_VERSION detected. Please install Node.js version 16 or higher."
    exit 1
fi

echo "✅ Node.js version $NODE_VERSION detected"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Make sure you're in the correct directory."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed successfully"
else
    echo "✅ Dependencies already installed"
fi

# Start the server
echo "🌟 Starting server..."
echo ""
echo "📱 Chat interface will be available at: http://localhost:3000"
echo "🏥 Health check endpoint: http://localhost:3000/api/health"  
echo "👥 Passengers API: http://localhost:3000/api/passengers"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start in development mode if available, otherwise production
if command -v nodemon &> /dev/null; then
    npm run dev
else
    npm start
fi
