import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="footer-logo-icon">🌿</span>
              GreenCircle
            </div>
            <p className="footer-tagline">
              Connecting local organic farmers with their community since 2024.
            </p>
            <div className="footer-social">
              <a href="#" aria-label="Twitter" className="social-link">𝕏</a>
              <a href="#" aria-label="Instagram" className="social-link">📸</a>
              <a href="#" aria-label="Facebook" className="social-link">f</a>
            </div>
          </div>

          {/* Shop */}
          <div className="footer-col">
            <h4 className="footer-heading">Marketplace</h4>
            <ul className="footer-links">
              <li><Link to="/products">Browse Products</Link></li>
              <li><Link to="/products?category=VEGETABLES">Vegetables</Link></li>
              <li><Link to="/products?category=FRUITS">Fruits</Link></li>
              <li><Link to="/products?category=DAIRY">Dairy & Eggs</Link></li>
            </ul>
          </div>

          {/* Farmers */}
          <div className="footer-col">
            <h4 className="footer-heading">For Farmers</h4>
            <ul className="footer-links">
              <li><Link to="/register">Sell Your Harvest</Link></li>
              <li><Link to="/farmer/dashboard">Dashboard</Link></li>
              <li><Link to="/farmer/products">Manage Products</Link></li>
              <li><Link to="/farmer/orders">View Orders</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div className="footer-col">
            <h4 className="footer-heading">Account</h4>
            <ul className="footer-links">
              <li><Link to="/login">Sign In</Link></li>
              <li><Link to="/register">Create Account</Link></li>
              <li><Link to="/orders">My Orders</Link></li>
              <li><Link to="/cart">My Cart</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} GreenCircle. Built with ❤️ for local communities.</p>
          <p className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <span>·</span>
            <a href="#">Terms of Service</a>
            <span>·</span>
            <a href="#">Contact Us</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
