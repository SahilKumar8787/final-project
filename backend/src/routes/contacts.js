const express = require("express");
const router = express.Router();
const { createContact, getContacts, deleteContact } = require("../controllers/contactController");
const { protect, adminOnly } = require("../middleware/auth");

router.post("/", createContact);
router.get("/", protect, adminOnly, getContacts);
router.delete("/:id", protect, adminOnly, deleteContact);

module.exports = router;