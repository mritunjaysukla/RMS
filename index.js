const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./authRoutes");
const checkRole = require("./middlewares/checkRole");
const app = express();

//dot en configuration
dotenv.config();

//middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use("/auth", authRoutes);

// Protected routes
app.post("/menu", checkRole(["admin", "manager"]), async (_req, res) => {
  // Logic for adding a menu item
  res.send("Menu item added successfully");
});

app.post(
  "/order",
  checkRole(["manager", "waiter"]), // Only manager and waiter can create orders
  async (_req, res) => {
    // Logic to create an order
    res.send("Order placed successfully");
  }
);

app.get(
  "/reports",
  checkRole(["admin", "manager"]), // Only admin and manager can view reports
  async (_req, res) => {
    // Logic to fetch and send reports
    res.send("Reports fetched successfully");
  }
);
app.get("/", (_req, res) => {
  return res.status(200).send("Welcome to Resturant Management System");
});

// port
const PORT = process.env.PORT || 5000;

//listen
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
