// Import Sequelize ORM library for database operations
const { Sequelize } = require("sequelize");

// Load environment variables from .env file into process.env
// This keeps sensitive database credentials out of the codebase
require("dotenv").config();

// Create a new Sequelize instance to connect to the database
// This establishes the connection with configuration from environment variables
const sequelize = new Sequelize(
  process.env.DB_NAME, // Database name (e.g., "polling_app")
  process.env.DB_USER, // Database username (e.g., "root")
  process.env.DB_PASS, // Database password
  {
    host: process.env.DB_HOST, // Database host address (e.g., "localhost")
    dialect: process.env.DB_DIALECT, // Database type (e.g., "mysql", "postgres", "sqlite")
    logging: false, // Disable SQL query logging to console (set to true for debugging)
  }
);

// Export the configured Sequelize instance
// This allows other modules to import and use this database connection
// for defining models, running queries, and managing transactions
module.exports = sequelize;
