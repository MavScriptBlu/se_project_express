# WTWR Backend Setup Guide

This guide will help you set up the WTWR (What to Wear?) Express backend on your new computer.

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- Ubuntu/Debian-based Linux system

## Quick Start (For New Computers)

### Step 1: Install MongoDB

Run the automated setup script:

```bash
cd se_project_express
./scripts/setup-mongodb.sh
```

This will:
- Install MongoDB
- Start the MongoDB service
- Enable MongoDB to start on boot

**Alternative: Manual MongoDB Installation**

If the script doesn't work, install manually:

```bash
sudo apt-get update
sudo apt-get install -y mongodb

# Start MongoDB
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Verify it's running
sudo systemctl status mongodb
```

### Step 2: Install Backend Dependencies

```bash
cd se_project_express
npm install
```

### Step 3: Initialize the Database

This creates the test user and sample clothing items:

```bash
node scripts/init-database.js
```

Expected output:
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
npm run dev
```

Expected output:
```
Server is running on port 3001
Connected to MongoDB
```

The backend is now running at `http://localhost:3001`

### Step 5: Set Up and Start the Frontend

In a new terminal:

```bash
cd ../se_project_react
npm install
npm run dev
```

The frontend will start at `http://localhost:3000`

## Project Configuration

### Backend (.env file)

Location: `se_project_express/.env`

```env
PORT=3001
MONGODB_URI=mongodb://127.0.0.1:27017/wtwr_db
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env file)

Location: `se_project_react/.env`

```env
VITE_BACKEND_URL=http://localhost:3001
```

## API Endpoints

### Users
- `GET /users` - Get all users
- `GET /users/:userId` - Get user by ID
- `POST /users` - Create a new user

### Clothing Items
- `GET /items` - Get all clothing items
- `POST /items` - Create a new clothing item
- `DELETE /items/:itemId` - Delete an item
- `PUT /items/:itemId/likes` - Like an item
- `DELETE /items/:itemId/likes` - Unlike an item

## Database Information

- **Database Name**: `wtwr_db`
- **Test User ID**: `6863bbc8eb627a884f678c38`
- **Test User Name**: Elise Bouer
- **Connection URI**: `mongodb://127.0.0.1:27017/wtwr_db`

## Troubleshooting

### MongoDB won't start

```bash
# Check if MongoDB is installed
mongod --version

# Check MongoDB status
sudo systemctl status mongodb

# View MongoDB logs
sudo journalctl -u mongodb

# Restart MongoDB
sudo systemctl restart mongodb
```

### Port already in use

If port 3001 is already in use:

```bash
# Find what's using the port
sudo lsof -i :3001

# Kill the process (replace PID with actual process ID)
kill -9 PID
```

### Cannot connect to MongoDB

Make sure MongoDB is running and accepting connections:

```bash
# Test MongoDB connection
mongosh --eval "db.version()"

# Or if using older MongoDB
mongo --eval "db.version()"
```

### CORS errors in browser

Make sure:
1. Backend `.env` has `FRONTEND_URL=http://localhost:3000`
2. Frontend is running on port 3000
3. Backend is running on port 3001
4. Both servers are running simultaneously

## Resetting the Database

To clear and reinitialize the database:

```bash
node scripts/init-database.js
```

This will:
- Delete all existing users and items
- Recreate the test user
- Add sample clothing items

## Running in Production

For production deployment:

1. Update backend `.env`:
   ```env
   FRONTEND_URL=https://your-frontend-domain.com
   MONGODB_URI=mongodb://your-production-db-uri
   ```

2. Update frontend `.env`:
   ```env
   VITE_BACKEND_URL=https://your-backend-domain.com
   ```

3. Build frontend:
   ```bash
   npm run build
   ```

4. Deploy both applications to your hosting service

## Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

## Support

If you encounter issues:
1. Check that MongoDB is running
2. Verify all dependencies are installed
3. Ensure both .env files are configured correctly
4. Check that ports 3000 and 3001 are available
5. Review the console logs for error messages
