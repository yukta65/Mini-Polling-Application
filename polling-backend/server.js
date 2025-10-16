// ----------------------- Load Environment Variables -----------------------
const dotenv = require("dotenv");

// Use .env.production on Render, .env.local locally
const envFile =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env.local";
dotenv.config({ path: envFile });

console.log(`Using environment: ${envFile}`);

// ----------------------- Import Dependencies -----------------------
const http = require("http");
const app = require("./app"); // Your Express app
const { Server } = require("socket.io");
const { Sequelize } = require("sequelize");

// ----------------------- Configure Sequelize -----------------------
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false, // Set to true if you want SQL query logs
  }
);

// Test database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully!");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
})();

// ----------------------- Create HTTP Server -----------------------
const server = http.createServer(app);

// ----------------------- Configure Socket.io -----------------------
const io = new Server(server, {
  cors: { origin: "*" }, // In production, specify your frontend URL
});

io.on("connection", (socket) => {
  console.log("A user connected via WebSocket");
  // Example: handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Make Socket.io instance available in Express routes
app.set("io", io);

// ----------------------- Start Server -----------------------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
