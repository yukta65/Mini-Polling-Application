// Import jsonwebtoken library for verifying JWT tokens
const jwt = require("jsonwebtoken");

// ----------------------- Authentication Middleware -----------------------

// Middleware factory function that creates an authentication middleware
// with optional role-based access control
// @param roles - Array of allowed roles (e.g., ['admin']) or empty array for any authenticated user
module.exports = (roles = []) => {
  // Return the actual middleware function
  return (req, res, next) => {
    // Get the Authorization header from the request
    // Expected format: "Bearer <token>"
    const auth = req.headers.authorization;

    // If no Authorization header is present, return 401 Unauthorized
    if (!auth) return res.status(401).json({ error: "No token" });

    try {
      // Extract and verify the JWT token
      // auth.split(" ")[1] gets the token part from "Bearer <token>"
      // jwt.verify() decodes the token and validates it using the secret key
      const decoded = jwt.verify(auth.split(" ")[1], process.env.JWT_SECRET);

      // Role-based access control check
      // If specific roles are required and user's role is not in the allowed list
      if (roles.length && !roles.includes(decoded.role)) {
        // Return 403 Forbidden - user is authenticated but lacks permission
        return res.status(403).json({ error: "Forbidden" });
      }

      // Attach decoded user data (id, role) to request object
      // This makes user info available to subsequent route handlers
      req.user = decoded;

      // Pass control to the next middleware/route handler
      next();
    } catch {
      // If token verification fails (expired, invalid signature, malformed)
      // Return 401 Unauthorized
      res.status(401).json({ error: "Invalid token" });
    }
  };
};
