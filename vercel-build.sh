#!/bin/bash

# Exit on error
set -e

# Print commands before execution
set -x

# Install dependencies
npm ci

# Fix permissions for react-scripts
chmod +x ./node_modules/.bin/react-scripts
chmod +x ./node_modules/.bin/*

# Build the React application with CI=false to ignore warnings
CI=false npm run build 