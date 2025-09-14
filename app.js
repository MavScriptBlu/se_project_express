const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const routes = require("./routes");
const {
  STATUS_CODES,
  ERROR_MESSAGES,
  mapErrorToResponse,
} = require("./utils/constants");

const {
  PORT = 3001,
  MONGODB_URI = "mongodb://127.0.0.1:27017/wtwr_db",
  FRONTEND_URL,
} = process.env;

const app = express();

// Security enhancements
app.use(helmet()); // Use helmet for security headers
app.disable("x-powered-by"); // Disable X-Powered-By header to reduce fingerprinting

// CORS configuration
app.use(
  cors({
    origin: FRONTEND_URL || "http://localhost:5173", // fallback to local dev
    credentials: true,
  })
);

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Connection error:", err));

// Middleware to parse JSON
app.use(express.json());

// Temporary middleware to add user to request (for testing)
app.use((req, res, next) => {
  req.user = {
    _id: "6863bbc8eb627a884f678c38", // _id of the test user
  };
  next();
});

// Use routes
app.use("/", routes);

// Custom error handler (must be last middleware)
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
    message: mapErrorToResponse(ERROR_MESSAGES.INTERNAL_SERVER_ERROR),
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
