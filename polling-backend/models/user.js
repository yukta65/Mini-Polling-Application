// Import DataTypes from Sequelize to define column data types
const { DataTypes } = require("sequelize");

// Import the configured Sequelize instance (database connection)
const sequelize = require("../config/db");

// ----------------------- User Model Definition -----------------------

// Define the User model representing registered users in the database
// Sequelize will automatically create a table named 'Users' (pluralized)
// It will also automatically add: id (primary key), createdAt, updatedAt
const User = sequelize.define("User", {
  // username field: unique identifier for each user
  // Used for login and authentication
  username: {
    type: DataTypes.STRING, // VARCHAR data type in SQL
    unique: true, // UNIQUE constraint - no duplicate usernames allowed
    allowNull: false, // This field is required (NOT NULL constraint)
  },

  // password field: stores the hashed password
  // Note: Password is hashed using bcrypt before storage (done in authController.js)
  // Never stores plain text passwords for security
  password: {
    type: DataTypes.STRING, // VARCHAR data type in SQL
    allowNull: false, // This field is required (NOT NULL constraint)
  },

  // role field: defines user permissions and access level
  // Can be either 'admin' or 'user'
  // Admin users can create polls, regular users can only vote
  role: {
    type: DataTypes.STRING, // VARCHAR data type in SQL
    allowNull: false, // This field is required (NOT NULL constraint)
  },
});

// Export the User model so it can be used throughout the application
// for user registration, authentication, and authorization
module.exports = User;
