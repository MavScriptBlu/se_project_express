const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { STATUS_CODES, ERROR_MESSAGES } = require("../utils/constants");
const { createUser, login } = require("../controllers/users");
const auth = require("../middlewares/auth");

// Public routes (no auth required)
router.post("/signup", createUser);
router.post("/signin", login);

// Public - GET /items (unprotected)
router.get("/items", require("../controllers/clothingItems").getClothingItems);

// Apply auth middleware to all routes below
router.use(auth);

// Protected routes
router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

// Handle non-existent resources
router.use((req, res) => {
  res
    .status(STATUS_CODES.NOT_FOUND)
    .json({ message: ERROR_MESSAGES.RESOURCE_NOT_FOUND });
});

module.exports = router;
