const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name:     { type: String, required: [true, "Name is required"], trim: true },
  email:    { type: String, required: [true, "Email is required"], unique: true, lowercase: true },
  phone:    { type: String, default: "" },
  password: { type: String, minlength: 6, select: false },
  role:     { type: String, enum: ["customer", "provider", "admin"], default: "customer" },
  provider: { type: String, default: "email" },
  avatar:   { type: String, default: "" },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model("User", userSchema);
