import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "", role: "customer" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.match(/^\S+@\S+\.\S+$/)) e.email = "Enter a valid email";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    return e;
  };

  const handle = (f) => (e) => { setForm({ ...form, [f]: e.target.value }); setErrors({ ...errors, [f]: "" }); setApiError(""); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      const data = await api.register({ name: form.name, email: form.email, phone: form.phone, password: form.password, role: form.role });
      login(data.user, data.token);
      navigate(data.user.role === "admin" ? "/admin" : "/");
    } catch (err) {
      setApiError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🏠</div>
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-sub">Join LocalSeva and book home services easily</p>
        </div>

        {apiError && <div className="api-error">{apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Full Name *</label>
            <input type="text" placeholder="Ravi Patel" value={form.name} onChange={handle("name")} />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>
          <div className="form-group">
            <label>Email Address *</label>
            <input type="email" placeholder="ravi@example.com" value={form.email} onChange={handle("email")} />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" placeholder="9876543210" value={form.phone} onChange={handle("phone")} />
          </div>
          <div className="form-group">
            <label>Register as</label>
            <select value={form.role} onChange={handle("role")}>
              <option value="customer">Customer</option>
              <option value="provider">Service Provider</option>
            </select>
          </div>
          <div className="form-group">
            <label>Password *</label>
            <input type="password" placeholder="Min. 6 characters" value={form.password} onChange={handle("password")} />
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>
          <div className="form-group">
            <label>Confirm Password *</label>
            <input type="password" placeholder="Re-enter password" value={form.confirm} onChange={handle("confirm")} />
            {errors.confirm && <div className="form-error">{errors.confirm}</div>}
          </div>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account →"}
          </button>
        </form>

        <div className="form-link">Already have an account? <Link to="/login">Sign In</Link></div>
      </div>
    </section>
  );
}
