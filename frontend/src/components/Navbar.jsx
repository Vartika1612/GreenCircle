import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { isAuthenticated, isCustomer, isFarmer, user, logout, cartCount } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  // Shadow on scroll
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  function handleLogout() {
    logout()
    navigate('/')
  }

  const navLinkClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`

  return (
    <>
      <nav className={`navbar${scrolled ? ' navbar-scrolled' : ''}`}>
        <div className="container navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <div className="navbar-logo-icon">🌿</div>
            GreenCircle
          </Link>

          {/* Desktop Nav links */}
          <div className="navbar-nav">
            <NavLink to="/products" className={navLinkClass}>Browse</NavLink>

            {isCustomer && (
              <>
                <NavLink to="/orders" className={navLinkClass}>My Orders</NavLink>
                <Link to="/cart" className="cart-btn" id="cart-nav-btn" aria-label="Shopping cart">
                  🛒
                  {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                </Link>
              </>
            )}

            {isFarmer && (
              <>
                <NavLink to="/farmer/products" className={navLinkClass}>My Products</NavLink>
                <NavLink to="/farmer/orders" className={navLinkClass}>Orders</NavLink>
                <NavLink to="/farmer/dashboard" className={navLinkClass}>Dashboard</NavLink>
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

          {/* Mobile: cart icon + hamburger */}
          <div className="navbar-mobile-right">
            {isCustomer && (
              <Link to="/cart" className="cart-btn" aria-label="Cart">
                🛒
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </Link>
            )}
            <button
              className={`navbar-mobile-menu${menuOpen ? ' open' : ''}`}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(o => !o)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      {menuOpen && (
        <div className="mobile-overlay" onClick={() => setMenuOpen(false)} aria-hidden="true" />
      )}

      {/* Mobile drawer */}
      <div className={`mobile-drawer${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
        <div className="mobile-drawer-header">
          <div className="navbar-logo">
            <div className="navbar-logo-icon">🌿</div>
            GreenCircle
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="mobile-nav">
          <NavLink to="/products" className={navLinkClass}>🌱 Browse Products</NavLink>

          {isCustomer && (
            <>
              <NavLink to="/orders" className={navLinkClass}>📦 My Orders</NavLink>
              <NavLink to="/cart" className={navLinkClass}>🛒 My Cart {cartCount > 0 && `(${cartCount})`}</NavLink>
            </>
          )}

          {isFarmer && (
            <>
              <NavLink to="/farmer/products" className={navLinkClass}>🥦 My Products</NavLink>
              <NavLink to="/farmer/orders" className={navLinkClass}>📋 Orders</NavLink>
              <NavLink to="/farmer/dashboard" className={navLinkClass}>📊 Dashboard</NavLink>
            </>
          )}
        </nav>

        <div className="mobile-drawer-footer">
          {isAuthenticated ? (
            <div>
              <p className="mobile-user-info">Signed in as <strong>{user.name}</strong></p>
              <button className="btn btn-outline" style={{ width: '100%' }} onClick={handleLogout}>
                Log out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <Link to="/login" className="btn btn-outline" style={{ textAlign: 'center' }}>Log in</Link>
              <Link to="/register" className="btn btn-primary" style={{ textAlign: 'center' }}>Sign up free</Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
