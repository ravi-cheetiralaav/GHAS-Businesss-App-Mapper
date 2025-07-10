#!/bin/bash
# This script builds only the frontend React application.
set -e

# --- Banner Function ---
print_banner() {
  echo
  echo "========================================================================"
  echo "$1"
  echo "========================================================================"
}

# --- Build Frontend ---
print_banner "Building Frontend Application"

# Get the script directory
SCRIPT_DIR="$(dirname "$0")"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

# Check if frontend directory exists
if [ ! -d "$FRONTEND_DIR" ]; then
    echo "Error: Frontend directory not found at $FRONTEND_DIR"
    exit 1
fi

echo "Navigating to frontend directory: $FRONTEND_DIR"
cd "$FRONTEND_DIR"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found in frontend directory"
    exit 1
fi

echo "Installing npm dependencies..."
npm install

# Clear npm cache if needed
echo "Clearing npm cache..."
npm cache clean --force

echo "Installing react-scripts if missing..."
npm install react-scripts --save-dev

echo "Running production build..."
# Use npx to ensure react-scripts is found
npx react-scripts build

# Check if build was successful
if [ ! -d "build" ]; then
    echo "Error: Build failed - 'build' directory not created"
    exit 1
fi

echo
print_banner "Frontend Build Complete"
echo "Build artifacts are located at: $FRONTEND_DIR/build"
echo "Contents of build directory:"
ls -la build/

echo
echo "To serve the frontend standalone, you can use:"
echo "  cd frontend && npx serve -s build -l 3000"
echo
echo "To integrate with backend, run the full build script:"
echo "  ./build-all.sh"
