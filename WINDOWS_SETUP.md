# WTWR App - Windows Setup Guide

## 🪟 Complete Setup for Windows 10/11

Since you're on Windows, follow these steps to set up your WTWR application.

---

## Step 1: Install Node.js (includes npm)

1. Go to: https://nodejs.org/
2. Download the **LTS version** (20.x or higher)
3. Run the installer
4. Click through the installer (accept all defaults)
5. Verify installation:

```powershell
node --version
npm --version
```

Expected output: Node v20+ and npm v10+

---

## Step 2: Install Git for Windows

1. Go to: https://git-scm.com/download/win
2. Download and run the installer
3. During installation:
   - Use default options
   - Select "Git from the command line and also from 3rd-party software"
   - Use "Checkout Windows-style, commit Unix-style line endings"
4. Verify installation:

```powershell
git --version
```

5. Configure Git:

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## Step 3: Install MongoDB

### Option A: MongoDB Community Server (Local Installation)

1. Go to: https://www.mongodb.com/try/download/community
2. Download **MongoDB Community Server** for Windows
3. Run the installer:
   - Choose "Complete" installation
   - Install MongoDB as a Service ✓
   - Install MongoDB Compass (optional but helpful) ✓
4. MongoDB will start automatically as a Windows service

### Option B: MongoDB Atlas (Cloud - Easier!)

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a free cluster (M0)
4. Get your connection string
5. Update `.env` file later with your Atlas connection string

**For beginners, Option A (local) is recommended for development.**

---

## Step 4: Clone Repositories

Open PowerShell and run:

```powershell
# Create a projects folder
mkdir C:\projects
cd C:\projects

# Clone backend with security fixes
git clone https://github.com/MavScriptBlu/se_project_express.git
cd se_project_express
git checkout claude/backend-setup-011CUoDKxcgTd7Qsg2JZN2pT

# Clone frontend
cd C:\projects
git clone https://github.com/MavScriptBlu/se_project_react.git
```

---

## Step 5: Setup Backend

```powershell
cd C:\projects\se_project_express

# Install dependencies (includes security fixes!)
npm install

# Create .env file
New-Item -Path .env -ItemType File

# Edit .env file - add these lines:
# PORT=3001
# MONGODB_URI=mongodb://127.0.0.1:27017/wtwr_db
# FRONTEND_URL=http://localhost:3000

# Use Notepad to edit:
notepad .env
```

In Notepad, paste:
```
PORT=3001
MONGODB_URI=mongodb://127.0.0.1:27017/wtwr_db
FRONTEND_URL=http://localhost:3000
```
Save and close.

**Initialize the database:**
```powershell
npm run init-db
```

Expected output:
```
✓ Connected to MongoDB successfully!
✓ Test user created: Elise Bouer
✓ Created 9 clothing items
```

---

## Step 6: Setup Frontend

```powershell
cd C:\projects\se_project_react

# Install dependencies
npm install

# Create .env file
New-Item -Path .env -ItemType File
notepad .env
```

In Notepad, paste:
```
VITE_BACKEND_URL=http://localhost:3001
```
Save and close.

**Apply Security Fix:**

Edit `package.json`:
```powershell
notepad package.json
```

Find line 26:
```json
"vite": "^6.3.6"
```

Change to:
```json
"vite": "^6.4.1"
```

Save and close. Then reinstall:
```powershell
npm install
```

---

## Step 7: Start Your Application

### Terminal 1 - Start Backend

```powershell
cd C:\projects\se_project_express
npm run dev
```

Expected output:
```
Server is running on port 3001
Connected to MongoDB
```

**Keep this window open!**

### Terminal 2 - Start Frontend

Open a **NEW** PowerShell window:

```powershell
cd C:\projects\se_project_react
npm run dev
```

Expected output:
```
VITE v6.4.1  ready in 500 ms
➜  Local:   http://localhost:3000/
```

**Keep this window open too!**

---

## Step 8: Open Your Browser

Navigate to: **http://localhost:3000**

You should see:
- ✅ Weather information
- ✅ 9 clothing items
- ✅ Working add/delete functionality

---

## 🎯 Quick Command Reference

### Start Backend (PowerShell)
```powershell
cd C:\projects\se_project_express
npm run dev
```

### Start Frontend (New PowerShell)
```powershell
cd C:\projects\se_project_react
npm run dev
```

### Reset Database
```powershell
cd C:\projects\se_project_express
npm run init-db
```

### Check MongoDB is Running
```powershell
# Open Services
services.msc
# Look for "MongoDB Server" - should be "Running"
```

---

## ❌ Troubleshooting

### MongoDB Connection Error

**If you see "MongoServerError: connect ECONNREFUSED":**

1. Open Services (Win + R, type `services.msc`)
2. Find "MongoDB Server" in the list
3. Right-click → Start
4. Right-click → Properties → Set Startup Type to "Automatic"

Or restart the service:
```powershell
net stop MongoDB
net start MongoDB
```

### Port Already in Use

**If port 3001 or 3000 is in use:**

```powershell
# Find what's using the port
netstat -ano | findstr :3001

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

### Firewall Blocking MongoDB

If Windows Firewall asks about MongoDB:
- Click "Allow access"

### PowerShell Execution Policy Error

If you get "execution policy" errors:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## 🔒 Security Status

After following these steps:
- ✅ Backend: validator vulnerability **FIXED** (13.15.20)
- ✅ Backend: mongoose **UPDATED** (8.19.3)
- ✅ Frontend: vite vulnerability **FIXED** (6.4.1) - after you edit package.json
- ✅ 0 vulnerabilities in both repos

Verify with:
```powershell
# In backend folder
npm audit

# In frontend folder
npm audit
```

Both should show: **"found 0 vulnerabilities"**

---

## 📁 Your Project Structure

```
C:\projects\
├── se_project_express\      (Backend - Express + MongoDB)
│   ├── app.js               (Main server)
│   ├── models\              (Database schemas)
│   ├── routes\              (API endpoints)
│   ├── .env                 (Config - PORT, MONGODB_URI, FRONTEND_URL)
│   └── package.json
│
└── se_project_react\        (Frontend - React + Vite)
    ├── src\                 (React components)
    ├── .env                 (Config - VITE_BACKEND_URL)
    └── package.json
```

---

## 💡 Windows-Specific Tips

### Use Windows Terminal (Recommended)

Windows Terminal is better than default PowerShell:
1. Install from Microsoft Store: "Windows Terminal"
2. Open it, run your commands there
3. Can have multiple tabs (one for backend, one for frontend)

### MongoDB Compass

If you installed MongoDB Compass (GUI for MongoDB):
1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. Browse the `wtwr_db` database
4. See your users and clothing items visually

### VS Code Integration

If using VS Code:
1. Open C:\projects folder in VS Code
2. Use integrated terminal (Ctrl + `)
3. Can run both backend and frontend in split terminals

---

## 🚀 You're All Set!

Once both servers are running:
- Backend: http://localhost:3001 (API)
- Frontend: http://localhost:3000 (Your app)

Open http://localhost:3000 in your browser and start coding! 🎉

---

## 📚 More Help

- Full setup docs: See `SETUP.md` in backend repo
- Security info: See `SECURITY_UPDATES.md` in backend repo
- Quick reference: See `QUICKSTART.md` in backend repo

All documentation is in the backend repository at:
`C:\projects\se_project_express\`
