const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Vote = sequelize.define("Vote", {
  voter: { type: DataTypes.STRING, allowNull: false }, // IP or userId
});

module.exports = Vote;
