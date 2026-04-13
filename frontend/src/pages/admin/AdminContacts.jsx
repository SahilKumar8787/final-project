import { useState, useEffect } from "react";
import { api } from "../../utils/api";

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState("");

  useEffect(() => { fetchContacts(); }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const data = await api.getContacts();
      setContacts(data.contacts || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (id) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;
    setDeleting(id);
    try {
      await api.deleteContact(id);
      setContacts(contacts.filter(c => c._id !== id));
    } catch (err) {
      alert("Failed to delete: " + err.message);
    } finally {
      setDeleting("");
    }
  };

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Contacts</h1>
        <p className="admin-page-sub">View and manage contact form submissions.</p>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <input className="search-input" style={{ width: 280 }}
            placeholder="🔍 Search by name, email, or subject..."
            value={search} onChange={e => setSearch(e.target.value)} />
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            {loading ? "Loading..." : `${filtered.length} contacts`}
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>⏳ Fetching contacts...</div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#A32D2D" }}>⚠️ {error}</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c._id}>
                    <td>{c.name}</td>
                    <td>{c.email}</td>
                    <td>{c.subject}</td>
                    <td style={{ maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis" }}>{c.message}</td>
                    <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn-danger"
                        onClick={() => deleteContact(c._id)}
                        disabled={deleting === c._id}
                        style={{ fontSize: "0.8rem", padding: "0.25rem 0.5rem" }}
                      >
                        {deleting === c._id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}