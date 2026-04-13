import { useState, useEffect } from "react";
import { api } from "../../utils/api";

const categories = ["Plumbing", "Electrical", "Carpentry", "Painting", "Cleaning"];
const emptyForm = { title: "", category: "Plumbing", price: "", desc: "", image: "", icon: "🔧", bg: "#F5F5F5", features: "" };

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await api.getServices();
      setServices(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.price.trim()) e.price = "Price is required";
    if (!form.desc.trim()) e.desc = "Description is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        features: form.features ? form.features.split(",").map(f => f.trim()).filter(Boolean) : [],
      };
      if (editId) {
        const data = await api.updateService(editId, payload);
        setServices(services.map(s => s._id === editId ? data.data : s));
      } else {
        const data = await api.createService(payload);
        setServices([data.data, ...services]);
      }
      closeForm();
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (s) => {
    setForm({
      title: s.title, category: s.category, price: s.price, desc: s.desc,
      image: s.image || "", icon: s.icon || "🔧", bg: s.bg || "#F5F5F5",
      features: (s.features || []).join(", "),
    });
    setEditId(s._id);
    setShowForm(true);
    setErrors({});
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service? It will be hidden from users.")) return;
    try {
      await api.deleteService(id);
      setServices(services.filter(s => s._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const closeForm = () => {
    setShowForm(false); setForm(emptyForm); setEditId(null); setErrors({});
  };

  const handle = (f) => (e) => { setForm({ ...form, [f]: e.target.value }); setErrors({ ...errors, [f]: "" }); };

  const filtered = services.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Services</h1>
          <p className="admin-page-sub">Manage all services. Changes save directly to MongoDB.</p>
        </div>
        <button className="admin-btn-primary" onClick={() => { closeForm(); setShowForm(true); }}>+ Add Service</button>
      </div>

      {showForm && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>{editId ? "Edit Service" : "Add New Service"}</h3>
              <button className="modal-close" onClick={closeForm}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              {errors.submit && <div className="api-error" style={{ marginBottom: "1rem" }}>{errors.submit}</div>}
              <div className="form-group">
                <label>Service Title *</label>
                <input type="text" placeholder="e.g. Pipe Repair" value={form.title} onChange={handle("title")} />
                {errors.title && <div className="form-error">{errors.title}</div>}
              </div>
              <div className="admin-form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select value={form.category} onChange={handle("category")}>
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input type="text" placeholder="e.g. ₹299" value={form.price} onChange={handle("price")} />
                  {errors.price && <div className="form-error">{errors.price}</div>}
                </div>
              </div>
              <div className="admin-form-row">
                <div className="form-group">
                  <label>Icon (emoji)</label>
                  <input type="text" placeholder="🔧" value={form.icon} onChange={handle("icon")} />
                </div>
                <div className="form-group">
                  <label>Card BG Color</label>
                  <input type="color" value={form.bg} onChange={handle("bg")} style={{ height: 38, padding: "2px 4px", cursor: "pointer" }} />
                </div>
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea rows={3} placeholder="Describe the service..." value={form.desc} onChange={handle("desc")} />
                {errors.desc && <div className="form-error">{errors.desc}</div>}
              </div>
              <div className="form-group">
                <label>Features (comma-separated)</label>
                <input type="text" placeholder="Leak detection, Pipe replacement, Drain cleaning" value={form.features} onChange={handle("features")} />
              </div>
              <div className="form-group">
                <label>Image URL (optional)</label>
                <input type="text" placeholder="https://..." value={form.image} onChange={handle("image")} />
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn-ghost" onClick={closeForm}>Cancel</button>
                <button type="submit" className="admin-btn-primary" disabled={saving}>
                  {saving ? "Saving..." : editId ? "Update Service" : "Add Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-header">
          <input
            className="search-input" style={{ width: 240 }}
            placeholder="🔍  Search services..."
            value={search} onChange={e => setSearch(e.target.value)}
          />
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            {loading ? "Loading..." : `${filtered.length} services in MongoDB`}
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>⏳ Fetching from MongoDB...</div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#A32D2D" }}>⚠️ {error}</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
            No services found. Click "+ Add Service" or run <code>node seed.js</code>
          </div>
        ) : (
          <div className="admin-services-grid">
            {filtered.map(s => (
              <div className="admin-service-card" key={s._id}>
                <div className="asc-image">
                  {s.image
                    ? <img src={s.image} alt={s.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <span style={{ fontSize: "2.5rem" }}>{s.icon || "🔧"}</span>
                  }
                  <span className="sc-badge">{s.category}</span>
                </div>
                <div className="asc-body">
                  <div className="asc-title">{s.title}</div>
                  <div className="asc-desc">{s.desc}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.75rem" }}>
                    <span style={{ fontWeight: 700, color: "var(--primary)" }}>{s.price}</span>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>⭐ {s.rating} ({s.reviews})</span>
                  </div>
                  <div className="asc-actions">
                    <button className="admin-btn-sm edit" onClick={() => handleEdit(s)}>✏️ Edit</button>
                    <button className="admin-btn-sm delete" onClick={() => handleDelete(s._id)}>🗑️ Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
