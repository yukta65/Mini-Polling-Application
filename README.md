# 🗳️ VoteHub - Real-Time Polling Application

A modern, full-stack polling application with real-time updates, user authentication, and role-based access control. Built with React, Node.js, Express, MySQL, and Socket.io.

![VoteHub](https://img.shields.io/badge/VoteHub-Polling%20App-6366f1?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

## ✨ Features

### 🎯 Core Functionality

- **Real-time Poll Updates** - Live vote counts using Socket.io
- **User Authentication** - Secure JWT-based login/registration
- **Role-Based Access** - Admin and User roles with different permissions
- **Beautiful UI** - Modern glassmorphism design with smooth animations
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Vote Tracking** - Prevents duplicate voting using IP/User tracking

### 👤 User Features

- View all active polls
- Vote on polls (authenticated users only)
- View real-time results with charts and progress bars
- See winner highlighting and vote percentages

### 👨‍💼 Admin Features

- Create new polls with multiple options
- All user features included

## 🛠️ Tech Stack

### Frontend

- **React** 18.x - UI library
- **React Router** - Client-side routing
- **Material-UI (MUI)** - Component library
- **Chart.js** - Data visualization
- **Axios** - HTTP client
- **Socket.io Client** - Real-time updates

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Sequelize** - ORM for database
- **MySQL** - Relational database
- **Socket.io** - WebSocket server
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v5.7 or higher) - [Download](https://dev.mysql.com/downloads/)
- **npm** or **yarn** - Comes with Node.js
- **Git** (optional) - [Download](https://git-scm.com/)

## 🚀 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone <your-repository-url>
cd polling-app
```

### 2️⃣ Database Setup

#### Create MySQL Database

Open MySQL command line or MySQL Workbench and run:

```sql
CREATE DATABASE polling_app;
```

Or use command line:

```bash
mysql -u root -p
# Enter password when prompted
CREATE DATABASE polling_app;
EXIT;
```

### 3️⃣ Backend Setup

#### Navigate to backend directory (if separate) or stay in root:

```bash
cd polling-backend
# or stay in root if backend is in root
```

#### Install dependencies:

```bash
npm install
```

#### Create `.env` file in backend root:

```env
# Database Configuration
DB_NAME=polling_app
DB_USER=root
DB_PASS=your_mysql_password
DB_HOST=localhost
DB_DIALECT=mysql

# JWT Secret (use a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Server Port
PORT=5000
```

**Important:** Replace `your_mysql_password` with your actual MySQL password and generate a strong JWT secret.

#### Generate a strong JWT secret (optional):

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4️⃣ Frontend Setup

#### Navigate to frontend directory:

```bash
cd polling-frontend
```

#### Install dependencies:

```bash
npm install
```

#### Create `.env` file in frontend root (if needed):

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

**Note:** Most configurations are already in the code, but you can customize URLs here if needed.

## ▶️ Running the Application

### Option 1: Run Both Servers Separately (Recommended for Development)

#### Terminal 1 - Start Backend Server:

```bash
cd polling-backend
npm start
# or
npm run dev  # if using nodemon
```

You should see:

```
Server running on port 5000
```

#### Terminal 2 - Start Frontend Server:

```bash
cd polling-frontend
npm start
```

The React app will open automatically at `http://localhost:3000`

### Option 2: Run with Nodemon (Auto-restart on changes)

#### Backend with auto-reload:

```bash
cd polling-backend
npm install -g nodemon  # Install globally if not installed
nodemon server.js
```

## 🎮 Using the Application

### First Time Setup

1. **Open Browser** - Navigate to `http://localhost:3000`

2. **Register an Admin User**

   - Click "Register now!" or go to `/register`
   - Enter username and password
   - Select "Admin" role
   - Click "Create Account"

3. **Login**
   - Enter your credentials
   - Click "Login to Vote"
   - You'll be redirected to the polls page

### Creating a Poll (Admin Only)

1. Click "Create Poll" in the navigation (only visible to admins)
2. Enter your poll question
3. Add at least 2 options (click "Add Another Option" for more)
4. Click "Create Poll"
5. Your poll will appear on the main page

### Voting on a Poll (All Users)

1. From the polls list, click "Vote Now" on any poll
2. Select your preferred option
3. Click "Submit Vote"
4. View results automatically or click "Results" button

### Viewing Results

1. Click "Results" button on any poll card
2. See live vote counts, percentages, and charts
3. Winner is highlighted with a trophy icon
4. Results update in real-time as others vote

## 📁 Project Structure

```
polling-app/
├── polling-backend/           # Backend server
│   ├── config/
│   │   └── db.js             # Database configuration
│   ├── controllers/
│   │   ├── authController.js # Authentication logic
│   │   └── pollController.js # Poll logic
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   ├── models/
│   │   ├── index.js          # Model associations
│   │   ├── user.js           # User model
│   │   ├── poll.js           # Poll model
│   │   ├── option.js         # Option model
│   │   └── vote.js           # Vote model
│   ├── routes/
│   │   ├── authRoutes.js     # Auth endpoints
│   │   └── pollRoutes.js     # Poll endpoints
│   ├── .env                  # Environment variables
│   ├── app.js                # Express app setup
│   ├── server.js             # Server entry point
│   └── package.json
│
└── polling-frontend/          # React frontend
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── login.js      # Login page
    │   │   ├── register.js   # Registration page
    │   │   ├── pollList.js   # Polls listing
    │   │   ├── pollDetail.js # Vote page
    │   │   ├── results.js    # Results page
    │   │   └── createPoll.js # Create poll (admin)
    │   ├── api.js            # Axios configuration
    │   ├── App.js            # Main app component
    │   └── index.js          # React entry point
    ├── .env
    └── package.json
```

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint    | Description       | Auth Required |
| ------ | ----------- | ----------------- | ------------- |
| POST   | `/register` | Register new user | ❌            |
| POST   | `/login`    | Login user        | ❌            |

### Poll Routes (`/api/polls`)

| Method | Endpoint       | Description      | Auth Required | Role  |
| ------ | -------------- | ---------------- | ------------- | ----- |
| GET    | `/`            | Get all polls    | ❌            | -     |
| GET    | `/:id`         | Get single poll  | ❌            | -     |
| POST   | `/`            | Create new poll  | ✅            | Admin |
| POST   | `/:id/vote`    | Vote on poll     | ✅            | Any   |
| GET    | `/:id/results` | Get poll results | ❌            | -     |

## 🧪 Testing the Application

### Test User Accounts

Create these test accounts for different scenarios:

```
Admin Account:
Username: admin
Password: admin123
Role: Admin

User Account:
Username: user
Password: user123
Role: User
```

### Test Scenarios

1. **Admin Flow**

   - Login as admin
   - Create a new poll
   - Vote on the poll
   - View results

2. **User Flow**

   - Login as user
   - Try to access create poll (should redirect)
   - Vote on existing polls
   - View results

3. **Real-time Updates**
   - Open two browser windows
   - Vote in one window
   - Watch results update in the other window instantly

## 🐛 Troubleshooting

### Backend Won't Start

**Error:** `Access denied for user 'root'@'localhost'`

- **Solution:** Check MySQL password in `.env` file

**Error:** `Port 5000 already in use`

- **Solution:** Change PORT in `.env` or kill the process:

  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F

  # Mac/Linux
  lsof -i :5000
  kill -9 <PID>
  ```

**Error:** `Unknown database 'polling_app'`

- **Solution:** Create database in MySQL:
  ```sql
  CREATE DATABASE polling_app;
  ```

### Frontend Won't Start

**Error:** `Cannot connect to backend`

- **Solution:** Ensure backend is running on port 5000
- Check if `http://localhost:5000/api` is accessible

**Error:** `Module not found`

- **Solution:** Delete `node_modules` and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

### Socket.io Not Working

**Issue:** Results don't update in real-time

- **Solution:** Check backend console for "A user connected" message
- Verify CORS settings in `server.js`
- Check browser console for Socket.io errors

### Database Issues

**Error:** Table doesn't exist

- **Solution:** Restart backend server (Sequelize will auto-create tables)
- Or manually sync:
  ```javascript
  sequelize.sync({ force: true }); // Warning: Drops all tables!
  ```

## 🔒 Security Notes

### Production Deployment Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Use environment-specific `.env` files
- [ ] Enable HTTPS
- [ ] Restrict CORS to specific origins
- [ ] Use secure cookies for tokens
- [ ] Add rate limiting
- [ ] Implement input validation
- [ ] Use prepared statements (already done with Sequelize)
- [ ] Add logging and monitoring
- [ ] Use database migrations instead of `sync()`

### Environment Variables Security

**Never commit `.env` files to Git!**

Add to `.gitignore`:

```
.env
.env.local
.env.production
```

## 📦 Dependencies

### Backend Dependencies

```json
{
  "express": "^4.18.0",
  "sequelize": "^6.32.0",
  "mysql2": "^3.5.0",
  "socket.io": "^4.6.0",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.0",
  "cors": "^2.8.5",
  "dotenv": "^16.0.0"
}
```

### Frontend Dependencies

```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.14.0",
  "@mui/material": "^5.14.0",
  "@mui/icons-material": "^5.14.0",
  "@emotion/react": "^11.11.0",
  "@emotion/styled": "^11.11.0",
  "axios": "^1.4.0",
  "chart.js": "^4.3.0",
  "react-chartjs-2": "^5.2.0",
  "socket.io-client": "^4.6.0"
}
```

## 🚢 Deployment

### Backend Deployment (Heroku Example)

```bash
# Install Heroku CLI
heroku login
heroku create your-polling-backend

# Set environment variables
heroku config:set DB_NAME=your_db
heroku config:set DB_USER=your_user
heroku config:set DB_PASS=your_password
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main
```

### Frontend Deployment (Netlify/Vercel)

1. Build the React app:

   ```bash
   npm run build
   ```

2. Deploy the `build` folder to Netlify or Vercel

3. Update API URLs to point to your deployed backend

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Material-UI for the beautiful component library
- Socket.io for real-time functionality
- Chart.js for data visualization
- The open-source community

## 📞 Support

For support, email your.email@example.com or open an issue in the repository.

---

Made with ❤️ and ☕ by [Your Name]

**Happy Polling! 🗳️✨**
