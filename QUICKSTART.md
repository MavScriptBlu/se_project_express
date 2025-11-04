# Quick Start Guide - New Computer Setup

Follow these steps to get your WTWR application running on a new computer.

## 🚀 Setup in 4 Steps

### 1️⃣ Install MongoDB

```bash
cd se_project_express
./scripts/setup-mongodb.sh
```

### 2️⃣ Initialize Database

```bash
npm install
npm run init-db
```

### 3️⃣ Start Backend

```bash
npm run dev
```

✅ Backend running at `http://localhost:3001`

### 4️⃣ Start Frontend

Open a **new terminal**:

```bash
cd se_project_react
npm install
npm run dev
```

✅ Frontend running at `http://localhost:3000`

---

## 🌐 Open Your App

Visit: **http://localhost:3000**

You should see:
- Weather display for your location
- 9 sample clothing items (Cap, Hoodie, Jacket, Sneakers, T-Shirt, Coat, Boots, Dress, Scarf)
- Ability to add/delete clothing items

---

## ✅ What You Should See

### Backend Terminal:
```
Server is running on port 3001
Connected to MongoDB
```

### Frontend Terminal:
```
VITE v6.3.6  ready in 500 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

### Browser Console:
No CORS errors ✅

---

## ❌ Troubleshooting

### MongoDB not found?
```bash
# Install manually
sudo apt-get update
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### Port already in use?
```bash
# Kill process on port 3001 or 3000
sudo lsof -i :3001
sudo kill -9 <PID>
```

### Can't see clothing items?
1. Check backend is running (port 3001)
2. Run `npm run init-db` again
3. Check MongoDB is running: `sudo systemctl status mongodb`

### CORS errors?
- Make sure both .env files exist:
  - `se_project_express/.env` → `FRONTEND_URL=http://localhost:3000`
  - `se_project_react/.env` → `VITE_BACKEND_URL=http://localhost:3001`

---

## 📚 Need More Details?

See [SETUP.md](./SETUP.md) for comprehensive documentation.

---

## 🔄 Reset Database

To clear everything and start fresh:

```bash
npm run init-db
```

This will:
- Delete all existing data
- Create a fresh test user
- Add 9 sample clothing items
