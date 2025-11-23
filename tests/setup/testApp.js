const express = require("express");
const helmet = require("helmet");
const routes = require("../../routes");

// Create a test app instance (without MongoDB connection and server listen)
const createTestApp = (userId = "6863bbc8eb627a884f678c38") => {
  const app = express();

  // Security enhancements
  app.use(helmet());
  app.disable("x-powered-by");

  // Middleware to parse JSON
  app.use(express.json());

  // Temporary middleware to add user to request (for testing)
  app.use((req, res, next) => {
    req.user = {
      _id: userId,
    };
    next();
  });

  // Use routes
  app.use("/", routes);

  return app;
};

module.exports = { createTestApp };
