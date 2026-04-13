import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

const allCategories = ["All", "Plumbing", "Electrical", "Carpentry", "Painting", "Cleaning"];

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState(""); // separate input state
  const navigate = useNavigate();

  // Debounce: only update `search` 500ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (active !== "All") params.category = active;
      if (search.trim()) params.search = search.trim();
      const data = await api.getServices(params);
      setServices(data.data || []);
    } catch (err) {
      setError(err.message || "Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  }, [active, search]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return (
    <>
      <div className="page-header">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="breadcrumb"><a href="/">Home</a> / Services</div>
          <h1>All Services</h1>
          <p>Explore and book from our wide range of professional home services.</p>
        </div>
      </div>

      <section className="section">
        <div className="section-inner">
          <div className="filter-bar">
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input
                className="search-input"
                placeholder="Search services..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
              />
            </div>
            {allCategories.map(c => (
              <button
                key={c}
                className={`filter-btn ${active === c ? "active" : ""}`}
                onClick={() => setActive(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--text-muted)" }}>
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
              <p>Loading services from database...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: "4rem 0", color: "#A32D2D" }}>
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚠️</div>
              <p><strong>{error}</strong></p>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                1. Make sure MongoDB is running<br />
                2. Start backend: <code>cd backend &amp;&amp; npm run dev</code><br />
                3. Seed data: <code>node seed.js</code>
              </p>
              <button
                onClick={fetchServices}
                style={{ marginTop: "1rem", padding: "0.5rem 1.25rem", background: "var(--primary)", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}
              >
                Retry
              </button>
            </div>
          ) : services.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--text-muted)" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
              <h3>No services found</h3>
              <p>Try a different search or category.</p>
              <p style={{ fontSize: "0.83rem", marginTop: "0.5rem" }}>
                No data in DB? Run: <code>cd backend &amp;&amp; node seed.js</code>
              </p>
            </div>
          ) : (
            <div className="services-grid">
              {services.map(s => (
                <div className="service-card" key={s._id}>
                  <div className="sc-image-wrap">
                    {s.image
                      ? <img src={s.image} alt={s.title} className="sc-img" loading="lazy" />
                      : <div className="sc-img" style={{ background: s.bg || "#F5F5F5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem" }}>
                          {s.icon || "🔧"}
                        </div>
                    }
                    <span className="sc-badge">{s.category}</span>
                  </div>
                  <div className="sc-body">
                    <div className="sc-title">{s.title}</div>
                    <div className="sc-desc">{s.desc}</div>
                    {s.features?.length > 0 && (
                      <ul style={{ margin: "0.75rem 0", paddingLeft: "1.1rem" }}>
                        {s.features.map((f, i) => (
                          <li key={i} style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "2px" }}>{f}</li>
                        ))}
                      </ul>
                    )}
                    <div className="sc-footer">
                      <div className="sc-price">{s.price} <span>/ visit</span></div>
                      <div className="sc-rating">⭐ {s.rating} ({s.reviews} reviews)</div>
                    </div>
                    <button className="btn-book" onClick={() => navigate(`/book/${s._id}`)}>Book Now</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}