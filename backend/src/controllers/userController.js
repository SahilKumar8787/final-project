const User = require("../models/User");

// @route GET /api/users  (admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    let filter = {};
    if (role && role !== "All") filter.role = role;
    const users = await User.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (err) { next(err); }
};

// @route GET /api/users/:id  (admin)
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

// @route PUT /api/users/:id/status  (admin)
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, data: user, message: `User ${user.isActive ? "activated" : "deactivated"}` });
  } catch (err) { next(err); }
};

// @route PUT /api/users/profile  (protected)
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id, { name, phone, avatar }, { new: true, runValidators: true }
    );
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

// @route GET /api/users/stats  (admin)
exports.getStats = async (req, res, next) => {
  try {
    const Booking = require("../models/Booking");
    const [totalUsers, totalCustomers, totalProviders, totalBookings, pendingBookings] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "customer" }),
      User.countDocuments({ role: "provider" }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: "Pending" }),
    ]);
    res.json({ success: true, data: { totalUsers, totalCustomers, totalProviders, totalBookings, pendingBookings } });
  } catch (err) { next(err); }
};
