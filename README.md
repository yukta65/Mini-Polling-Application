# 🗳️ VoteHub - Real-Time Polling Application

A modern, full-stack polling application with real-time updates, user authentication, and role-based access control. Built with React, Node.js, Express, MySQL, and Socket.io.

![VoteHub](https://img.shields.io/badge/VoteHub-Polling%20App-6366f1?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Design Decisions](#design-decisions)
- [Using the Application](#using-the-application)
- [Troubleshooting](#troubleshooting)
- [Security](#security)
- [Contributing](#contributing)

## 📸 Project Screenshots

Here’s how the app looks:

<p align="center">
  <img src="./images/homepage.png" alt="Homepage Screenshot" width="500"/>
</p>

<p align="center">
  <img src="./images/login.png" alt="Login Page" width="400"/>
</p>

## ✨ Features

### Core Functionality

- Real-time poll updates using Socket.io
- Secure JWT-based user authentication
- Role-based access control (Admin & User roles)
- Modern glassmorphism design with smooth animations
- Fully responsive layout (desktop, tablet, mobile)
- Vote tracking to prevent duplicate voting
- Real-time vote count updates across all connected clients

### User Features

- View all active polls
- Vote on polls (authenticated users only)
- View real-time results with animated charts and progress bars
- See winner highlighting with vote percentages
- Light/Dark theme toggle

### Admin Features

- Create new polls with multiple options
- All user features included
- View aggregate poll statistics

## 🛠️ Tech Stack

### Frontend

- **React** 18.x - UI library with hooks
- **React Router** v6 - Client-side routing
- **Material-UI (MUI)** v5 - Component library with theme support
- **Chart.js & react-chartjs-2** - Data visualization
- **Axios** - HTTP client with interceptors
- **Socket.io Client** v4 - Real-time WebSocket communication
- **Styled Components** - CSS-in-JS styling with MUI

### Backend

- **Node.js** v14+ - JavaScript runtime
- **Express.js** v4 - Web framework with middleware
- **Sequelize** v6 - ORM for database operations
- **MySQL** v5.7+ - Relational database
- **Socket.io** v4 - Real-time bidirectional communication
- **JWT** - Stateless authentication tokens
- **bcryptjs** - Password hashing and verification
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 💾 Database Schema

### Users Table

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Polls Table

```sql
CREATE TABLE polls (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question VARCHAR(500) NOT NULL,
  createdBy INT NOT NULL,
  status ENUM('active', 'closed') DEFAULT 'active',
  totalVotes INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (createdBy) REFERENCES users(id)
);
```

### Options Table

```sql
CREATE TABLE options (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pollId INT NOT NULL,
  optionText VARCHAR(500) NOT NULL,
  voteCount INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pollId) REFERENCES polls(id) ON DELETE CASCADE
);
```

### Votes Table

```sql
CREATE TABLE votes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pollId INT NOT NULL,
  optionId INT NOT NULL,
  userId INT NOT NULL,
  ipAddress VARCHAR(45),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_poll (userId, pollId),
  FOREIGN KEY (pollId) REFERENCES polls(id) ON DELETE CASCADE,
  FOREIGN KEY (optionId) REFERENCES options(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

### Relationships

```
Users (1) ──→ (Many) Polls
Users (1) ──→ (Many) Votes
Polls (1) ──→ (Many) Options
Polls (1) ──→ (Many) Votes
Options (1) ──→ (Many) Votes
```

## 📋 Prerequisites

- **Node.js** v14 or higher - [Download](https://nodejs.org/)
- **MySQL** v5.7 or higher - [Download](https://dev.mysql.com/downloads/)
- **npm** or **yarn** - Comes with Node.js
- **Git** (optional) - [Download](https://git-scm.com/)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yukta65/Mini-Polling-Application.git
cd Mini-Polling-Application
```

### 2. Database Setup

Open MySQL and create the database:

```bash
mysql -u root -p
```

```sql
CREATE DATABASE polling_app;
EXIT;
```

### 3. Backend Setup

```bash
cd polling-backend
npm install
```

Create `.env` file in `polling-backend/`:

```env
# Database Configuration
DB_NAME=polling_app
DB_USER=User_id
DB_PASS=your_mysql_password
DB_HOST=localhost
DB_PORT=3306
DB_DIALECT=mysql

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random_at_least_32_characters

# Server Configuration
PORT=5000
NODE_ENV=development

# Socket.io Configuration
SOCKET_PORT=5000
```

Generate a strong JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Frontend Setup

```bash
cd ../polling-frontend
npm install
```

Create `.env` file in `polling-frontend/`:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 🌍 Environment Variables Documentation

### Backend (.env)

| Variable     | Required | Description                    | Example                       |
| ------------ | -------- | ------------------------------ | ----------------------------- |
| `DB_NAME`    | Yes      | Database name                  | `polling_app`                 |
| `DB_USER`    | Yes      | MySQL username                 | `username`                    |
| `DB_PASS`    | Yes      | MySQL password                 | `password`                    |
| `DB_HOST`    | Yes      | Database host                  | `localhost`                   |
| `DB_PORT`    | No       | MySQL port                     | `3306`                        |
| `DB_DIALECT` | Yes      | Database type                  | `mysql`                       |
| `JWT_SECRET` | Yes      | JWT signing key (min 32 chars) | `your_random_secret_key`      |
| `PORT`       | No       | Server port                    | `5000`                        |
| `NODE_ENV`   | No       | Environment mode               | `development` or `production` |

### Frontend (.env)

| Variable               | Required | Description          | Example                     |
| ---------------------- | -------- | -------------------- | --------------------------- |
| `REACT_APP_API_URL`    | Yes      | Backend API base URL | `http://localhost:5000/api` |
| `REACT_APP_SOCKET_URL` | Yes      | Socket.io server URL | `http://localhost:5000`     |

## ▶️ Running the Application

### Terminal 1 - Backend Server

```bash
cd polling-backend
npm start
```

Or with auto-reload using nodemon:

```bash
npm install -g nodemon
npm run dev
```

Expected output:

```
Server running on port 5000
Database connected successfully
```

### Terminal 2 - Frontend Server

```bash
cd polling-frontend
npm start
```

The React app opens automatically at `http://localhost:3000`

## 📡 API Endpoints

### Authentication Endpoints

#### Register User

```
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "password": "secure_password",
  "role": "user"
}

Response: { token, user: { id, username, role } }
```

#### Login User

```
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "secure_password"
}

Response: { token, user: { id, username, role } }
```

### Poll Endpoints

#### Get All Polls

```
GET /api/polls
Authorization: Bearer <token>

Response: [{ id, question, status, totalVotes, createdAt, options: [...] }, ...]
```

#### Get Single Poll

```
GET /api/polls/:id
Authorization: Bearer <token>

Response: { id, question, options: [...], createdBy, status }
```

#### Create Poll (Admin Only)

```
POST /api/polls
Authorization: Bearer <token>
Content-Type: application/json

{
  "question": "What's your favorite programming language?",
  "options": ["JavaScript", "Python", "Java", "Go"]
}

Response: { id, question, options: [...], status: 'active' }
```

#### Vote on Poll

```
POST /api/polls/:pollId/vote
Authorization: Bearer <token>
Content-Type: application/json

{
  "optionId": 1
}

Response: { success: true, poll: {...} }
```

#### Get Poll Results

```
GET /api/polls/:id/results
Authorization: Bearer <token>

Response: {
  question,
  totalVotes,
  options: [
    { id, optionText, voteCount, percentage },
    ...
  ]
}
```

## 🎯 Design Decisions

### Architecture

**MVC Pattern** - Separation of concerns with Models, Controllers, and Routes for maintainability and scalability.

**JWT Authentication** - Stateless authentication allows horizontal scaling without session management overhead.

**Socket.io for Real-time Updates** - Provides instant poll updates across all connected clients without polling overhead.

### Frontend

**Theme Context API** - Centralized theme management for light/dark mode switching without prop drilling.

**Styled Components** - Dynamic styling based on theme with better performance than inline styles.

**React Router v6** - Modern routing with nested routes and automatic redirection for unauthenticated users.

### Backend

**Sequelize ORM** - Type-safe database queries with model validation and automatic migrations.

**Middleware Stack** - CORS, JSON parsing, and authentication middleware for security and flexibility.

**Vote Unique Constraint** - Database-level enforcement prevents duplicate votes more reliably than application logic.

### Database

**Soft Deletes Not Used** - Hard deletes keep data lean; audit logs could be added if needed.

**Vote Tracking** - Stores userId and ipAddress for comprehensive duplicate detection.

**Cascade Delete** - Deleting a poll automatically removes associated options and votes.

## 🎮 Using the Application

### First Time Setup

1. Open browser to `http://localhost:3000`
2. Click "Register now!" to create an account
3. Choose "Admin" role for full access or "User" for voting only
4. Click "Create Account"
5. Login with your credentials

### Creating a Poll (Admin Only)

1. Click "Create Poll" in navbar
2. Enter poll question
3. Add at least 2 options (click "Add Another Option" for more)
4. Click "Create Poll"
5. Poll appears on main page in real-time

### Voting

1. Click "Vote Now" on a poll
2. Select your preferred option
3. Click "Submit Vote"
4. View results automatically

### Real-time Updates

- Vote in one browser window
- Watch results update in another window instantly
- Open DevTools Network tab to see Socket.io packets

## 🐛 Troubleshooting

### Backend Issues

**"Access denied for user 'root'@'localhost'"**

- Check MySQL password in `.env` matches your MySQL installation

**"Port 5000 already in use"**

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

**"Unknown database 'polling_app'"**

```sql
CREATE DATABASE polling_app;
```

**"Cannot GET /api/polls"**

- Verify backend is running on port 5000
- Check that routes are properly imported in `server.js`

### Frontend Issues

**"Cannot connect to backend"**

- Ensure backend runs on `http://localhost:5000`
- Check REACT_APP_API_URL in `.env`
- Check browser DevTools Network tab for failed requests

**"Module not found"**

```bash
rm -rf node_modules package-lock.json
npm install
```

**"Socket.io not connecting"**

- Verify backend is running
- Check REACT_APP_SOCKET_URL in `.env`
- Look for Socket.io connection error in browser console
- Ensure CORS is enabled in backend `server.js`

## 🔒 Security

### Current Implementation

- Passwords hashed with bcryptjs (10 salt rounds)
- JWT tokens with secure secrets (minimum 32 characters)
- CORS restricted to localhost in development
- SQL injection prevention via Sequelize ORM
- Duplicate vote prevention with unique constraints

### Production Checklist

- Change JWT_SECRET to a strong random string
- Set NODE_ENV=production
- Enable HTTPS
- Restrict CORS to specific frontend domain
- Use secure cookies (httpOnly, sameSite, secure flags)
- Implement rate limiting
- Add input validation and sanitization
- Use database connection pooling
- Enable HTTPS for Socket.io
- Set up logging and monitoring
- Use environment-specific `.env` files
- Add request body size limits
- Enable helmet.js for security headers

### Never Commit

Add to `.gitignore`:

```
.env
.env.local
.env.*.local
node_modules/
npm-debug.log
```

## 📁 Project Structure

```
Mini-Polling-Application/
├── polling-backend/
│   ├── config/
│   │   └── db.js              # Sequelize configuration
│   ├── controllers/
│   │   ├── authController.js  # Login/Register logic
│   │   └── pollController.js  # Poll CRUD operations
│   ├── middleware/
│   │   └── auth.js            # JWT verification
│   ├── models/
│   │   ├── index.js           # Model associations
│   │   ├── User.js
│   │   ├── Poll.js
│   │   ├── Option.js
│   │   └── Vote.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── pollRoutes.js
│   ├── .env
│   ├── app.js                 # Express setup
│   ├── server.js              # Entry point with Socket.io
│   └── package.json
│
└── polling-frontend/
    ├── src/
    │   ├── components/
    │   │   ├── login.js
    │   │   ├── register.js
    │   │   ├── pollList.js
    │   │   ├── pollDetail.js
    │   │   ├── results.js
    │   │   └── createPoll.js
    │   ├── theme/
    │   │   ├── context.js      # Theme provider
    │   │   └── toggle.js       # Theme switcher
    │   ├── api.js              # Axios setup
    │   ├── App.js
    │   └── index.js
    ├── .env
    ├── package.json
    └── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/YourFeature`
3. Commit changes: `git commit -m 'Add YourFeature'`
4. Push branch: `git push origin feature/YourFeature`
5. Open a Pull Request

## 👨‍💻 Author

- GitHub: [@yukta65](https://github.com/yukta65)
- Email: yuktamahedu652004@gmail.com

## 🙏 Acknowledgments

- Material-UI for component library
- Socket.io for real-time functionality
- Chart.js for visualizations
- Sequelize for ORM
- Open-source community

## 📞 Support

For support, email yuktamahedu652004@gmail.com or open an issue on GitHub.

---

Made with ❤️ and ☕ by Yukta

**Happy Polling! 🗳️✨**
