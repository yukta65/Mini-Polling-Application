// Import Express framework to create router
const express = require("express");

// Create a new router instance to define poll-related routes
const router = express.Router();

// Import poll controller containing all poll business logic
const pollController = require("../controllers/pollController");

// Import authentication middleware for protecting routes
const auth = require("../middleware/auth");

// ----------------------- Poll Routes -----------------------

// POST /api/polls - Create a new poll (Admin only)
// Protected route: Requires authentication AND admin role
// auth(["admin"]) ensures only users with 'admin' role can create polls
// Accepts: { question, options: [{text}], expiresAt } in request body
// Returns: Created poll object with options
router.post("/", auth(["admin"]), pollController.createPoll);

// GET /api/polls - List all available polls (Public)
// No authentication required - anyone can view the list of polls
// Returns: Array of all polls with their questions and metadata
router.get("/", pollController.listPolls);

// GET /api/polls/:id - Get a specific poll with its options (Public)
// No authentication required - anyone can view poll details
// URL parameter :id is the poll ID
// Returns: Poll object with question and all available options
router.get("/:id", pollController.getPoll);

// POST /api/polls/:id/vote - Cast a vote on a poll option (Authenticated users only)
// Protected route: Requires authentication but any logged-in user can vote
// auth() with no parameters allows all authenticated users (both admin and regular users)
// Accepts: { optionId } in request body
// Returns: Vote confirmation or error if already voted
router.post("/:id/vote", auth(), pollController.vote);

// GET /api/polls/:id/results - Get poll results with vote counts (Public)
// No authentication required - anyone can view results
// Returns: Poll with options and their vote counts/percentages
module.exports = router;
