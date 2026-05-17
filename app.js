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
} = process.env;

const app = express();

// Security enhancements
app.use(helmet()); // Use helmet for security headers
app.disable("x-powered-by"); // Disable X-Powered-By header to reduce fingerprinting

// CORS configuration
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Connection error:", err));

// Middleware to parse JSON
app.use(express.json());

// Use routes
app.use("/", routes);

// Custom error handler (must be last middleware)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
    message: mapErrorToResponse(ERROR_MESSAGES.INTERNAL_SERVER_ERROR),
  });
});

// Start the server (only in local development)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export for Vercel serverless deployment
module.exports = app;
