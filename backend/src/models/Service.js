const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  title:    { type: String, required: true, trim: true },
  category: { type: String, required: true },
  desc:     { type: String, required: true },
  price:    { type: String, required: true },
  image:    { type: String, default: "" },
  icon:     { type: String, default: "🔧" },
  bg:       { type: String, default: "#F5F5F5" },
  rating:   { type: Number, default: 4.5 },
  reviews:  { type: Number, default: 0 },
  features: [{ type: String }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Service", serviceSchema);
