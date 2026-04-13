import { Link, useNavigate } from "react-router-dom";
import { services, categories, testimonials } from "../data/services";

function ServiceCard({ s }) {
  const navigate = useNavigate();
  return (
    <div className="service-card">
      <div className="sc-image-wrap">
        <img src={s.image} alt={s.title} className="sc-img" loading="lazy" />
        <span className="sc-badge">{s.category}</span>
      </div>
      <div className="sc-body">
        <div className="sc-title">{s.title}</div>
        <div className="sc-desc">{s.desc}</div>
        <div className="sc-footer">
          <div className="sc-price">{s.price} <span>/ visit</span></div>
          <div className="sc-rating">⭐ {s.rating} ({s.reviews})</div>
        </div>
        <button className="btn-book" onClick={() => navigate(`/book/${s.id}`)}>Book Now</button>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* ── HERO BANNER ── */}
      <section className="hero">
        <div className="hero-bg-img" />
        <div className="hero-overlay" />
        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-badge">🏆 #1 Home Services in Gujarat</div>
            <h1>Your Home Deserves <em>Expert</em> Care</h1>
            <p>Book verified plumbers, electricians, carpenters, and more — right at your doorstep. Fast, affordable, and reliable.</p>
            <div className="hero-actions">
              <Link to="/services">
                <button className="btn-hero btn-hero-primary">Explore Services</button>
              </Link>
              <Link to="/register">
                <button className="btn-hero btn-hero-outline">Join as Pro</button>
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat-item"><div className="stat-num">5K+</div><div className="stat-label">Happy Customers</div></div>
              <div className="stat-item"><div className="stat-num">200+</div><div className="stat-label">Verified Pros</div></div>
              <div className="stat-item"><div className="stat-num">4.9★</div><div className="stat-label">Avg Rating</div></div>
            </div>
          </div>
          <div className="hero-cards-grid">
            {services.slice(0, 3).map(s => (
              <div className="hero-service-card" key={s.id} onClick={() => {}}>
                <img src={s.image} alt={s.title} />
                <div className="hsc-info">
                  <span className="hsc-icon">{s.icon}</span>
                  <div>
                    <div className="hsc-title">{s.title}</div>
                    <div className="hsc-price">{s.price} / visit</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">Browse Categories</div>
            <h2 className="section-title">What Service Do You <span>Need?</span></h2>
            <p className="section-sub">From plumbing to painting, we have experts for every home need.</p>
          </div>
          <div className="cats-grid">
            {categories.map((c, i) => (
              <Link to="/services" key={i}>
                <div className="cat-chip">
                  <span className="cat-icon">{c.icon}</span>
                  <span className="cat-label">{c.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how-section">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag" style={{ background: "rgba(232,71,10,0.15)", color: "#F7C948" }}>Simple Process</div>
            <h2 className="section-title" style={{ color: "white" }}>How <span>LocalSeva</span> Works</h2>
            <p className="section-sub" style={{ color: "rgba(255,255,255,0.5)" }}>Get a professional at your door in 4 easy steps</p>
          </div>
          <div className="steps-grid">
            {[
              { n: "01", t: "Choose a Service", d: "Browse our wide range of home services and pick what you need." },
              { n: "02", t: "Book a Slot", d: "Select a convenient date and time for the visit." },
              { n: "03", t: "Expert Arrives", d: "A verified professional arrives at your home on time." },
              { n: "04", t: "Pay & Rate", d: "Pay securely and rate your experience to help others." },
            ].map((s, i) => (
              <div className="step-card" key={i}>
                <div className="step-num">{s.n}</div>
                <div className="step-title">{s.t}</div>
                <div className="step-desc">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR SERVICES with IMAGES ── */}
      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">Top Rated</div>
            <h2 className="section-title">Popular <span>Services</span></h2>
            <p className="section-sub">Trusted by thousands of homeowners across Gujarat.</p>
          </div>
          <div className="services-grid">
            {services.slice(0, 4).map(s => <ServiceCard key={s.id} s={s} />)}
          </div>
          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <Link to="/services">
              <button className="btn-primary" style={{ padding: "0.75rem 2.5rem", fontSize: "0.95rem" }}>
                View All Services →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section" style={{ background: "#F2F0ED" }}>
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">Reviews</div>
            <h2 className="section-title">What Our <span>Customers Say</span></h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div className="testimonial-card" key={i}>
                <div className="t-stars">{"★".repeat(t.stars)}</div>
                <p className="t-text">"{t.text}"</p>
                <div className="t-user">
                  <div className="t-avatar" style={{ background: t.color }}>
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="t-name">{t.name}</div>
                    <div className="t-city">{t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
