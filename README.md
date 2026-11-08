# Learning Management System (LMS)

A full-stack e-learning platform with AI-powered course recommendations, video streaming, and comprehensive course management.


## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Overview](#api-overview)
- [Database Schema](#database-schema)
- [Deployment](#deployment)

## Overview

This LMS provides educators and students with a complete e-learning solution, featuring course creation, enrollment management, video streaming, progress tracking, payment processing, and an intelligent chatbot that recommends courses based on user queries.

**Key Benefits:**
- Lightweight yet feature-complete platform
- AI-powered course guidance
- Secure payment integration
- Real-time progress tracking
- Role-based access control (Students & Educators)

## Features

**For Students:**
- Secure authentication with JWT
- Advanced course search and filtering
- Video-based learning with progress tracking
- Secure payments via Stripe
- AI chatbot for personalized recommendations
- Responsive design across devices

**For Educators:**
- Complete course management (create, edit, publish)
- Media uploads via Cloudinary
- Student enrollment analytics
- Revenue tracking
- Rich text editor for course content
- Organized course structure (sections & lectures)

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Students   │  │  Educators   │  │   AI Chatbot UI      │  │
│  │   Portal     │  │  Dashboard   │  │   (Course Assistant) │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
│         │                 │                      │               │
│         └─────────────────┴──────────────────────┘               │
│                           │                                      │
│                    React Frontend                                │
│                    (SPA with Routing)                            │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                     HTTPS/REST API
                            │
┌───────────────────────────┴─────────────────────────────────────┐
│                      APPLICATION LAYER                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │               Express.js Backend Server                   │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────────────┐   │  │
│  │  │    Auth    │ │   Course   │ │   Payment         │   │  │
│  │  │   Routes   │ │   Routes   │ │   Integration     │   │  │
│  │  └─────┬──────┘ └─────┬──────┘ └─────┬──────────────┘   │  │
│  │        │              │              │                    │  │
│  │  ┌─────┴──────────────┴──────────────┴──────────────┐   │  │
│  │  │          Middleware Layer                         │   │  │
│  │  │  • Authentication (JWT)                          │   │  │
│  │  │  • Authorization (Role-based)                    │   │  │
│  │  │  • Validation & Error Handling                   │   │  │
│  │  │  • CORS & Cookie Parser                          │   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
┌───────────────┴──────┐   ┌────────────┴──────────┐
│   DATA LAYER         │   │   EXTERNAL SERVICES   │
│  ┌────────────────┐  │   │  ┌─────────────────┐  │
│  │   MongoDB      │  │   │  │   Cloudinary    │  │
│  │   Database     │  │   │  │  (Media CDN)    │  │
│  │                │  │   │  └─────────────────┘  │
│  │ • Users        │  │   │  ┌─────────────────┐  │
│  │ • Courses      │  │   │  │  Stripe API     │  │
│  │ • Enrollments  │  │   │  │  (Payments)     │  │
│  │ • Progress     │  │   │  └─────────────────┘  │
│  └────────────────┘  │   │  ┌─────────────────┐  │
│                      │   │  │  AI Model API   │  │
│                      │   │  │  (Chatbot NLP)  │  │
│                      │   │  └─────────────────┘  │
└──────────────────────┘   └───────────────────────┘
```

### Request Flow

```
User Request → Frontend (React)
    ↓
API Call → Express Backend
    ↓
Authentication Middleware (JWT)
    ↓
Route Handler → Controller
    ↓
Database Query (MongoDB) / External Service (Cloudinary/Stripe)
    ↓
JSON Response → Frontend → UI Update
```

### Chatbot Flow

```
User Query → Intent Detection
    ↓
Database Query (if needed)
    ↓
AI Model Processing
    ↓
Personalized Response
```

## Tech Stack

**Frontend:**
- React 18+ - UI framework
- React Router - Client-side routing
- Tailwind CSS - Styling
- Quill - Rich text editor
- Axios - HTTP client

**Backend:**
- Node.js 18+ - Runtime
- Express.js - Web framework
- MongoDB - Database
- Mongoose - ODM
- JWT - Authentication
- bcrypt - Password hashing

**External Services:**
- Cloudinary - Media storage (videos/images)
- Stripe - Payment processing
- MongoDB Atlas - Cloud database

## Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### Setup Steps

**1. Clone repository**
```bash
git clone https://github.com/yourusername/lms-platform.git
cd lms-platform
```

**2. Backend setup**
```bash
cd server
npm install
cp .env.example .env
# Configure environment variables
npm run dev
```

**3. Frontend setup**
```bash
cd client
npm install
cp .env.example .env
# Set REACT_APP_API_URL=http://localhost:3000
npm start
```

## Configuration

### Backend Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lms

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Stripe
STRIPE_SECRET_KEY=sk_test_your-key
STRIPE_WEBHOOK_SECRET=whsec_your-secret

# Frontend URL
CLIENT_URL=http://localhost:3001
```

## API Overview

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Courses
- `GET /api/course` - List all courses
- `GET /api/course/:id` - Get course details
- `POST /api/course/enroll` - Enroll in course (protected)

### User (Protected)
- `GET /api/user/profile` - Get user profile
- `GET /api/user/enrollments` - Get enrolled courses
- `PUT /api/user/progress` - Update course progress

### Educator (Protected)
- `POST /api/educator/courses` - Create course
- `GET /api/educator/courses` - List educator courses
- `PUT /api/educator/courses/:id` - Update course
- `GET /api/educator/student-enrolled` - View enrolled students

### Webhooks
- `POST /stripe` - Stripe payment webhook

## Database Schema

**User**
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'student' | 'educator' | 'admin',
  profileImage: String
}
```

**Course**
```javascript
{
  title: String,
  description: String,
  thumbnail: String,
  price: Number,
  category: String,
  published: Boolean,
  rating: Number,
  educator: ObjectId (ref: User),
  sections: [{
    title: String,
    lectures: [{
      title: String,
      videoUrl: String,
      duration: Number
    }]
  }]
}
```

**Enrollment**
```javascript
{
  student: ObjectId (ref: User),
  course: ObjectId (ref: Course),
  enrolledAt: Date,
  paymentId: String,
  status: 'active' | 'completed' | 'cancelled'
}
```

**Progress**
```javascript
{
  student: ObjectId (ref: User),
  course: ObjectId (ref: Course),
  completedLectures: [ObjectId],
  completionPercentage: Number,
  totalWatchTime: Number
}
```

## Deployment

### Production Checklist
- Set NODE_ENV=production
- Use strong JWT secret
- Configure production database
- Enable HTTPS/SSL
- Set up proper CORS
- Configure monitoring

### Docker Deployment

```bash
docker-compose up -d
```

### Platform-Specific

**Frontend (Vercel/Netlify):**
```bash
cd client
npm run build
# Deploy dist folder
```

**Backend (Render/Railway/Heroku):**
- Connect GitHub repository
- Set environment variables
- Deploy from main branch

## Project Structure

```
lms-platform/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Route pages
│   │   └── App.jsx        # Main app component
│   └── package.json
│
├── server/                # Node.js backend
│   ├── configs/          # Database & service configs
│   ├── models/           # Mongoose schemas
│   ├── controllers/      # Business logic
│   ├── routes/           # API routes
│   ├── middlewares/      # Auth & validation
│   ├── server.js         # Entry point
│   └── package.json
│
└── README.md
```

## Future Enhancements

- Multi-language chatbot support
- Advanced analytics dashboard
- Live classes with video conferencing
- Mobile applications (iOS/Android)
- Adaptive learning paths
- Certificate generation
- Discussion forums
- Gamification (badges, leaderboards)

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/name`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/name`)
5. Open Pull Request
---

Built with modern web technologies for seamless online learning.
