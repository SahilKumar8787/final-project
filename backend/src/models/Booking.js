const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  name:    { type: String, required: true },
  phone:   { type: String, required: true },
  email:   { type: String, required: true },
  address: { type: String, required: true },
  date:    { type: String, required: true },
  time:    { type: String, required: true },
  note:    { type: String, default: "" },
  amount:  { type: String, required: true },
  status:  { type: String, enum: ["Pending","Confirmed","Completed","Cancelled"], default: "Pending" },
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
