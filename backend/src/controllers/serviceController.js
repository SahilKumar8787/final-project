const Service = require("../models/Service");

// @route GET /api/services
exports.getServices = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let filter = { isActive: true };
    if (category && category !== "All") filter.category = category;
    if (search) filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { desc:  { $regex: search, $options: "i" } },
    ];
    const services = await Service.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: services.length, data: services });
  } catch (err) { next(err); }
};

// @route GET /api/services/:id
exports.getService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });
    res.json({ success: true, data: service });
  } catch (err) { next(err); }
};

// @route POST /api/services  (admin)
exports.createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, data: service });
  } catch (err) { next(err); }
};

// @route PUT /api/services/:id  (admin)
exports.updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });
    res.json({ success: true, data: service });
  } catch (err) { next(err); }
};

// @route DELETE /api/services/:id  (admin)
exports.deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });
    res.json({ success: true, message: "Service deleted" });
  } catch (err) { next(err); }
};
