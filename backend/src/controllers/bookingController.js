const Booking = require("../models/Booking");
const Service = require("../models/Service");

// @route POST /api/bookings  (protected)
exports.createBooking = async (req, res, next) => {
  try {
    const { serviceId, name, phone, email, address, date, time, note } = req.body;
    if (!serviceId || !name || !phone || !email || !address || !date || !time)
      return res.status(400).json({ success: false, message: "All required fields must be filled" });

    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });

    const booking = await Booking.create({
      user: req.user._id, service: serviceId,
      name, phone, email, address, date, time, note,
      amount: service.price,
    });
    await booking.populate("service", "title category icon");
    res.status(201).json({ success: true, data: booking });
  } catch (err) { next(err); }
};

// @route GET /api/bookings/my  (protected - own bookings)
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("service", "title category icon price image")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) { next(err); }
};

// @route GET /api/bookings  (admin only)
exports.getAllBookings = async (req, res, next) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status && status !== "All") filter.status = status;
    const bookings = await Booking.find(filter)
      .populate("user", "name email phone")
      .populate("service", "title category")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) { next(err); }
};

// @route PUT /api/bookings/:id/status  (admin)
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id, { status }, { new: true, runValidators: true }
    ).populate("user", "name email").populate("service", "title");
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    res.json({ success: true, data: booking });
  } catch (err) { next(err); }
};

// @route DELETE /api/bookings/:id
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Not authorized" });
    await booking.deleteOne();
    res.json({ success: true, message: "Booking cancelled" });
  } catch (err) { next(err); }
};
