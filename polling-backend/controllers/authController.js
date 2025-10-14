// Import User model from database models
const { User } = require("../models");
// Import bcryptjs library for password hashing and comparison
const bcrypt = require("bcryptjs");
// Import jsonwebtoken library for creating authentication tokens
const jwt = require("jsonwebtoken");

// ----------------------- User Registration Handler -----------------------

// Handles POST /api/auth/register
exports.register = async (req, res) => {
  // Extract username, password, and role from request body
  const { username, password, role } = req.body;

  // Hash the password using bcrypt with salt rounds of 10
  // This makes the password secure by creating a one-way encryption
  // The number 10 is the cost factor (higher = more secure but slower)
  const hash = await bcrypt.hash(password, 10);

  try {
    // Create a new user in the database with hashed password
    // Store username, hashed password, and role (user/admin)
    const user = await User.create({ username, password: hash, role });

    // Send success response
    res.json({ message: "Registered!" });
  } catch (err) {
    // If user creation fails (likely due to duplicate username)
    // Sequelize will throw an error because username is unique
    res.status(400).json({ error: "Username already exists" });
  }
};

// ----------------------- User Login Handler -----------------------

// Handles POST /api/auth/login
exports.login = async (req, res) => {
  // Extract username and password from request body
  const { username, password } = req.body;

  // Find user in database by username
  const user = await User.findOne({ where: { username } });

  // If no user found, return error
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  // Compare provided password with hashed password in database
  // bcrypt.compare() hashes the input and checks if it matches the stored hash
  const match = await bcrypt.compare(password, user.password);

  // If passwords don't match, return error
  if (!match) return res.status(400).json({ error: "Invalid credentials" });

  // Create JWT token with user ID and role as payload
  const token = jwt.sign(
    { id: user.id, role: user.role }, // Payload: data to encode in token
    process.env.JWT_SECRET, // Secret key from environment variables
    { expiresIn: "1d" } // Token expires in 1 day
  );

  // Send token and role back to client
  // Client will store the token and send it with future requests for authentication
  res.json({ token, role: user.role });
};
