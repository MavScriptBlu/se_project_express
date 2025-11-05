# WTWR Windows Setup Script
# Run this in PowerShell with: .\setup-windows.ps1

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  WTWR App - Windows Setup Script" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "NOTE: Not running as Administrator. Some operations may require elevated privileges." -ForegroundColor Yellow
    Write-Host ""
}

# Step 1: Check Prerequisites
Write-Host "Step 1: Checking prerequisites..." -ForegroundColor Green
Write-Host "-----------------------------------"

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found!" -ForegroundColor Red
    Write-Host "  Please install from: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "  Press Enter to open the download page..." -ForegroundColor Yellow
    Read-Host
    Start-Process "https://nodejs.org/"
    Write-Host "  Install Node.js and run this script again." -ForegroundColor Yellow
    exit 1
}

# Check npm
try {
    $npmVersion = npm --version
    Write-Host "✓ npm installed: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm not found! Please install Node.js which includes npm." -ForegroundColor Red
    exit 1
}

# Check Git
try {
    $gitVersion = git --version
    Write-Host "✓ Git installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Git not found!" -ForegroundColor Red
    Write-Host "  Please install from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "  Press Enter to open the download page..." -ForegroundColor Yellow
    Read-Host
    Start-Process "https://git-scm.com/download/win"
    Write-Host "  Install Git and run this script again." -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Step 2: Check MongoDB
Write-Host "Step 2: Checking MongoDB..." -ForegroundColor Green
Write-Host "-----------------------------------"

$mongoRunning = Get-Service -Name MongoDB -ErrorAction SilentlyContinue

if ($mongoRunning -and $mongoRunning.Status -eq 'Running') {
    Write-Host "✓ MongoDB is running" -ForegroundColor Green
} elseif ($mongoRunning) {
    Write-Host "⚠ MongoDB installed but not running. Starting..." -ForegroundColor Yellow
    try {
        Start-Service -Name MongoDB
        Write-Host "✓ MongoDB started successfully" -ForegroundColor Green
    } catch {
        Write-Host "✗ Could not start MongoDB. Please start it manually." -ForegroundColor Red
    }
} else {
    Write-Host "✗ MongoDB not found!" -ForegroundColor Red
    Write-Host "  Please install MongoDB Community Server from:" -ForegroundColor Yellow
    Write-Host "  https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
    Write-Host "  Press Enter to open the download page..." -ForegroundColor Yellow
    Read-Host
    Start-Process "https://www.mongodb.com/try/download/community"
    Write-Host "  Install MongoDB and run this script again." -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Step 3: Ask for installation directory
Write-Host "Step 3: Choose installation location..." -ForegroundColor Green
Write-Host "-----------------------------------"

$defaultPath = "C:\projects"
$installPath = Read-Host "Enter installation directory (default: $defaultPath)"

if ([string]::IsNullOrWhiteSpace($installPath)) {
    $installPath = $defaultPath
}

Write-Host "Installing to: $installPath" -ForegroundColor Cyan

# Create directory if it doesn't exist
if (-not (Test-Path $installPath)) {
    New-Item -ItemType Directory -Path $installPath | Out-Null
    Write-Host "✓ Created directory: $installPath" -ForegroundColor Green
}

Write-Host ""

# Step 4: Clone repositories
Write-Host "Step 4: Cloning repositories..." -ForegroundColor Green
Write-Host "-----------------------------------"

Set-Location $installPath

# Clone backend
$backendPath = Join-Path $installPath "se_project_express"
if (Test-Path $backendPath) {
    Write-Host "✓ Backend already exists. Updating..." -ForegroundColor Yellow
    Set-Location $backendPath
    git pull
} else {
    Write-Host "Cloning backend..." -ForegroundColor Cyan
    git clone https://github.com/MavScriptBlu/se_project_express.git
    Set-Location $backendPath
    git checkout claude/backend-setup-011CUoDKxcgTd7Qsg2JZN2pT
    Write-Host "✓ Backend cloned" -ForegroundColor Green
}

Set-Location $installPath

# Clone frontend
$frontendPath = Join-Path $installPath "se_project_react"
if (Test-Path $frontendPath) {
    Write-Host "✓ Frontend already exists. Updating..." -ForegroundColor Yellow
    Set-Location $frontendPath
    git pull
} else {
    Write-Host "Cloning frontend..." -ForegroundColor Cyan
    git clone https://github.com/MavScriptBlu/se_project_react.git
    Write-Host "✓ Frontend cloned" -ForegroundColor Green
}

Write-Host ""

# Step 5: Setup Backend
Write-Host "Step 5: Setting up backend..." -ForegroundColor Green
Write-Host "-----------------------------------"

Set-Location $backendPath

# Install dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
npm install

# Create .env file
$envPath = Join-Path $backendPath ".env"
if (-not (Test-Path $envPath)) {
    Write-Host "Creating backend .env file..." -ForegroundColor Cyan
    @"
PORT=3001
MONGODB_URI=mongodb://127.0.0.1:27017/wtwr_db
FRONTEND_URL=http://localhost:3000
"@ | Out-File -FilePath $envPath -Encoding utf8
    Write-Host "✓ Backend .env created" -ForegroundColor Green
} else {
    Write-Host "✓ Backend .env already exists" -ForegroundColor Green
}

# Initialize database
Write-Host "Initializing database..." -ForegroundColor Cyan
npm run init-db

Write-Host ""

# Step 6: Setup Frontend
Write-Host "Step 6: Setting up frontend..." -ForegroundColor Green
Write-Host "-----------------------------------"

Set-Location $frontendPath

# Install dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
npm install

# Create .env file
$envPath = Join-Path $frontendPath ".env"
if (-not (Test-Path $envPath)) {
    Write-Host "Creating frontend .env file..." -ForegroundColor Cyan
    "VITE_BACKEND_URL=http://localhost:3001" | Out-File -FilePath $envPath -Encoding utf8
    Write-Host "✓ Frontend .env created" -ForegroundColor Green
} else {
    Write-Host "✓ Frontend .env already exists" -ForegroundColor Green
}

Write-Host ""

# Security fix reminder
Write-Host "⚠ SECURITY FIX NEEDED:" -ForegroundColor Yellow
Write-Host "  Please update frontend package.json line 26:" -ForegroundColor Yellow
Write-Host "  Change: `"vite`": `"^6.3.6`"" -ForegroundColor Red
Write-Host "  To:     `"vite`": `"^6.4.1`"" -ForegroundColor Green
Write-Host "  Then run: npm install" -ForegroundColor Yellow
Write-Host ""

# Done!
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  🎉 Setup Complete!" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📂 Installation Location:" -ForegroundColor Cyan
Write-Host "   Backend:  $backendPath"
Write-Host "   Frontend: $frontendPath"
Write-Host ""
Write-Host "🚀 To start your application:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Terminal 1 (Backend):" -ForegroundColor Yellow
Write-Host "   cd $backendPath"
Write-Host "   npm run dev"
Write-Host ""
Write-Host "   Terminal 2 (Frontend):" -ForegroundColor Yellow
Write-Host "   cd $frontendPath"
Write-Host "   npm run dev"
Write-Host ""
Write-Host "   Then open: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "📚 Documentation: $backendPath\WINDOWS_SETUP.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "Happy coding! 🎈" -ForegroundColor Cyan
Write-Host ""
