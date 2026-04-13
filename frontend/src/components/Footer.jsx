import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">Local<span>Seva</span></div>
            <p className="footer-desc">Connecting you with trusted local professionals for all your home service needs. Fast, reliable, and affordable.</p>
          </div>
          <div>
            <div className="footer-heading">Services</div>
            <ul className="footer-links">
              <li><Link to="/services">Plumbing</Link></li>
              <li><Link to="/services">Electrical</Link></li>
              <li><Link to="/services">Carpentry</Link></li>
              <li><Link to="/services">Painting</Link></li>
              <li><Link to="/services">Cleaning</Link></li>
            </ul>
          </div>
          <div>
            <div className="footer-heading">Company</div>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-heading">Support</div>
            <ul className="footer-links">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Use</a></li>
              <li><a href="#">Become a Pro</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 LocalSeva. All rights reserved.</span>
          <span>Made with ♥ for Marwadi University — AWT Project</span>
        </div>
      </div>
    </footer>
  );
}
