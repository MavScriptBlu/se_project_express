const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/users");

// GET /users/me - returns current user
router.get("/me", getCurrentUser);

// PATCH /users/me - updates current user
router.patch("/me", updateUser);

module.exports = router;
