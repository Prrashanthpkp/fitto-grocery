import "./Footer.css";
import logo from "../assests/grocery.png";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">

        {/* TOP ROW */}
        <div className="footer-top">

          {/* LEFT — LOGO + TAGLINE */}
          <div className="footer-logo">
            <div className="footer-logo-row">
              <img src={logo} alt="logo" />
              <span>Fitto Grocery</span>
            </div>
            <p className="footer-tagline">
              Fresh ingredients for a healthier, fitter you — delivered to your door.
            </p>
          </div>

          {/* MIDDLE — NUTRITION TIP */}
          <div className="footer-middle">
            <h4>🥦 Daily Nutrition Tip</h4>
            <p>Eating a rainbow of vegetables ensures you get a wide variety of nutrients your body needs every day.</p>
            <div className="footer-badges">
              <span>🌿 Organic</span>
              <span>🚚 Fast Delivery</span>
              <span>💪 Fitness First</span>
            </div>
          </div>

          {/* RIGHT — LINKS */}
          <div className="footer-links-section">
            <div className="footer-links-group">
              <h4>Company</h4>
              <ul>
                <li>About Us</li>
                <li>Careers</li>
                <li>Blog</li>
              </ul>
            </div>
            <div className="footer-links-group">
              <h4>Support</h4>
              <ul>
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Returns</li>
              </ul>
            </div>
            <div className="footer-links-group">
              <h4>Legal</h4>
              <ul>
                <li>Privacy Policy</li>
                <li>Terms of Use</li>
                <li>Refund Policy</li>
              </ul>
            </div>
          </div>

        </div>

        {/* DIVIDER */}
        <div className="footer-divider" />

        {/* BOTTOM ROW */}
        <div className="footer-bottom">
          <p>© 2025 Fitto Grocery. All rights reserved.</p>
          <span className="footer-badge">🌿 100% Fresh & Organic</span>
        </div>

      </div>
    </footer>
  );
}

export default Footer;