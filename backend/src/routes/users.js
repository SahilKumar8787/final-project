const express = require("express");
const router = express.Router();
const { getAllUsers, getUser, toggleUserStatus, updateProfile, getStats } = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/stats", protect, adminOnly, getStats);
router.get("/", protect, adminOnly, getAllUsers);
router.get("/:id", protect, adminOnly, getUser);
router.put("/profile", protect, updateProfile);
router.put("/:id/status", protect, adminOnly, toggleUserStatus);

module.exports = router;
