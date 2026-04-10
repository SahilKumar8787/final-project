require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/User");
const Service = require("./src/models/Service");

const services = [
  { title: "Pipe Repair & Leakage Fix", category: "Plumbing", desc: "Expert plumbers for all types of pipe leaks, blockages, and plumbing emergencies.", price: "₹299", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", icon: "🔧", bg: "#E8F4FD", rating: 4.8, reviews: 312, features: ["Leak detection","Pipe replacement","Drain cleaning","Water heater repair"] },
  { title: "Bathroom Fitting & Installation", category: "Plumbing", desc: "Full bathroom fitting service including taps, showers, and sanitary ware.", price: "₹499", image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80", icon: "🚿", bg: "#EDF7FF", rating: 4.7, reviews: 189, features: ["Tap installation","Shower fitting","Toilet installation","Basin setup"] },
  { title: "Wiring & Switchboard Repair", category: "Electrical", desc: "Certified electricians for safe wiring, switchboard repairs, and MCB fixes.", price: "₹399", image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&q=80", icon: "⚡", bg: "#FFFBEA", rating: 4.9, reviews: 427, features: ["Switchboard repair","MCB fixing","New wiring","Safety audit"] },
  { title: "Fan & AC Installation", category: "Electrical", desc: "Quick and professional installation of ceiling fans, ACs, and appliances.", price: "₹349", image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80", icon: "❄️", bg: "#F0FFF4", rating: 4.6, reviews: 284, features: ["AC installation","Fan fitting","Split AC service","Wiring check"] },
  { title: "Furniture Repair & Assembly", category: "Carpentry", desc: "Skilled carpenters for furniture assembly, repairs, and custom woodwork.", price: "₹449", image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&q=80", icon: "🪵", bg: "#FFF5EE", rating: 4.7, reviews: 198, features: ["Furniture assembly","Wood repairs","Drawer fixing","Polish & finish"] },
  { title: "Door & Window Fitting", category: "Carpentry", desc: "Professional door and window installation, alignment, and lock fitting.", price: "₹599", image: "https://images.unsplash.com/photo-1558618047-f4e59b2a0df0?w=600&q=80", icon: "🚪", bg: "#F5F0FF", rating: 4.8, reviews: 156, features: ["Door installation","Window fitting","Lock repair","Hinge fixing"] },
  { title: "Interior Wall Painting", category: "Painting", desc: "Transform your home with professional interior painting using premium paints.", price: "₹799", image: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=600&q=80", icon: "🎨", bg: "#FFF0F5", rating: 4.9, reviews: 345, features: ["Wall preparation","Premium paints","2 coats","Clean-up included"] },
  { title: "Deep Home Cleaning", category: "Cleaning", desc: "Thorough deep cleaning of your entire home including kitchen and bathrooms.", price: "₹699", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80", icon: "🧹", bg: "#F0FFF9", rating: 4.8, reviews: 512, features: ["Kitchen deep clean","Bathroom scrub","Floor mopping","Dusting all surfaces"] },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    await Service.deleteMany({});
    await User.deleteMany({});
    console.log("Cleared existing data");

    await Service.insertMany(services);
    console.log("✅ 8 Services seeded");

    const adminPass = "admin123";
    const userPass  = "user123";

    await User.create([
      { name: "Admin User",  email: "admin@localseva.in", password: adminPass, role: "admin",    phone: "9000000001" },
      { name: "Ravi Patel",  email: "user@localseva.in",  password: userPass,  role: "customer", phone: "9876543210" },
      { name: "Arun Shah",   email: "pro@localseva.in",   password: userPass,  role: "provider", phone: "9812345678" },
    ]);
    console.log("✅ 3 Users seeded (admin, customer, provider)");
    console.log("\n📌 Login Credentials:");
    console.log("   Admin:    admin@localseva.in / admin123");
    console.log("   Customer: user@localseva.in  / user123");
    console.log("   Provider: pro@localseva.in   / user123\n");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed Error:", err.message);
    process.exit(1);
  }
};

seedDB();
