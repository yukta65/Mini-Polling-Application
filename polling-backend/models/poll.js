const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Poll = sequelize.define("Poll", {
  question: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

module.exports = Poll;
