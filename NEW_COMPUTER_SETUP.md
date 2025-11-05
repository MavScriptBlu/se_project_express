# WTWR App - Brand New Computer Setup

## 🆕 Starting from Scratch? Start Here!

This guide is for setting up the WTWR (What to Wear?) application on a **completely new computer** with nothing installed yet.

---

## 📋 Prerequisites to Install First

### 1. Install Node.js and npm

```bash
# Check if already installed
node --version
npm --version

# If not installed, install Node.js (includes npm)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v20.x.x or higher
npm --version   # Should show 10.x.x or higher
```

### 2. Install Git

```bash
# Check if already installed
git --version

# If not installed
sudo apt-get update
sudo apt-get install -y git

# Configure git (replace with your info)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## 🚀 Complete Setup from Scratch

### Step 1: Clone Both Repositories

```bash
# Create a projects folder (or use any location you prefer)
mkdir -p ~/projects
cd ~/projects

# Clone the backend
git clone https://github.com/MavScriptBlu/se_project_express.git

# Clone the frontend
git clone https://github.com/MavScriptBlu/se_project_react.git
```

### Step 2: Install MongoDB

```bash
cd ~/projects/se_project_express

# Run the automated MongoDB setup script
chmod +x scripts/setup-mongodb.sh
./scripts/setup-mongodb.sh
```

**What this script does:**
- Installs MongoDB on your Ubuntu system
- Starts the MongoDB service
- Enables MongoDB to start automatically on boot

**Alternative if script doesn't work:**
```bash
sudo apt-get update
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
sudo systemctl status mongodb  # Verify it's running
```

### Step 3: Setup Backend

```bash
cd ~/projects/se_project_express

# Checkout the latest development branch
git checkout claude/backend-setup-011CUoDKxcgTd7Qsg2JZN2pT
git pull origin claude/backend-setup-011CUoDKxcgTd7Qsg2JZN2pT

# Install dependencies
npm install

# Initialize the database with test user and sample data
npm run init-db
```

**Expected output from `npm run init-db`:**
```
========================================
WTWR Database Initialization
========================================

Connecting to MongoDB...
✓ Connected to MongoDB successfully!

✓ Database cleared

Creating test user...
✓ Test user created: Elise Bouer (ID: 6863bbc8eb627a884f678c38)

Creating sample clothing items...
✓ Created 9 clothing items:

  1. Cap (hot weather)
  2. Hoodie (warm weather)
  3. Jacket (cold weather)
  4. Sneakers (warm weather)
  5. T-Shirt (hot weather)
  6. Coat (cold weather)
  7. Boots (cold weather)
  8. Dress (hot weather)
  9. Scarf (cold weather)

========================================
Database Initialization Complete!
========================================
```

### Step 4: Start the Backend Server

```bash
# Still in ~/projects/se_project_express
npm run dev
```

**Expected output:**
```
Server is running on port 3001
Connected to MongoDB
```

✅ **Leave this terminal running!** Backend is now live at `http://localhost:3001`

### Step 5: Setup Frontend (New Terminal)

Open a **new terminal window** (Ctrl+Shift+T):

```bash
cd ~/projects/se_project_react

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

**Expected output:**
```
VITE v6.3.6  ready in 500 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

✅ **Leave this terminal running too!** Frontend is now live at `http://localhost:3000`

### Step 6: Open Your Application

Open your browser and go to:

**http://localhost:3000**

You should see:
- ✅ Weather information for your location
- ✅ 9 sample clothing items displayed
- ✅ Ability to add new items
- ✅ Ability to delete items
- ✅ No CORS errors in the browser console

---

## 🎯 Quick Summary

### What You Just Did:
1. ✅ Cloned both frontend and backend repositories
2. ✅ Installed MongoDB database
3. ✅ Created database with test user and 9 sample clothing items
4. ✅ Started backend server (port 3001)
5. ✅ Started frontend server (port 3000)
6. ✅ Connected both apps to work together

### What's Running:
- **Backend:** `http://localhost:3001` (Express + MongoDB)
- **Frontend:** `http://localhost:3000` (React + Vite)
- **MongoDB:** Running on port 27017

---

## 🔄 Daily Development Workflow

After the initial setup, here's how to start your app each day:

### Terminal 1 - Backend:
```bash
cd ~/projects/se_project_express
npm run dev
```

### Terminal 2 - Frontend:
```bash
cd ~/projects/se_project_react
npm run dev
```

Then open: `http://localhost:3000`

---

## ❌ Troubleshooting

### "MongoDB is not running"

```bash
# Start MongoDB
sudo systemctl start mongodb

# Check status
sudo systemctl status mongodb

# If it shows "active (running)" you're good!
```

### "Port 3001 or 3000 already in use"

```bash
# Find what's using the port
sudo lsof -i :3001  # or :3000

# Kill the process
sudo kill -9 <PID>

# Or restart your computer (easiest)
```

### "Cannot connect to backend" or CORS errors

Make sure:
1. Backend is running (Terminal 1 should show "Server is running on port 3001")
2. MongoDB is running (`sudo systemctl status mongodb`)
3. Both `.env` files exist:
   - `~/projects/se_project_express/.env`
   - `~/projects/se_project_react/.env`

If `.env` files are missing, create them:

**Backend `.env`** (at `~/projects/se_project_express/.env`):
```env
PORT=3001
MONGODB_URI=mongodb://127.0.0.1:27017/wtwr_db
FRONTEND_URL=http://localhost:3000
```

**Frontend `.env`** (at `~/projects/se_project_react/.env`):
```env
VITE_BACKEND_URL=http://localhost:3001
```

### "No clothing items showing up"

```bash
cd ~/projects/se_project_express
npm run init-db
```

This will reset and repopulate your database.

### "git checkout failed" or "branch not found"

If the development branch doesn't exist yet, just use main:

```bash
cd ~/projects/se_project_express
git checkout main
git pull origin main
```

The `.env` files and scripts should still be there if they've been merged.

---

## 🖥️ One-Line Commands (After Initial Setup)

### Start Everything (run each in separate terminals):
```bash
# Terminal 1
cd ~/projects/se_project_express && npm run dev

# Terminal 2
cd ~/projects/se_project_react && npm run dev
```

### Stop Everything:
Press `Ctrl+C` in each terminal

### Reset Database:
```bash
cd ~/projects/se_project_express && npm run init-db
```

---

## 📁 Your Project Structure

After setup, you'll have:
```
~/projects/
├── se_project_express/          (Backend - Express + MongoDB)
│   ├── app.js                   (Main server file)
│   ├── models/                  (Database schemas)
│   ├── routes/                  (API endpoints)
│   ├── controllers/             (Business logic)
│   ├── scripts/                 (Setup scripts)
│   │   ├── setup-mongodb.sh
│   │   └── init-database.js
│   ├── .env                     (Environment variables)
│   ├── SETUP.md                 (Detailed docs)
│   └── QUICKSTART.md            (Quick reference)
│
└── se_project_react/            (Frontend - React + Vite)
    ├── src/                     (React components)
    │   ├── components/          (UI components)
    │   └── utils/               (API calls, helpers)
    ├── .env                     (Environment variables)
    └── vite.config.js           (Build configuration)
```

---

## 🎓 What's Included in Your Database

After running `npm run init-db`, you'll have:

**Test User:**
- Name: Elise Bouer
- ID: 6863bbc8eb627a884f678c38
- Avatar: Professional profile image

**9 Clothing Items:**
| Item | Weather | Use Case |
|------|---------|----------|
| Cap | Hot | Summer sun protection |
| T-Shirt | Hot | Casual summer wear |
| Dress | Hot | Hot weather outfit |
| Hoodie | Warm | Spring/Fall comfort |
| Sneakers | Warm | Everyday footwear |
| Jacket | Cold | Winter outer layer |
| Coat | Cold | Heavy winter wear |
| Boots | Cold | Winter footwear |
| Scarf | Cold | Winter accessory |

---

## 🚀 Next Steps

Now that your app is running:

1. **Explore the UI** - Add/delete clothing items
2. **Check the weather** - See how it updates based on your location
3. **Open DevTools** - Check the Network tab to see API calls
4. **Make changes** - Edit code and see hot-reload in action
5. **Learn the codebase** - Read through the components and API routes

---

## 📚 Additional Resources

- Backend docs: `~/projects/se_project_express/SETUP.md`
- Quick reference: `~/projects/se_project_express/QUICKSTART.md`
- MongoDB docs: https://docs.mongodb.com/
- Express docs: https://expressjs.com/
- React docs: https://react.dev/
- Vite docs: https://vitejs.dev/

---

## 💡 Pro Tips

### Create Terminal Aliases (Optional)

Add to your `~/.bashrc` or `~/.zshrc`:

```bash
alias start-wtwr-backend='cd ~/projects/se_project_express && npm run dev'
alias start-wtwr-frontend='cd ~/projects/se_project_react && npm run dev'
alias reset-wtwr-db='cd ~/projects/se_project_express && npm run init-db'
```

Then reload: `source ~/.bashrc`

Now you can just type:
- `start-wtwr-backend`
- `start-wtwr-frontend`
- `reset-wtwr-db`

---

## 🆘 Still Having Issues?

1. Make sure MongoDB is running: `sudo systemctl status mongodb`
2. Check Node version: `node --version` (should be v14+)
3. Check if ports are free: `sudo lsof -i :3000` and `sudo lsof -i :3001`
4. Restart MongoDB: `sudo systemctl restart mongodb`
5. Reinstall dependencies: `rm -rf node_modules && npm install`
6. Reset database: `npm run init-db`

---

**You're all set! Happy coding! 🎉**
