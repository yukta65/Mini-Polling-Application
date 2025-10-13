const express = require("express");
const cors = require("cors");
const pollRoutes = require("./routes/pollRoutes");
const authRoutes = require("./routes/authRoutes");
const sequelize = require("./config/db");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/polls", pollRoutes);
app.use("/api/auth", authRoutes);

sequelize.sync();

module.exports = app;
