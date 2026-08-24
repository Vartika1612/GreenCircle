import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../services/api'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'

const STEPS = [
  { n: 1, icon: '🚜', title: 'Farmers List Products', desc: 'Local organic farmers create listings with photos, prices, and farming methods.' },
  { n: 2, icon: '🔍', title: 'Customers Browse', desc: 'Search by category, location, or name. View full product details and farmer profiles.' },
  { n: 3, icon: '🌿', title: 'Order & Enjoy', desc: 'Add to cart, place your order, and enjoy fresh organic produce from your community.' },
]

const STATS = [
  { value: '150+', label: 'Local Farmers', icon: '🚜' },
  { value: '2,000+', label: 'Products', icon: '🥦' },
  { value: '10,000+', label: 'Happy Customers', icon: '😊' },
  { value: '100%', label: 'Organic', icon: '🌱' },
]

const TESTIMONIALS = [
  { name: 'Sarah M.', location: 'Portland, OR', text: 'GreenCircle changed how I shop. The tomatoes from Sunrise Farm are incredible — so much better than anything from a grocery store!', emoji: '🍅' },
  { name: 'James K.', location: 'Napa Valley, CA', text: 'As a farmer, I now sell directly to customers in my community. My revenue doubled in the first three months!', emoji: '🚜' },
  { name: 'Priya L.', location: 'Austin, TX', text: 'I love knowing exactly where my food comes from. GreenCircle makes it so easy to support local farms.', emoji: '🥗' },
]

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    getProducts()
      .then(data => setFeatured(data.slice(0, 4)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="hero">
        {/* Floating decorative elements */}
        <div className="hero-floats" aria-hidden="true">
          <span className="hero-float hero-float-1">🌿</span>
          <span className="hero-float hero-float-2">🍅</span>
          <span className="hero-float hero-float-3">🥦</span>
          <span className="hero-float hero-float-4">🌾</span>
          <span className="hero-float hero-float-5">🍎</span>
        </div>

        <div className="container">
          <div className="hero-content">
            <span className="hero-tagline">🌱 100% Organic &amp; Local</span>
            <h1>From Farm to Your<br />Table, Directly.</h1>
            <p>
              GreenCircle connects you with local organic farmers in your community.
              Browse seasonal produce, support sustainable agriculture, and eat fresh.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn-hero-primary" id="hero-shop-btn">
                Shop Fresh Produce →
              </Link>
              <Link to="/register" className="btn-hero-outline" id="hero-farmer-btn">
                Sell Your Harvest
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ────────────────────────────────────────────────────────── */}
      <section className="stats-bar">
        <div className="container">
          <div className="stats-bar-grid">
            {STATS.map(s => (
              <div key={s.label} className="stats-bar-item">
                <span className="stats-bar-icon">{s.icon}</span>
                <span className="stats-bar-value">{s.value}</span>
                <span className="stats-bar-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────────── */}
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
                <div className="step-icon-wrap">
                  <span className="step-icon">{s.icon}</span>
                  <div className="step-number">{s.n}</div>
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────────────────────── */}
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
                {featured.length > 0
                  ? featured.map(p => <ProductCard key={p.id} product={p} />)
                  : (
                    <div className="empty-state" style={{ gridColumn: '1/-1' }}>
                      <div className="empty-state-icon">🌱</div>
                      <h3>Products coming soon</h3>
                      <p>Our farmers are preparing their listings. Check back shortly!</p>
                    </div>
                  )}
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

      {/* ── Testimonials ─────────────────────────────────────────────────────── */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Community Love</span>
            <h2>What Our Community Says</h2>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="testimonial-card">
                <div className="testimonial-emoji">{t.emoji}</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <strong>{t.name}</strong>
                  <span>{t.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ──────────────────────────────────────────────────────── */}
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
    </>
  )
}
