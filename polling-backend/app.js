// ----------------------- Load Environment Variables -----------------------
const dotenv = require("dotenv");

// Use .env.production on Render, .env.local locally
const envFile =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env.local";
dotenv.config({ path: envFile });

console.log(`Using environment: ${envFile}`);

// ----------------------- Import Dependencies -----------------------
const express = require("express");
const cors = require("cors");

// Import route modules
const pollRoutes = require("./routes/pollRoutes");
const authRoutes = require("./routes/authRoutes");

// Import Sequelize database connection instance
const sequelize = require("./config/db");

// ----------------------- Express Application Setup -----------------------
const app = express();

// Enable CORS for all routes (adjust in production for security)
app.use(cors());

// Enable JSON body parsing
app.use(express.json());

// ----------------------- Route Mounting -----------------------
app.use("/api/polls", pollRoutes);
app.use("/api/auth", authRoutes);

// ----------------------- Database Synchronization -----------------------

// Sync database models with database schema
// For production, consider using migrations instead of sync()
(async () => {
  try {
    await sequelize.sync();
    console.log("Database synchronized successfully!");
  } catch (err) {
    console.error("Error synchronizing database:", err);
  }
})();

// ----------------------- Export App -----------------------
module.exports = app;
