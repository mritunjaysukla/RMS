const jwt = require("jsonwebtoken");
const SECRET_KEY = "secretKey"; // Replace with environment variable in production

// Function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
};

module.exports = { generateToken };
