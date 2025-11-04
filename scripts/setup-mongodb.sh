#!/bin/bash

# WTWR MongoDB Setup Script
# This script installs MongoDB on Ubuntu and sets up the initial database

echo "========================================="
echo "WTWR MongoDB Setup Script"
echo "========================================="
echo ""

# Check if running on Ubuntu
if [ ! -f /etc/os-release ]; then
    echo "ERROR: Cannot detect OS. This script is designed for Ubuntu."
    exit 1
fi

source /etc/os-release
if [[ "$ID" != "ubuntu" ]]; then
    echo "ERROR: This script is designed for Ubuntu. Your OS: $ID"
    exit 1
fi

echo "Detected: $PRETTY_NAME"
echo ""

# Install MongoDB
echo "Step 1: Installing MongoDB..."
echo "----------------------------"

# Update package list
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb

# Check if installation was successful
if ! command -v mongod &> /dev/null; then
    echo "ERROR: MongoDB installation failed!"
    echo "Trying alternative installation method..."

    # Try installing mongodb-server instead
    sudo apt-get install -y mongodb-server
fi

# Verify installation
if command -v mongod &> /dev/null; then
    echo "✓ MongoDB installed successfully!"
    mongod --version
else
    echo "✗ MongoDB installation failed. Please install manually."
    exit 1
fi

echo ""

# Start MongoDB
echo "Step 2: Starting MongoDB service..."
echo "-----------------------------------"

# Try different service management methods
if sudo systemctl start mongodb 2>/dev/null; then
    echo "✓ MongoDB started via systemctl"
    sudo systemctl enable mongodb
elif sudo service mongodb start 2>/dev/null; then
    echo "✓ MongoDB started via service"
else
    echo "✗ Could not start MongoDB automatically"
    echo "Try running manually: sudo systemctl start mongodb"
    exit 1
fi

# Wait for MongoDB to start
sleep 3

# Check if MongoDB is running
if pgrep -x mongod > /dev/null; then
    echo "✓ MongoDB is running!"
else
    echo "✗ MongoDB failed to start"
    exit 1
fi

echo ""
echo "========================================="
echo "MongoDB Installation Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Run: node scripts/init-database.js"
echo "2. Start backend: npm run dev"
echo "3. Start frontend: cd ../se_project_react && npm run dev"
echo ""
