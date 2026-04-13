import { useState, useEffect } from "react";
import { api } from "../../utils/api";

const statusColors = {
  Confirmed: { bg: "#EDF7FF", color: "#185FA5" },
  Pending:   { bg: "#FFFBEA", color: "#854F0B" },
  Completed: { bg: "#EDFBF4", color: "#1A8A5A" },
  Cancelled: { bg: "#FCEBEB", color: "#A32D2D" },
};

const statuses = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState("");

  useEffect(() => { fetchBookings(); }, [filter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = filter !== "All" ? { status: filter } : {};
      const data = await api.getAllBookings(params);
      setBookings(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    setUpdating(id);
    try {
      const data = await api.updateBookingStatus(id, newStatus);
      setBookings(bookings.map(b => b._id === id ? data.data : b));
    } catch (err) {
      alert("Failed to update: " + err.message);
    } finally {
      setUpdating("");
    }
  };

  const filtered = bookings.filter(b => {
    const name = b.user?.name || b.name || "";
    const svc  = b.service?.title || "";
    return name.toLowerCase().includes(search.toLowerCase()) ||
           svc.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Bookings</h1>
          <p className="admin-page-sub">View and update all customer bookings from MongoDB.</p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
          {statuses.map(s => (
            <button key={s} className={`filter-btn ${filter === s ? "active" : ""}`}
              onClick={() => setFilter(s)} style={{ fontSize: "0.8rem", padding: "0.35rem 0.9rem" }}>{s}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <input className="search-input" style={{ width: 280 }}
            placeholder="🔍  Search by name or service..."
            value={search} onChange={e => setSearch(e.target.value)} />
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            {loading ? "Loading..." : `${filtered.length} bookings`}
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>⏳ Fetching bookings from MongoDB...</div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#A32D2D" }}>⚠️ {error}</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Date & Time</th>
                  <th>Address</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Update</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b._id}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: "0.88rem" }}>{b.user?.name || b.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{b.user?.email || b.email}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{b.phone}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: "0.88rem" }}>{b.service?.title || "—"}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{b.service?.category}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: "0.85rem" }}>{b.date}</div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{b.time}</div>
                    </td>
                    <td style={{ fontSize: "0.8rem", color: "var(--text-muted)", maxWidth: 180 }}>{b.address}</td>
                    <td style={{ fontWeight: 700, color: "var(--primary)" }}>₹{b.amount}</td>
                    <td>
                      <span className="status-badge"
                        style={{ background: statusColors[b.status]?.bg, color: statusColors[b.status]?.color }}>
                        {b.status}
                      </span>
                    </td>
                    <td>
                      <select
                        value={b.status}
                        disabled={updating === b._id}
                        onChange={e => updateStatus(b._id, e.target.value)}
                        style={{ fontSize: "0.78rem", padding: "4px 8px", border: "1px solid var(--border)", borderRadius: "6px", background: "var(--bg)", color: "var(--text)", cursor: "pointer" }}
                      >
                        {["Pending", "Confirmed", "Completed", "Cancelled"].map(s => <option key={s}>{s}</option>)}
                      </select>
                      {updating === b._id && <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginLeft: 4 }}>saving...</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
                No bookings found. Users need to book services first.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
