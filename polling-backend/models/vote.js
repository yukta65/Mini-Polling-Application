// Import DataTypes from Sequelize to define column data types
const { DataTypes } = require("sequelize");

// Import the configured Sequelize instance (database connection)
const sequelize = require("../config/db");

// ----------------------- Vote Model Definition -----------------------

// Define the Vote model representing individual votes cast on poll options
// Sequelize will automatically create a table named 'Votes' (pluralized)
// It will also automatically add: id (primary key), createdAt, updatedAt,
// optionId (foreign key), and pollId (foreign key)
const Vote = sequelize.define("Vote", {
  // voter field: identifies who cast the vote
  // Can store either an IP address (for anonymous voting) or a userId (for authenticated voting)
  // This allows tracking to prevent duplicate votes from the same user/IP
  voter: {
    type: DataTypes.STRING, // VARCHAR data type in SQL
    allowNull: false, // This field is required (NOT NULL constraint)
  },
  // Note: optionId and pollId foreign keys are automatically created through associations
  // defined in models/index.js (Option.hasMany(Vote) and Poll.hasMany(Vote))
  // These foreign keys link each vote to a specific option and poll
});

// Export the Vote model so it can be used throughout the application
// for recording votes, preventing duplicates, and tallying results
module.exports = Vote;
