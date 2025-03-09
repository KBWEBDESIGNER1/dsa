#!/bin/bash

# Exit on error
set -e

# Print commands before execution
set -x

# Install dependencies
npm ci

# Build the React application
CI=false npm run build 