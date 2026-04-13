import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";

const socialProviders = [
  {
    id: "google", label: "Continue with Google",
    bg: "#fff", border: "#dadce0", color: "#3c4043",
    logo: (
      <svg width="18" height="18" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      </svg>
    ),
  },
  {
    id: "github", label: "Continue with GitHub",
    bg: "#24292e", border: "#24292e", color: "#fff",
    logo: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    ),
  },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");

  const validate = () => {
    const e = {};
    if (!form.email.match(/^\S+@\S+\.\S+$/)) e.email = "Enter a valid email";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    return e;
  };

  const handle = (f) => (e) => { setForm({ ...form, [f]: e.target.value }); setErrors({ ...errors, [f]: "" }); setApiError(""); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    setApiError("");
    try {
      const data = await api.login(form);
      login(data.user, data.token);
      navigate(data.user.role === "admin" ? "/admin" : "/");
    } catch (err) {
      setApiError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleSocial = async (provider) => {
    setSocialLoading(provider.id);
    try {
      const fakeUser = {
        name: provider.id === "google" ? "Google User" : "GitHub User",
        email: `${provider.id}user@example.com`,
        provider: provider.id,
        avatar: `https://ui-avatars.com/api/?name=${provider.id}+User&background=E8470A&color=fff`,
      };
      const data = await api.socialLogin(fakeUser);
      login(data.user, data.token);
      navigate("/");
    } catch {
      // Fallback: simulate login
      const fakeUser = { name: provider.id + " User", email: `${provider.id}@example.com`, role: "customer" };
      login(fakeUser, `${provider.id}-token`);
      navigate("/");
    } finally {
      setSocialLoading("");
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🏠</div>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-sub">Sign in to your LocalSeva account</p>
        </div>

        <div className="social-btns">
          {socialProviders.map(p => (
            <button key={p.id} className="social-btn"
              style={{ background: p.bg, borderColor: p.border, color: p.color }}
              onClick={() => handleSocial(p)} disabled={!!socialLoading}>
              {socialLoading === p.id ? <span>⏳</span> : p.logo}
              <span>{socialLoading === p.id ? "Signing in..." : p.label}</span>
            </button>
          ))}
        </div>

        <div className="auth-divider"><span>or sign in with email</span></div>

        {apiError && <div className="api-error">{apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="you@example.com" value={form.email} onChange={handle("email")} />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" value={form.password} onChange={handle("password")} />
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>
          <div style={{ textAlign: "right", marginBottom: "1rem" }}>
            <a href="#" style={{ fontSize: "0.82rem", color: "var(--primary)" }}>Forgot password?</a>
          </div>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Signing in..." : "Login →"}
          </button>
        </form>

        <div className="form-link">Don't have an account? <Link to="/register">Sign Up</Link></div>
        <div className="demo-hint">
          <strong>Demo:</strong> admin@localseva.in / admin123 &nbsp;|&nbsp; user@localseva.in / user123
        </div>
      </div>
    </section>
  );
}
