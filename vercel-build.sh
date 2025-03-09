#!/bin/bash
echo "Installing dependencies..."
npm ci

echo "Setting execute permissions..."
chmod +x ./node_modules/.bin/react-scripts

echo "Building the application..."
CI=false ./node_modules/.bin/react-scripts build

echo "Build completed!" 