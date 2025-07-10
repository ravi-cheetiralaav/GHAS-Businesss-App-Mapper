#!/bin/bash
# This script builds the frontend and backend applications, creating a single executable JAR.
set -e

# --- Banner Function ---
print_banner() {
  echo
  echo "========================================================================"
  echo "$1"
  echo "========================================================================"
}

# --- Build Frontend ---
print_banner "Step 1: Building the Frontend Application"
echo "Navigating to 'frontend' directory..."
cd "$(dirname "$0")/frontend"

# Check if App.tsx exists
if [ ! -f "src/App.tsx" ]; then
    echo "Error: App.tsx not found in src directory"
    ls -la src/
    exit 1
fi

echo "Cleaning previous build and dependencies..."
rm -rf node_modules package-lock.json build

echo "Installing npm dependencies..."
npm install

echo "Installing react-scripts if missing..."
npm install react-scripts --save-dev

echo "Running the production build..."
npx react-scripts build

echo "Frontend build complete. Artifacts are in 'frontend/build'."
cd ..

# --- Prepare Backend ---
print_banner "Step 2: Copying Frontend Artifacts to Backend"
BACKEND_STATIC_DIR="$(dirname "$0")/backend/src/main/resources/static"
FRONTEND_BUILD_DIR="$(dirname "$0")/frontend/build"

echo "Preparing backend static resources directory..."
# Remove existing static files to ensure a clean copy
rm -rf "$BACKEND_STATIC_DIR"
# Create the static directory
mkdir -p "$BACKEND_STATIC_DIR"

echo "Copying frontend build files from '$FRONTEND_BUILD_DIR' to '$BACKEND_STATIC_DIR'..."
cp -R "$FRONTEND_BUILD_DIR"/* "$BACKEND_STATIC_DIR"/
echo "Frontend artifacts successfully copied."

# --- Build Backend ---
print_banner "Step 3: Building the Backend Application (Fat Jar)"
echo "Navigating to 'backend' directory..."
cd "$(dirname "$0")/backend"

echo "Building the Spring Boot application using Maven..."
# Use Maven wrapper if available, otherwise use system's mvn
if [ -f "./mvnw" ]; then
  ./mvnw clean package
else
  mvn clean package
fi
echo "Backend build complete."
cd ..

# --- Final Summary ---
print_banner "Build Process Finished"
# The JAR name is typically defined in the pom.xml. This is a common default.
JAR_NAME="ghas-vulnerability-insights-0.0.1-SNAPSHOT.jar"
JAR_PATH="backend/target/$JAR_NAME"

echo "The final packaged application is located at:"
echo "  $JAR_PATH"
echo
echo "To run the application, use the following command:"
echo "  java -jar $JAR_PATH"
echo
