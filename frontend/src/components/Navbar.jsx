import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { isAuthenticated, isCustomer, isFarmer, user, logout, cartCount } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-icon">🌿</div>
          GreenCircle
        </Link>

        {/* Nav links */}
        <div className="navbar-nav">
          <NavLink to="/products" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Browse
          </NavLink>

          {isCustomer && (
            <>
              <NavLink to="/orders" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                My Orders
              </NavLink>
              <Link to="/cart" className="cart-btn" id="cart-nav-btn" aria-label="Shopping cart">
                🛒
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </Link>
            </>
          )}

          {isFarmer && (
            <>
              <NavLink to="/farmer/products" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                My Products
              </NavLink>
              <NavLink to="/farmer/orders" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                Orders
              </NavLink>
              <NavLink to="/farmer/dashboard" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                Dashboard
              </NavLink>
            </>
          )}

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginLeft: 'var(--space-2)' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--neutral-500)' }}>
                Hi, {user.name.split(' ')[0]}
              </span>
              <button className="btn btn-outline btn-sm" onClick={handleLogout} id="logout-btn">
                Log out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginLeft: 'var(--space-2)' }}>
              <Link to="/login" className="btn btn-ghost btn-sm" id="nav-login-btn">Log in</Link>
              <Link to="/register" className="btn btn-primary btn-sm" id="nav-register-btn">Sign up</Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger — functional toggle could be added but kept simple */}
        <button className="navbar-mobile-menu" aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  )
}
