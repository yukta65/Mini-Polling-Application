// Import Express framework to create router
const express = require("express");

// Create a new router instance to define authentication routes
// Router allows modular route definitions that can be mounted in the main app
const router = express.Router();

// Import authentication controller containing register and login logic
const authController = require("../controllers/authController");

// ----------------------- Authentication Routes -----------------------

// POST /api/auth/register - User registration endpoint
// Accepts: { username, password, role } in request body
// Returns: { message: "Registered!" } on success
// Handles: Creating new user account with hashed password
router.post("/register", authController.register);

// POST /api/auth/login - User login endpoint
// Accepts: { username, password } in request body
// Returns: { token, role } on success - JWT token for authentication
// Handles: Validating credentials and generating authentication token
router.post("/login", authController.login);

// Export the router to be mounted in the main application (server.js)
// These routes will be accessible at /api/auth/register and /api/auth/login
module.exports = router;
