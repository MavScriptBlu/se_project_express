# 🆕 Brand New Computer? Start Here!

## One-Command Setup (Easiest Way)

If you have **nothing installed** on your new computer, run this single command:

```bash
curl -fsSL https://raw.githubusercontent.com/MavScriptBlu/se_project_express/claude/backend-setup-011CUoDKxcgTd7Qsg2JZN2pT/scripts/full-setup.sh | bash
```

This will:
- ✅ Install Node.js and Git (if needed)
- ✅ Clone both frontend and backend repos
- ✅ Install MongoDB
- ✅ Set up the database with sample data
- ✅ Install all dependencies
- ✅ Create environment files

**Time:** ~5-10 minutes

---

## Or Manual Setup (If You Prefer)

### Step 1: Install Prerequisites

```bash
# Install Git
sudo apt-get update
sudo apt-get install -y git

# Install Node.js (includes npm)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 2: Run Setup Script

```bash
# Clone the backend repo first
git clone https://github.com/MavScriptBlu/se_project_express.git
cd se_project_express

# Run the full setup
./scripts/full-setup.sh
```

This will clone the frontend, install MongoDB, and set up everything.

---

## After Setup

### Start the Backend (Terminal 1):
```bash
cd ~/projects/se_project_express
npm run dev
```

### Start the Frontend (Terminal 2):
```bash
cd ~/projects/se_project_react
npm run dev
```

### Open Your Browser:
```
http://localhost:3000
```

---

## Need More Help?

See the complete guide: [NEW_COMPUTER_SETUP.md](./NEW_COMPUTER_SETUP.md)

---

## Quick Troubleshooting

**MongoDB not running?**
```bash
sudo systemctl start mongodb
```

**Port already in use?**
```bash
sudo lsof -i :3001  # or :3000
sudo kill -9 <PID>
```

**Reset database:**
```bash
cd ~/projects/se_project_express
npm run init-db
```

---

**That's it! You're ready to code! 🚀**
