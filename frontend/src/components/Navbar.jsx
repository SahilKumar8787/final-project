import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/"); setOpen(false); };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <div className="nav-icon">
          <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
        </div>
        Local<span>Seva</span>
      </Link>

      <div className={`nav-links ${open ? "open" : ""}`}>
        <NavLink to="/" end onClick={() => setOpen(false)}>Home</NavLink>
        <NavLink to="/services" onClick={() => setOpen(false)}>Services</NavLink>
        <NavLink to="/about" onClick={() => setOpen(false)}>About</NavLink>
        <NavLink to="/contact" onClick={() => setOpen(false)}>Contact</NavLink>
        {user?.role === "admin" && (
          <NavLink to="/admin" onClick={() => setOpen(false)} style={{ color: "var(--primary)", fontWeight: 600 }}>Admin ⚙️</NavLink>
        )}
      </div>

      <div className="nav-auth">
        {user ? (
          <div className="nav-user">
            <div className="nav-user-avatar">
              {user.avatar
                ? <img src={user.avatar} alt={user.name} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                : user.name?.charAt(0).toUpperCase()}
            </div>
            <span className="nav-user-name">{user.name?.split(" ")[0]}</span>
            <button className="btn-ghost" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <>
            <Link to="/login"><button className="btn-ghost">Login</button></Link>
            <Link to="/register"><button className="btn-primary">Sign Up</button></Link>
          </>
        )}
        <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
