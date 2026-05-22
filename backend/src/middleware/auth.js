const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  // The format is : Authorization: Bearer <token>
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  // If no token is provided, return 401 Unauthorized
  if (!token) {
    return res.status(401).json({
      error: "Access denied. No token provided.",
      message: "Please provide a valid token to access this resource.",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        error: "Invalid token.",
        message:
          "The token provided is invalid or has expired. Please log in again to obtain a new token.",
      });
    }

    // If token is valid, attach the user information to the request object and proceed to the next middleware or route handler
    // So that the router can access the user information by req.user
    req.user = user;
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = authenticateToken;
