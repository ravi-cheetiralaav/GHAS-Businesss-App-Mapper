#!/bin/bash

# Quick health check script for GHAS Vulnerability Insights backend

echo "🔍 Checking GHAS Vulnerability Insights Backend Health..."
echo ""

# Check if backend is running on port 8080
if nc -z localhost 8080 2>/dev/null; then
    echo "✅ Backend port 8080 is open"
    
    # Try to hit the health endpoint
    if curl -s http://localhost:8080/api/health > /dev/null; then
        echo "✅ Backend health endpoint is responding"
        echo ""
        echo "📊 Backend Status:"
        curl -s http://localhost:8080/api/health | python3 -m json.tool 2>/dev/null || echo "Health check successful but response not JSON formatted"
    else
        echo "❌ Backend port is open but health endpoint is not responding"
        echo "   The backend may still be starting up"
    fi
else
    echo "❌ Backend is not running on port 8080"
    echo ""
    echo "💡 To start the backend:"
    echo "   cd backend && mvn spring-boot:run"
    echo ""
    echo "💡 Or start the complete development environment:"
    echo "   ./dev-start.sh"
fi

echo ""
echo "🌐 You can also check manually:"
echo "   Frontend: http://localhost:3000"
echo "   Backend Health: http://localhost:8080/api/health"
echo "   API Docs: http://localhost:8080/swagger-ui.html"
