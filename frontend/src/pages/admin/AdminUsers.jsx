import { useState, useEffect } from "react";
import { api } from "../../utils/api";

const roleColors = {
  customer: { bg: "#EDF7FF", color: "#185FA5" },
  provider: { bg: "#EDFBF4", color: "#1A8A5A" },
  admin:    { bg: "#F5F0FF", color: "#7C3AED" },
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [toggling, setToggling] = useState("");

  useEffect(() => { fetchUsers(); }, [filter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = filter !== "All" ? { role: filter.toLowerCase() } : {};
      const data = await api.getAllUsers(params);
      setUsers(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id) => {
    setToggling(id);
    try {
      const data = await api.toggleUserStatus(id);
      setUsers(users.map(u => u._id === id ? data.data : u));
    } catch (err) {
      alert("Failed: " + err.message);
    } finally {
      setToggling("");
    }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const counts = {
    total: users.length,
    customers: users.filter(u => u.role === "customer").length,
    providers: users.filter(u => u.role === "provider").length,
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Users</h1>
          <p className="admin-page-sub">Manage all customers and providers from MongoDB.</p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {["All", "Customer", "Provider"].map(r => (
            <button key={r} className={`filter-btn ${filter === r ? "active" : ""}`}
              onClick={() => setFilter(r)} style={{ fontSize: "0.8rem", padding: "0.35rem 0.9rem" }}>{r}
            </button>
          ))}
        </div>
      </div>

      {/* Live summary cards */}
      <div className="admin-stats-grid" style={{ gridTemplateColumns: "repeat(3,1fr)", marginBottom: "1.5rem" }}>
        {[
          { label: "Total Users", value: counts.total, icon: "👥", color: "#1A1A2E" },
          { label: "Customers", value: counts.customers, icon: "🙋", color: "#185FA5" },
          { label: "Providers", value: counts.providers, icon: "🔧", color: "#1A8A5A" },
        ].map((s, i) => (
          <div className="admin-stat-card" key={i}>
            <div className="asc-top">
              <div className="asc-icon" style={{ background: s.color + "18", color: s.color }}>{s.icon}</div>
              <span className="asc-change">Live from DB</span>
            </div>
            <div className="asc-value">{loading ? "..." : s.value}</div>
            <div className="asc-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <input className="search-input" style={{ width: 280 }}
            placeholder="🔍  Search by name or email..."
            value={search} onChange={e => setSearch(e.target.value)} />
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            {loading ? "Loading..." : `${filtered.length} users`}
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>⏳ Fetching users from MongoDB...</div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#A32D2D" }}>⚠️ {error}</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>User</th><th>Phone</th><th>Role</th><th>Joined</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {filtered.map((u) => {
                  const initials = u.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "?";
                  const rc = roleColors[u.role] || roleColors.customer;
                  const joined = new Date(u.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
                  return (
                    <tr key={u._id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: "50%", background: rc.bg, color: rc.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.8rem", flexShrink: 0 }}>
                            {u.avatar ? <img src={u.avatar} alt={u.name} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} /> : initials}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: "0.88rem" }}>{u.name}</div>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: "0.85rem" }}>{u.phone || "—"}</td>
                      <td>
                        <span className="status-badge" style={{ background: rc.bg, color: rc.color }}>
                          {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                        </span>
                      </td>
                      <td style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{joined}</td>
                      <td>
                        <span className="status-badge" style={{
                          background: u.isActive ? "#EDFBF4" : "#F5F5F5",
                          color: u.isActive ? "#1A8A5A" : "#888"
                        }}>
                          {u.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <button
                          disabled={toggling === u._id}
                          onClick={() => toggleStatus(u._id)}
                          className="admin-btn-sm"
                          style={{
                            background: u.isActive ? "#FCEBEB" : "#EDFBF4",
                            color: u.isActive ? "#A32D2D" : "#1A8A5A",
                            border: "none", opacity: toggling === u._id ? 0.6 : 1
                          }}
                        >
                          {toggling === u._id ? "..." : u.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
                No users found. Register some users or run <code>node seed.js</code>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
