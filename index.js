const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const validateRole = require("./middlewares/roleMiddleware"); // Importing role validation middleware
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");
const auth = require("./middlewares/authMiddleware");
const app = express();

// dotenv configuration
dotenv.config();

// Middlewares
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cors());
app.use("/auth", authRoutes);
// app.use("/api", authRoutes);
app.use("/api", menuRoutes);
app.use("/orders", orderRoutes);

// Protected routes with admin role validation

app.get(
  "/reports",
  auth,
  validateRole(["ADMIN", "MANAGER"]),
  async (_req, res) => {
    // Logic to fetch and send reports
    res.send("Reports fetched successfully");
  }
);

app.get("/", (_req, res) => {
  return res.status(200).send("Welcome to Restaurant Management System");
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
