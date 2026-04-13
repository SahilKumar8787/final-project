import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../utils/api";

const statusColors = {
  Confirmed: { bg: "#EDF7FF", color: "#185FA5" },
  Pending: { bg: "#FFFBEA", color: "#854F0B" },
  Completed: { bg: "#EDFBF4", color: "#1A8A5A" },
  Cancelled: { bg: "#FCEBEB", color: "#A32D2D" },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getStats(), api.getAllBookings()])
      .then(([statsData, bookingsData]) => {
        setStats(statsData.data);
        setRecentBookings((bookingsData.data || []).slice(0, 5));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: "Total Bookings", value: stats.totalBookings?.toLocaleString(), change: "Live from DB", icon: "📅", color: "#E8470A" },
    { label: "Pending Bookings", value: stats.pendingBookings?.toLocaleString(), change: "Needs action", icon: "⏳", color: "#854F0B" },
    { label: "Total Users", value: stats.totalUsers?.toLocaleString(), change: "Live from DB", icon: "👥", color: "#1A1A2E" },
    { label: "Customers", value: stats.totalCustomers?.toLocaleString(), change: `+ ${stats.totalProviders} providers`, icon: "🙋", color: "#1A8A5A" },
  ] : [];

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-sub">Live data from MongoDB — here's what's happening.</p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>⏳ Loading live data from MongoDB...</div>
      ) : (
        <>
          <div className="admin-stats-grid">
            {statCards.map((s, i) => (
              <div className="admin-stat-card" key={i}>
                <div className="asc-top">
                  <div className="asc-icon" style={{ background: s.color + "18", color: s.color }}>{s.icon}</div>
                  <span className="asc-change">{s.change}</span>
                </div>
                <div className="asc-value">{s.value}</div>
                <div className="asc-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">Recent Bookings</h2>
              <Link to="/admin/bookings" className="admin-link">View All →</Link>
            </div>
            {recentBookings.length === 0 ? (
              <p style={{ padding: "2rem", color: "var(--text-muted)", textAlign: "center" }}>No bookings yet. Seed the DB or let users book!</p>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr><th>Customer</th><th>Service</th><th>Date</th><th>Amount</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((b, i) => (
                      <tr key={i}>
                        <td>
                          <div style={{ fontWeight: 600, fontSize: "0.88rem" }}>{b.user?.name || b.name}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{b.user?.email}</div>
                        </td>
                        <td>{b.service?.title || "—"}</td>
                        <td style={{ fontSize: "0.85rem" }}>{b.date}</td>
                        <td style={{ fontWeight: 600 }}>₹{b.amount}</td>
                        <td>
                          <span className="status-badge" style={{ background: statusColors[b.status]?.bg, color: statusColors[b.status]?.color }}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      <div className="admin-quick-grid">
        {[
          { icon: "➕", title: "Add New Service", desc: "Add a new service to the platform", to: "/admin/services" },
          { icon: "📅", title: "Manage Bookings", desc: "View and update booking status", to: "/admin/bookings" },
          { icon: "👥", title: "Manage Users", desc: "View all customers and providers", to: "/admin/users" },
          { icon: "🌐", title: "View Live Site", desc: "See how the site looks to users", to: "/" },
        ].map((q, i) => (
          <Link to={q.to} key={i} style={{ textDecoration: "none" }}>
            <div className="admin-quick-card">
              <div className="aqc-icon">{q.icon}</div>
              <div className="aqc-title">{q.title}</div>
              <div className="aqc-desc">{q.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
