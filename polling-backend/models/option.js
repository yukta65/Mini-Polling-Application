// Import DataTypes from Sequelize to define column data types
const { DataTypes } = require("sequelize");

// Import the configured Sequelize instance (database connection)
const sequelize = require("../config/db");

// ----------------------- Option Model Definition -----------------------

// Define the Option model representing poll answer choices in the database
// Sequelize will automatically create a table named 'Options' (pluralized)
// It will also automatically add: id (primary key), createdAt, updatedAt, pollId (foreign key)
const Option = sequelize.define("Option", {
  // text field: stores the option text/label (e.g., "Yes", "No", "Maybe")
  text: {
    type: DataTypes.STRING, // VARCHAR data type in SQL
    allowNull: false, // This field is required (NOT NULL constraint)
  },
  // Note: pollId foreign key is automatically created by the Poll.hasMany(Option) association
  // defined in models/index.js
});

// Export the Option model so it can be used in other parts of the application
// for creating, querying, updating, and deleting poll options
module.exports = Option;
