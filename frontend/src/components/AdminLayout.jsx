import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: "📊", end: true },
  { to: "/admin/services", label: "Services", icon: "🔧" },
  { to: "/admin/bookings", label: "Bookings", icon: "📅" },
  { to: "/admin/users", label: "Users", icon: "👥" },
  { to: "/admin/contacts", label: "Contacts", icon: "📧" },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [sideOpen, setSideOpen] = useState(true);

  return (
    <div className="admin-wrap">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sideOpen ? "open" : "collapsed"}`}>
        <div className="admin-brand">
          <span className="ab-icon">🏠</span>
          {sideOpen && <span>Local<span style={{ color: "#E8470A" }}>Seva</span> <span className="ab-tag">Admin</span></span>}
        </div>
        <nav className="admin-nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
            >
              <span className="ani-icon">{item.icon}</span>
              {sideOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <button className="admin-nav-item" onClick={() => navigate("/")} style={{ width: "100%", border: "none", cursor: "pointer", background: "none" }}>
            <span className="ani-icon">🌐</span>
            {sideOpen && <span>View Site</span>}
          </button>
          <button className="admin-nav-item" onClick={() => { logout(); navigate("/login"); }} style={{ width: "100%", border: "none", cursor: "pointer", background: "none" }}>
            <span className="ani-icon">🚪</span>
            {sideOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="admin-main">
        {/* Top bar */}
        <header className="admin-topbar">
          <button className="sidebar-toggle" onClick={() => setSideOpen(!sideOpen)}>
            {sideOpen ? "◀" : "▶"}
          </button>
          <div className="admin-topbar-right">
            <div className="admin-avatar">A</div>
            <div>
              <div style={{ fontSize: "0.88rem", fontWeight: 600 }}>Admin User</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>admin@localseva.in</div>
            </div>
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
