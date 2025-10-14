// Import the configured Express application from app.js
const app = require("./app");

// Import Node.js HTTP module to create HTTP server
const http = require("http");

// Create HTTP server instance with Express app
// This wraps the Express app to enable Socket.io integration
const server = http.createServer(app);

// Import Socket.io Server class for real-time WebSocket communication
const { Server } = require("socket.io");

// Create Socket.io server instance attached to HTTP server
// CORS configuration allows connections from any origin (*)
// In production, specify exact frontend URL for security: origin: "http://localhost:3000"
const io = new Server(server, { cors: { origin: "*" } });

// ----------------------- Server Configuration -----------------------

// Define server port from environment variable or default to 5000
// Environment variable allows flexible deployment (Heroku, AWS, etc.)
const PORT = process.env.PORT || 5000;

// ----------------------- Socket.io Event Handling -----------------------

// Listen for client connections via WebSocket
// This event fires whenever a user connects to the Socket.io server
io.on("connection", (socket) => {
  console.log("A user connected");
  // Socket connection enables real-time features like:
  // - Live poll result updates (when someone votes)
  // - Real-time vote count changes
  // - Instant UI updates without page refresh
});

// ----------------------- Make Socket.io Available to Routes -----------------------

// Attach Socket.io instance to Express app
// This makes 'io' accessible in route handlers via req.app.get('io')
// Controllers can emit events to connected clients for real-time updates
// Example: req.app.get('io').emit('pollUpdated', { pollId: 1 })
app.set("io", io);

// ----------------------- Start Server -----------------------

// Start the HTTP server (with Express app and Socket.io) on specified port
// Must use server.listen() instead of app.listen() to enable Socket.io
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Server is now:
  // - Accepting HTTP requests (REST API endpoints)
  // - Accepting WebSocket connections (real-time updates)
  // - Ready to serve the polling application
});
