import { useState } from "react";
import { api } from "../utils/api";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.match(/^\S+@\S+\.\S+$/)) e.email = "Enter a valid email";
    if (!form.subject.trim()) e.subject = "Subject is required";
    if (form.message.trim().length < 20) e.message = "Message should be at least 20 characters";
    return e;
  };

  const handle = (f) => (e) => { setForm({ ...form, [f]: e.target.value }); setErrors({ ...errors, [f]: "" }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      await api.createContact(form);
      setSubmitted(true);
    } catch (err) {
      alert("Failed to send message: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="breadcrumb">Home / Contact</div>
          <h1>Contact Us</h1>
          <p>We're here to help. Reach out to us anytime!</p>
        </div>
      </div>

      <section className="section">
        <div className="section-inner">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "3rem", alignItems: "start" }}>
            <div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", marginBottom: "1.5rem" }}>Get in Touch</h3>
              {[
                { icon: "📍", title: "Address", val: "Marwadi University, Rajkot, Gujarat 360003" },
                { icon: "📞", title: "Phone", val: "+91 98765 43210" },
                { icon: "✉️", title: "Email", val: "support@localseva.in" },
                { icon: "⏰", title: "Working Hours", val: "Mon–Sat: 8 AM – 8 PM" },
              ].map((c, i) => (
                <div key={i} style={{ display: "flex", gap: "1rem", marginBottom: "1.25rem", alignItems: "flex-start" }}>
                  <div style={{ fontSize: "1.4rem", flexShrink: 0, marginTop: 2 }}>{c.icon}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{c.title}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginTop: 2 }}>{c.val}</div>
                  </div>
                </div>
              ))}
            </div>

            {submitted ? (
              <div className="success-box">
                <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>📨</div>
                <h3>Message Sent!</h3>
                <p>Thank you, {form.name}. We'll get back to you at {form.email} within 24 hours.</p>
              </div>
            ) : (
              <div className="form-card">
                <div className="form-title">Send a Message</div>
                <form onSubmit={handleSubmit} noValidate>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Your Name *</label>
                      <input type="text" placeholder="Full Name" value={form.name} onChange={handle("name")} />
                      {errors.name && <div className="form-error">{errors.name}</div>}
                    </div>
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input type="email" placeholder="you@example.com" value={form.email} onChange={handle("email")} />
                      {errors.email && <div className="form-error">{errors.email}</div>}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Subject *</label>
                    <input type="text" placeholder="How can we help?" value={form.subject} onChange={handle("subject")} />
                    {errors.subject && <div className="form-error">{errors.subject}</div>}
                  </div>
                  <div className="form-group">
                    <label>Message *</label>
                    <textarea rows={5} placeholder="Write your message..." value={form.message} onChange={handle("message")} />
                    {errors.message && <div className="form-error">{errors.message}</div>}
                  </div>
                  <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? "Sending..." : "Send Message →"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
