# Lightweight Scheduling System

A modern, lightweight scheduling system similar to Calendly, built with React + TypeScript frontend and Node.js + Express + TypeScript backend with MongoDB.

## Features

### For Users (Authenticated)
- **User Authentication**: Register and login with email/password
- **Availability Management**: Add availability slots with date and time ranges
- **Booking Link Generation**: Create shareable booking links
- **Dashboard**: View all availability slots and booking links

### For Visitors (Public)
- **Public Booking**: Access booking links to schedule appointments
- **Date Selection**: Choose from available dates
- **Time Slot Selection**: Pick from available 30-minute time slots
- **Booking Confirmation**: Complete booking with contact details

### Public Booking Link Flow
- **Valid Links**: Visitors can open a generated booking link to view available slots.
- **Invalid Links**: Any attempt to open a link that hasn't been generated or is inactive will result in a 404 "Not Found" error.
- **Calendar View**: The booking page displays a calendar for selecting a future available date.
- **Time Slot Bubbles**: Upon selecting a date, visitors see a list of available time slots, styled as bubbles or chips, based on the user's defined availability.
- **Booking a Slot**: Visitors can select a time slot and click "Book" to confirm their appointment.
- **Real-time Availability**: Once a time slot is booked, it will no longer appear as available for that specific booking link, preventing double bookings. Other booking links remain unaffected.

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Schedular
```

### 2. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit .env file with your configuration
# MONGODB_URI=mongodb://localhost:27017/scheduler
# JWT_SECRET=your-super-secret-jwt-key
# PORT=5000

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Database Setup

Make sure MongoDB is running. The application will automatically create the necessary collections when it starts.

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Availability
- `POST /api/availability` - Create availability slot
- `GET /api/availability` - Get user's availability slots
- `PUT /api/availability/:id` - Update availability slot
- `DELETE /api/availability/:id` - Delete availability slot

### Booking Links
- `POST /api/booking-link` - Generate booking link
- `GET /api/booking-link` - Get user's booking links
- `GET /api/booking-link/:linkId` - Get booking link details

### Bookings
- `POST /api/booking` - Create booking (public)
- `GET /api/booking/available/:linkId` - Get available time slots
- `GET /api/booking/my-bookings` - Get user's bookings

## Usage

### For Users

1. **Register/Login**: Create an account or sign in
2. **Add Availability**: Select dates and time ranges when you're available
3. **Generate Booking Link**: Create a shareable link for others to book time
4. **Share Link**: Send the generated link to people who want to book time with you

### For Visitors

1. **Access Link**: Open the shared booking link
2. **Select Date**: Choose from available dates
3. **Pick Time**: Select from available 30-minute time slots
4. **Enter Details**: Provide name, email, and optional notes
5. **Confirm Booking**: Complete the booking process

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context (Auth)
│   │   ├── pages/          # Page components
│   │   └── App.tsx         # Main app component
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   └── index.ts        # Server entry point
│   └── package.json
└── README.md
```

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/scheduler
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

## Development

### Backend Commands
```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm start        # Start production server
```

### Frontend Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```
