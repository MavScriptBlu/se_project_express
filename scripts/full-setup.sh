#!/bin/bash

# WTWR Full Setup Script - For Brand New Computers
# This script sets up EVERYTHING from scratch

set -e  # Exit on any error

echo ""
echo "=============================================="
echo "  WTWR App - Complete Setup from Scratch"
echo "=============================================="
echo ""
echo "This script will:"
echo "  1. Clone both frontend and backend repos"
echo "  2. Install MongoDB"
echo "  3. Set up the database"
echo "  4. Install all dependencies"
echo "  5. Create environment files"
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."
echo ""

# ============================================
# Step 1: Check Prerequisites
# ============================================
echo "Step 1: Checking prerequisites..."
echo "-----------------------------------"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "Git not found. Installing..."
    sudo apt-get update
    sudo apt-get install -y git
    echo "✓ Git installed"
else
    echo "✓ Git already installed ($(git --version))"
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js not found. Installing..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo "✓ Node.js installed"
else
    echo "✓ Node.js already installed ($(node --version))"
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "✗ npm not found. Please install Node.js which includes npm."
    exit 1
else
    echo "✓ npm already installed ($(npm --version))"
fi

echo ""

# ============================================
# Step 2: Clone Repositories
# ============================================
echo "Step 2: Cloning repositories..."
echo "-----------------------------------"

# Ask user where to install
read -p "Enter installation directory (default: ~/projects): " INSTALL_DIR
INSTALL_DIR=${INSTALL_DIR:-~/projects}
INSTALL_DIR="${INSTALL_DIR/#\~/$HOME}"  # Expand ~ to $HOME

# Create directory
mkdir -p "$INSTALL_DIR"
cd "$INSTALL_DIR"

echo "Installing to: $INSTALL_DIR"
echo ""

# Clone backend
if [ -d "se_project_express" ]; then
    echo "✓ Backend already cloned"
    cd se_project_express
    git pull
    cd ..
else
    echo "Cloning backend..."
    git clone https://github.com/MavScriptBlu/se_project_express.git
    echo "✓ Backend cloned"
fi

# Clone frontend
if [ -d "se_project_react" ]; then
    echo "✓ Frontend already cloned"
    cd se_project_react
    git pull
    cd ..
else
    echo "Cloning frontend..."
    git clone https://github.com/MavScriptBlu/se_project_react.git
    echo "✓ Frontend cloned"
fi

echo ""

# ============================================
# Step 3: Install MongoDB
# ============================================
echo "Step 3: Installing MongoDB..."
echo "-----------------------------------"

if command -v mongod &> /dev/null; then
    echo "✓ MongoDB already installed ($(mongod --version | head -n 1))"
else
    echo "Installing MongoDB..."
    sudo apt-get update
    sudo apt-get install -y mongodb

    if command -v mongod &> /dev/null; then
        echo "✓ MongoDB installed successfully"
    else
        echo "✗ MongoDB installation failed"
        exit 1
    fi
fi

# Start MongoDB
echo "Starting MongoDB service..."
if sudo systemctl start mongodb 2>/dev/null; then
    echo "✓ MongoDB started via systemctl"
    sudo systemctl enable mongodb
elif sudo service mongodb start 2>/dev/null; then
    echo "✓ MongoDB started via service"
else
    echo "⚠ Could not start MongoDB automatically"
    echo "  Try running: sudo systemctl start mongodb"
fi

# Wait for MongoDB to start
sleep 3

# Check if MongoDB is running
if pgrep -x mongod > /dev/null; then
    echo "✓ MongoDB is running"
else
    echo "⚠ MongoDB may not be running. Please check manually."
fi

echo ""

# ============================================
# Step 4: Setup Backend
# ============================================
echo "Step 4: Setting up backend..."
echo "-----------------------------------"

cd "$INSTALL_DIR/se_project_express"

# Checkout development branch (if exists)
if git ls-remote --heads origin claude/backend-setup-011CUoDKxcgTd7Qsg2JZN2pT | grep -q claude; then
    echo "Checking out development branch..."
    git checkout claude/backend-setup-011CUoDKxcgTd7Qsg2JZN2pT
    git pull origin claude/backend-setup-011CUoDKxcgTd7Qsg2JZN2pT
else
    echo "Using main branch..."
    git checkout main
    git pull origin main
fi

# Install dependencies
echo "Installing backend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating backend .env file..."
    cat > .env << 'EOF'
PORT=3001
MONGODB_URI=mongodb://127.0.0.1:27017/wtwr_db
FRONTEND_URL=http://localhost:3000
EOF
    echo "✓ Backend .env created"
else
    echo "✓ Backend .env already exists"
fi

# Initialize database
echo "Initializing database with sample data..."
npm run init-db

echo ""

# ============================================
# Step 5: Setup Frontend
# ============================================
echo "Step 5: Setting up frontend..."
echo "-----------------------------------"

cd "$INSTALL_DIR/se_project_react"

# Install dependencies
echo "Installing frontend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating frontend .env file..."
    cat > .env << 'EOF'
VITE_BACKEND_URL=http://localhost:3001
EOF
    echo "✓ Frontend .env created"
else
    echo "✓ Frontend .env already exists"
fi

echo ""

# ============================================
# Setup Complete!
# ============================================
echo "=============================================="
echo "  🎉 Setup Complete!"
echo "=============================================="
echo ""
echo "Your WTWR app is ready to run!"
echo ""
echo "📂 Installation Location:"
echo "   Backend:  $INSTALL_DIR/se_project_express"
echo "   Frontend: $INSTALL_DIR/se_project_react"
echo ""
echo "🚀 To start the app:"
echo ""
echo "   Terminal 1 (Backend):"
echo "   $ cd $INSTALL_DIR/se_project_express"
echo "   $ npm run dev"
echo ""
echo "   Terminal 2 (Frontend):"
echo "   $ cd $INSTALL_DIR/se_project_react"
echo "   $ npm run dev"
echo ""
echo "   Then open: http://localhost:3000"
echo ""
echo "📚 Documentation:"
echo "   Setup guide: $INSTALL_DIR/se_project_express/NEW_COMPUTER_SETUP.md"
echo "   Quick start: $INSTALL_DIR/se_project_express/QUICKSTART.md"
echo ""
echo "🔄 To reset database:"
echo "   $ cd $INSTALL_DIR/se_project_express"
echo "   $ npm run init-db"
echo ""
echo "Happy coding! 🎈"
echo ""
