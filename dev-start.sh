#!/bin/bash

# Development runner script for GHAS Vulnerability Insights

echo "🚀 Starting GHAS Vulnerability Insights Development Environment"

# Function to kill background processes on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down development environment..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
        echo "✅ Backend stopped"
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
        echo "✅ Frontend stopped"
    fi
    exit 0
}

# Set trap to cleanup on exit
trap cleanup SIGINT SIGTERM

echo "🔧 Starting backend..."
echo "📍 Current directory: $(pwd)"
echo "📁 Navigating to backend directory..."
cd backend
echo "📍 Now in directory: $(pwd)"
echo "🚀 Starting Spring Boot application with Maven..."
mvn spring-boot:run &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 30

echo "🎨 Starting frontend..."
echo "📁 Navigating to frontend directory..."
cd ../frontend
echo "📍 Now in directory: $(pwd)"

# Check if App.tsx exists
if [ ! -f "src/App.tsx" ]; then
    echo "❌ Error: App.tsx not found in src directory"
    ls -la src/
    exit 1
fi

# Check if tsconfig.json exists
if [ ! -f "tsconfig.json" ]; then
    echo "⚠️  Warning: tsconfig.json not found, this may cause module resolution issues"
fi

# Clean any corrupted build artifacts
echo "🧹 Cleaning build artifacts..."
rm -rf build

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
    npm install react-scripts --save-dev
else
    echo "📦 Frontend dependencies already installed"
fi

# Ensure react-scripts is available
if ! npm list react-scripts &>/dev/null; then
    echo "📦 Installing react-scripts..."
    npm install react-scripts --save-dev
fi

echo "🚀 Starting frontend development server..."
npm start &
FRONTEND_PID=$!

echo ""
echo "🎉 Development environment started!"
echo "📖 Backend API: http://localhost:8080/swagger-ui.html"
echo "🎨 Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the development environment"

# Wait for processes
wait
