// Import DataTypes from Sequelize to define column data types
const { DataTypes } = require("sequelize");

// Import the configured Sequelize instance (database connection)
const sequelize = require("../config/db");

// ----------------------- Poll Model Definition -----------------------

// Define the Poll model representing surveys/polls in the database
// Sequelize will automatically create a table named 'Polls' (pluralized)
// It will also automatically add: id (primary key), createdAt, updatedAt
const Poll = sequelize.define("Poll", {
  // question field: stores the main poll question
  // Example: "What is your favorite programming language?"
  question: {
    type: DataTypes.STRING, // VARCHAR data type in SQL
    allowNull: false, // This field is required (NOT NULL constraint)
  },

  // expiresAt field: optional expiration date/time for the poll
  // Can be used to automatically close polls after a certain date
  expiresAt: {
    type: DataTypes.DATE, // DATETIME data type in SQL
    allowNull: true, // This field is optional (can be NULL)
  },
  // Note: Related options are accessed through the Poll.hasMany(Option) association
  // defined in models/index.js (e.g., poll.options)
});

// Export the Poll model so it can be used throughout the application
// for creating, querying, updating, and deleting polls
module.exports = Poll;
