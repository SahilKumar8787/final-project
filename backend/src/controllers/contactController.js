const Contact = require("../models/Contact");

// @route POST /api/contacts
exports.createContact = async (req, res, next) => {
  try {
    const { name, email, subject, message, phone } = req.body;
    if (!name || !email || !subject || !message)
      return res.status(400).json({ success: false, message: "Name, email, subject, and message are required" });

    const contact = await Contact.create({ name, email, subject, message, phone });
    res.status(201).json({ success: true, message: "Contact submitted successfully", contact });
  } catch (err) { next(err); }
};

// @route GET /api/contacts (Admin only)
exports.getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, contacts });
  } catch (err) { next(err); }
};

// @route DELETE /api/contacts/:id (Admin only)
exports.deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: "Contact not found" });
    res.json({ success: true, message: "Contact deleted successfully" });
  } catch (err) { next(err); }
};