# LocalSeva — Full Stack Home Services Platform

> **AWT Project | Marwadi University | Semester 4 | 01CE1412**  
> Design and Development of a Secured Full-Stack Web Application using MERN Stack

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs, Social Login Simulation |
| Styling | Custom CSS, Google Fonts (Syne + DM Sans) |

---

## 📁 Project Structure

```
localseva/
├── frontend/               # React App
│   ├── src/
│   │   ├── components/     # Navbar, Footer, AdminLayout
│   │   ├── context/        # AuthContext (JWT state)
│   │   ├── data/           # Static services data
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Services.jsx
│   │   │   ├── BookService.jsx
│   │   │   ├── Login.jsx       ← Google/Apple/GitHub + Email login
│   │   │   ├── Register.jsx    ← Social + Email register
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminServices.jsx
│   │   │       ├── AdminBookings.jsx
│   │   │       └── AdminUsers.jsx
│   │   └── index.css
│   └── package.json
│
└── backend/                # Node.js + Express API
    ├── src/
    │   ├── config/db.js        # MongoDB connection
    │   ├── models/
    │   │   ├── User.js         # User schema (bcrypt)
    │   │   ├── Service.js      # Service schema
    │   │   └── Booking.js      # Booking schema
    │   ├── controllers/
    │   │   ├── authController.js    # Register, Login, JWT
    │   │   ├── serviceController.js # CRUD services
    │   │   ├── bookingController.js # CRUD bookings
    │   │   └── userController.js    # Admin user mgmt
    │   ├── middleware/
    │   │   ├── auth.js         # JWT protect + adminOnly
    │   │   └── error.js        # Global error handler
    │   ├── routes/
    │   │   ├── auth.js
    │   │   ├── services.js
    │   │   ├── bookings.js
    │   │   └── users.js
    │   └── server.js
    ├── seed.js                 # Database seeder
    ├── .env
    └── package.json
```

---

## ⚙️ Setup & Run

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally on port 27017)

### 1. Backend Setup

```bash
cd backend
npm install

# Seed database with sample data
node seed.js

# Start backend
npm run dev
# → Runs on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
# → Runs on http://localhost:5173
```

---

## 🔐 Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@localseva.in | admin123 |
| Customer | user@localseva.in | user123 |
| Provider | pro@localseva.in | user123 |

**Social Login (Simulation):** Google / Apple / GitHub buttons work with demo simulation — no real OAuth needed.

---

## 📡 API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login with email+password |
| POST | /api/auth/social | Social login (simulation) |
| GET | /api/auth/me | Get logged-in user (JWT) |

### Services
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /api/services | Public | Get all services |
| GET | /api/services/:id | Public | Get single service |
| POST | /api/services | Admin | Create service |
| PUT | /api/services/:id | Admin | Update service |
| DELETE | /api/services/:id | Admin | Delete service |

### Bookings
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/bookings | User | Create booking |
| GET | /api/bookings/my | User | My bookings |
| GET | /api/bookings | Admin | All bookings |
| PUT | /api/bookings/:id/status | Admin | Update status |
| DELETE | /api/bookings/:id | User/Admin | Cancel booking |

### Users
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /api/users | Admin | All users |
| PUT | /api/users/:id/status | Admin | Toggle active |
| PUT | /api/users/profile | User | Update profile |
| GET | /api/users/stats | Admin | Dashboard stats |

---

## 🔒 Security Features

- ✅ JWT Authentication (7 day expiry)
- ✅ bcrypt Password Hashing (salt rounds: 12)
- ✅ Role-Based Access Control (customer / provider / admin)
- ✅ Protected Admin Routes (React + API level)
- ✅ Environment Variables (.env)
- ✅ Global Error Handling
- ✅ Input Validation

---

## 🌐 Pages

| Route | Page |
|-------|------|
| / | Home — hero, categories, services, testimonials |
| /services | All services with filter + search |
| /book/:id | Book a service (with form validation) |
| /login | Login — Email + Google + Apple + GitHub |
| /register | Register — Email + Social |
| /about | About page + team |
| /contact | Contact form |
| /admin | Admin Dashboard |
| /admin/services | Manage services (CRUD) |
| /admin/bookings | Manage bookings |
| /admin/users | Manage users |

---

## 🎓 Course Details

- **Subject:** Advanced Web Technology (AWT) — 01CE1412
- **Branch:** Computer Engineering, Semester 4
- **University:** Marwadi University, Rajkot, Gujarat
- **Submission:** 10th April 2026
