// Import Express framework for building the web server
const express = require("express");

// Import CORS middleware to enable Cross-Origin Resource Sharing
// Allows frontend (React app) on different port/domain to communicate with backend
const cors = require("cors");

// Import route modules
const pollRoutes = require("./routes/pollRoutes"); // Poll-related endpoints
const authRoutes = require("./routes/authRoutes"); // Authentication endpoints

// Import Sequelize database connection instance
const sequelize = require("./config/db");

// Load environment variables from .env file
// This makes configuration values (DB credentials, JWT secret, etc.) available
require("dotenv").config();

// ----------------------- Express Application Setup -----------------------

// Create Express application instance
const app = express();

// Enable CORS for all routes
// This allows the React frontend to make API requests to this backend
// Without CORS, browsers block cross-origin requests for security
app.use(cors());

// Enable JSON body parsing middleware
// This parses incoming request bodies with JSON payloads
// Makes req.body available in route handlers (e.g., req.body.username)
app.use(express.json());

// ----------------------- Route Mounting -----------------------

// Mount poll routes at /api/polls
// All routes defined in pollRoutes will be prefixed with /api/polls
// Examples: POST /api/polls, GET /api/polls/:id, etc.
app.use("/api/polls", pollRoutes);

// Mount authentication routes at /api/auth
// All routes defined in authRoutes will be prefixed with /api/auth
// Examples: POST /api/auth/register, POST /api/auth/login
app.use("/api/auth", authRoutes);

// ----------------------- Database Synchronization -----------------------

// Sync database models with database schema
// This creates tables if they don't exist based on model definitions
// In production, use migrations instead of sync() for better control
// sync() automatically creates: Users, Polls, Options, Votes tables
sequelize.sync();

// Export the configured Express app
// This allows server.js or other files to import and start the server
module.exports = app;
