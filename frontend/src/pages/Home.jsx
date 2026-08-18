import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../services/api'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'

const STEPS = [
  { n: 1, title: 'Farmers List Products', desc: 'Local organic farmers create listings with photos, prices, and farming methods.' },
  { n: 2, title: 'Customers Browse', desc: 'Search by category, location, or name. View full product details and farmer profiles.' },
  { n: 3, title: 'Order & Enjoy', desc: 'Add to cart, place your order, and enjoy fresh organic produce from your community.' },
]

export default function Home() {
  const [featured, setFeatured]   = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    getProducts()
      .then(data => setFeatured(data.slice(0, 4)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <span className="hero-tagline">🌱 100% Organic &amp; Local</span>
            <h1>From Farm to Your Table, Directly.</h1>
            <p>
              GreenCircle connects you with local organic farmers in your community.
              Browse seasonal produce, support sustainable agriculture, and eat fresh.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn-hero-primary" id="hero-shop-btn">
                Shop Fresh Produce
              </Link>
              <Link to="/register" className="btn-hero-outline" id="hero-farmer-btn">
                Sell Your Harvest
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────────────── */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-label">How It Works</span>
            <h2>Simple, Direct, Fresh</h2>
            <p>Three easy steps to get the freshest organic food straight from local farms.</p>
          </div>
          <div className="steps-grid">
            {STEPS.map(s => (
              <div key={s.n} className="step-card">
                <div className="step-number">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Featured This Season</span>
            <h2>Fresh from the Farm</h2>
            <p>Hand-picked organic products from our community farmers.</p>
          </div>
          {loading ? <LoadingSpinner /> : (
            <>
              <div className="product-grid">
                {featured.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
              <div style={{ textAlign: 'center', marginTop: 'var(--space-10)' }}>
                <Link to="/products" className="btn btn-outline btn-lg" id="view-all-btn">
                  View All Products →
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── CTA Section ─────────────────────────────────────────────────────── */}
      <section className="cta-section">
        <div className="container">
          <h2>Are You a Local Farmer?</h2>
          <p>
            Join GreenCircle and start selling your organic products directly to customers
            in your community. No middlemen. Keep more of what you earn.
          </p>
          <div className="cta-actions">
            <Link to="/register" className="btn-hero-primary" id="cta-farmer-btn">
              Start Selling Today
            </Link>
            <Link to="/products" className="btn-hero-outline" id="cta-browse-btn">
              Browse as Customer
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="footer">
        <div className="container">
          <p>🌿 GreenCircle — Connecting local organic farmers with their community.</p>
          <p style={{ marginTop: 'var(--space-2)', fontSize: '0.8125rem' }}>
            © {new Date().getFullYear()} GreenCircle. Built with ❤️ for local communities.
          </p>
        </div>
      </footer>
    </>
  )
}
