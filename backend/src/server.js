require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow any localhost port (5173, 5174, 3000, etc.) and no-origin requests (Postman)
    if (!origin || origin.startsWith("http://localhost")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth",     require("./routes/auth"));
app.use("/api/services", require("./routes/services"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/users",    require("./routes/users"));
app.use("/api/contacts", require("./routes/contacts"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "LocalSeva API is running 🚀", env: process.env.NODE_ENV });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 LocalSeva Backend running on http://localhost:${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV}`);
  console.log(`🏥 Health: http://localhost:${PORT}/api/health\n`);
});