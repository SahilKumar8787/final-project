import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";

export default function BookService() {
  const { id } = useParams();
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState("");

  const [form, setForm] = useState({
    name: user?.name || "", phone: "", email: user?.email || "",
    address: "", date: "", time: "", note: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    api.getService(id)
      .then(data => setService(data.data))
      .catch(err => setApiError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.match(/^[6-9]\d{9}$/)) e.phone = "Enter a valid 10-digit mobile number";
    if (!form.email.match(/^\S+@\S+\.\S+$/)) e.email = "Enter a valid email address";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.date) e.date = "Please select a date";
    else {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      if (new Date(form.date) < today) e.date = "Date cannot be in the past";
    }
    if (!form.time) e.time = "Please select a time slot";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    if (!isLoggedIn) { navigate("/login"); return; }

    setSubmitting(true);
    setApiError("");
    try {
      await api.createBooking({ serviceId: id, ...form });
      setSubmitted(true);
    } catch (err) {
      setApiError(err.message || "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handle = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setErrors({ ...errors, [field]: "" });
  };

  if (loading) return (
    <div style={{ textAlign: "center", padding: "5rem 2rem", color: "var(--text-muted)" }}>
      <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div><p>Loading service...</p>
    </div>
  );

  if (apiError && !service) return (
    <div style={{ textAlign: "center", padding: "5rem 2rem" }}>
      <h2>Service not found</h2>
      <p style={{ color: "#A32D2D", marginTop: "0.5rem" }}>{apiError}</p>
      <Link to="/services" style={{ color: "var(--primary)" }}>← Back to Services</Link>
    </div>
  );

  return (
    <>
      <div className="page-header">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="breadcrumb">
            <Link to="/">Home</Link> / <Link to="/services">Services</Link> / Book
          </div>
          <h1>Book {service?.title}</h1>
          <p>Fill in your details and we'll confirm your booking shortly.</p>
        </div>
      </div>

      <section className="section">
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {service && (
            <div className="service-card" style={{ display: "flex", gap: "1.25rem", marginBottom: "2rem", padding: "1.25rem", alignItems: "center" }}>
              <div style={{ background: service.bg || "#F5F5F5", borderRadius: 12, width: 80, height: 80, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.2rem", flexShrink: 0 }}>
                {service.icon || "🔧"}
              </div>
              <div style={{ flex: 1 }}>
                <div className="sc-category">{service.category}</div>
                <div className="sc-title" style={{ fontSize: "1.05rem" }}>{service.title}</div>
                <div style={{ display: "flex", gap: "1rem", marginTop: "0.4rem", alignItems: "center" }}>
                  <span style={{ fontWeight: 700, color: "var(--primary)" }}>{service.price} / visit</span>
                  <span className="sc-rating">⭐ {service.rating} ({service.reviews} reviews)</span>
                </div>
              </div>
            </div>
          )}

          {submitted ? (
            <div className="success-box">
              <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>✅</div>
              <h3>Booking Confirmed!</h3>
              <p>Hi {form.name}, your booking for <strong>{service?.title}</strong> on {form.date} at {form.time} has been received.</p>
              <p style={{ marginTop: "0.4rem" }}>We will contact you at {form.phone} to confirm.</p>
              <Link to="/services" style={{ display: "inline-block", marginTop: "1.25rem", color: "var(--primary)", fontWeight: 600 }}>
                ← Book Another Service
              </Link>
            </div>
          ) : (
            <div className="form-card">
              <div className="form-title">Booking Details</div>
              {!isLoggedIn && (
                <div style={{ background: "#FFFBEA", border: "1px solid #EAD97B", borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "0.88rem" }}>
                  ℹ️ Please <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>login</Link> to confirm your booking.
                </div>
              )}
              {apiError && <div className="api-error">{apiError}</div>}
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input type="text" placeholder="Ravi Patel" value={form.name} onChange={handle("name")} />
                    {errors.name && <div className="form-error">{errors.name}</div>}
                  </div>
                  <div className="form-group">
                    <label>Mobile Number *</label>
                    <input type="tel" placeholder="9876543210" value={form.phone} onChange={handle("phone")} />
                    {errors.phone && <div className="form-error">{errors.phone}</div>}
                  </div>
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input type="email" placeholder="ravi@example.com" value={form.email} onChange={handle("email")} />
                  {errors.email && <div className="form-error">{errors.email}</div>}
                </div>
                <div className="form-group">
                  <label>Service Address *</label>
                  <input type="text" placeholder="Street, Area, City, PIN" value={form.address} onChange={handle("address")} />
                  {errors.address && <div className="form-error">{errors.address}</div>}
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Preferred Date *</label>
                    <input type="date" value={form.date} onChange={handle("date")} />
                    {errors.date && <div className="form-error">{errors.date}</div>}
                  </div>
                  <div className="form-group">
                    <label>Preferred Time *</label>
                    <select value={form.time} onChange={handle("time")}>
                      <option value="">Select a slot</option>
                      <option>8:00 AM – 10:00 AM</option>
                      <option>10:00 AM – 12:00 PM</option>
                      <option>12:00 PM – 2:00 PM</option>
                      <option>2:00 PM – 4:00 PM</option>
                      <option>4:00 PM – 6:00 PM</option>
                    </select>
                    {errors.time && <div className="form-error">{errors.time}</div>}
                  </div>
                </div>
                <div className="form-group">
                  <label>Additional Note (optional)</label>
                  <textarea rows={3} placeholder="Describe your issue in detail..." value={form.note} onChange={handle("note")} />
                </div>
                <button type="submit" className="btn-submit" disabled={submitting}>
                  {submitting ? "Submitting..." : "Confirm Booking →"}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
