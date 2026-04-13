const team = [
  { name: "Arjun Mehta", role: "Founder & CEO", color: "#E8470A", initials: "AM" },
  { name: "Priya Shah", role: "Head of Operations", color: "#1A8A5A", initials: "PS" },
  { name: "Dev Patel", role: "Lead Developer", color: "#1A1A2E", initials: "DP" },
  { name: "Kavya Joshi", role: "Customer Success", color: "#7C3AED", initials: "KJ" },
];

export default function About() {
  return (
    <>
      <div className="page-header">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="breadcrumb">Home / About</div>
          <h1>About LocalSeva</h1>
          <p>Connecting Gujarat homes with trusted local professionals since 2024.</p>
        </div>
      </div>

      <section className="section">
        <div className="section-inner">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center", marginBottom: "4rem" }}>
            <div>
              <div className="section-tag">Our Mission</div>
              <h2 className="section-title">Making Home Services <span>Simple</span></h2>
              <p style={{ color: "var(--text-muted)", marginTop: "1rem", lineHeight: 1.8 }}>
                LocalSeva was born out of a simple idea: finding a reliable plumber, electrician, or carpenter shouldn't be a headache. We built a platform where homeowners across Gujarat can instantly connect with verified local professionals.
              </p>
              <p style={{ color: "var(--text-muted)", marginTop: "0.75rem", lineHeight: 1.8 }}>
                Every professional on our platform is background-verified, trained, and rated by real customers — so you always get the best service at a fair price.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {[
                { num: "5,000+", label: "Happy Customers", bg: "#FFF0EB" },
                { num: "200+", label: "Verified Pros", bg: "#F0FFF4" },
                { num: "4.9★", label: "Average Rating", bg: "#FFFBEA" },
                { num: "8", label: "Cities Covered", bg: "#F0F0FF" },
              ].map((s, i) => (
                <div key={i} style={{ background: s.bg, border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1.5rem", textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 800, color: "var(--text)" }}>{s.num}</div>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "4px" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="section-header">
            <div className="section-tag">Our Team</div>
            <h2 className="section-title">Meet the <span>People</span> Behind LocalSeva</h2>
          </div>
          <div className="team-grid">
            {team.map((m, i) => (
              <div className="team-card" key={i}>
                <div className="team-avatar" style={{ background: m.color }}>{m.initials}</div>
                <div className="team-name">{m.name}</div>
                <div className="team-role">{m.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
