# Quick Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- MongoDB running locally or a cloud instance
- npm or yarn

## Quick Start

### 1. Install Backend Dependencies
```bash
cd server
npm install
```

### 2. Set Up Environment Variables
```bash
# In the server directory, create a .env file:
cp env.example .env

# Edit .env with your MongoDB connection string and JWT secret:
MONGODB_URI=mongodb://localhost:27017/scheduler
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development
```

### 3. Install Frontend Dependencies
```bash
cd ../client
npm install
```

### 4. Start the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### 5. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## First Steps
1. Register a new account at http://localhost:5173/register
2. Login and go to the dashboard
3. Add some availability slots
4. Generate a booking link
5. Share the link with others to test the booking flow

## Troubleshooting

### MongoDB Connection Issues
- Make sure MongoDB is running: `mongod`
- Check your connection string in `.env`
- For cloud MongoDB, use the full connection string

### Port Issues
- Backend runs on port 5000 by default
- Frontend runs on port 5173 by default
- Change ports in `.env` if needed

### CORS Issues
- Backend is configured to accept requests from localhost:5173
- If using different ports, update CORS settings in `server/src/index.ts`

## API Testing
Test the API endpoints using tools like Postman or curl:

```bash
# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
``` 