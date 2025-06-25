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

## Tech Stack

### Frontend
- React 19 with TypeScript
- React Router for navigation
- Axios for API calls
- React DatePicker for date selection
- React Hot Toast for notifications
- Vite for build tooling

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Express validation for input validation

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

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

## Features Implemented

✅ User authentication (register/login)  
✅ JWT-based authentication  
✅ Availability slot management  
✅ Booking link generation  
✅ Public booking interface  
✅ Date and time selection  
✅ Conflict-free booking system  
✅ Responsive design  
✅ Form validation (client & server)  
✅ Error handling and user feedback  
✅ Modern UI/UX design  

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Input validation and sanitization
- CORS configuration
- Rate limiting
- Helmet.js security headers

## Performance Considerations

- Database indexing for efficient queries
- Optimized API responses
- Client-side state management
- Lazy loading of components
- Efficient date/time handling

## Future Enhancements

- Email notifications
- Calendar integration
- Recurring availability
- Booking cancellation
- Admin dashboard
- Analytics and reporting
- Multi-language support
- Mobile app

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. 