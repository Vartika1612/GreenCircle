import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getFarmerDashboard } from '../services/api'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

function RevenueBar({ label, value, max }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="revenue-bar-row">
      <span className="revenue-bar-label">{label}</span>
      <div className="revenue-bar-track">
        <div className="revenue-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="revenue-bar-value">${value.toFixed(2)}</span>
    </div>
  )
}

export default function FarmerDashboard() {
  const { user } = useAuth()
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    getFarmerDashboard()
      .then(setStats)
      .catch(err => setError(err.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="page container"><LoadingSpinner /></div>

  // Derived chart data — use mock breakdowns if not provided by API
  const revenueBreakdown = stats?.revenueByCategory || [
    { label: 'Vegetables', value: (stats?.totalRevenue ?? 0) * 0.45 },
    { label: 'Fruits',     value: (stats?.totalRevenue ?? 0) * 0.28 },
    { label: 'Dairy',      value: (stats?.totalRevenue ?? 0) * 0.15 },
    { label: 'Other',      value: (stats?.totalRevenue ?? 0) * 0.12 },
  ]
  const maxRev = Math.max(...revenueBreakdown.map(r => r.value), 1)

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="page-header dashboard-header">
          <div>
            <h1 className="page-title">
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p>Here's an overview of your farm's performance.</p>
          </div>
          <Link to="/farmer/products" className="btn btn-primary" id="dashboard-add-product-btn">
            + Manage Products
          </Link>
        </div>

        <ErrorMessage message={error} />

        {/* Key Metrics */}
        <div className="stats-grid">
          <div className="stat-card" style={{ borderLeftColor: 'var(--primary)' }}>
            <div className="stat-icon">🌱</div>
            <div className="stat-value">{stats?.totalProducts ?? 0}</div>
            <div className="stat-label">Active Products</div>
          </div>

          <div className="stat-card" style={{ borderLeftColor: '#2563eb' }}>
            <div className="stat-icon">📦</div>
            <div className="stat-value">{stats?.totalOrders ?? 0}</div>
            <div className="stat-label">Total Orders</div>
          </div>

          <div className="stat-card" style={{ borderLeftColor: '#d97706' }}>
            <div className="stat-icon">⏳</div>
            <div className="stat-value">{stats?.pendingOrders ?? 0}</div>
            <div className="stat-label">Pending Orders</div>
          </div>

          <div className="stat-card" style={{ borderLeftColor: 'var(--success)' }}>
            <div className="stat-icon">💰</div>
            <div className="stat-value">${(stats?.totalRevenue ?? 0).toFixed(2)}</div>
            <div className="stat-label">Total Revenue</div>
          </div>
        </div>

        {/* Revenue Chart + Quick Links */}
        <div className="dashboard-bottom">
          {/* Revenue Breakdown */}
          <div className="card dashboard-card">
            <div className="dashboard-card-header">
              <h3>📊 Revenue Breakdown</h3>
              <span className="dashboard-card-meta">By category</span>
            </div>
            <div className="revenue-chart">
              {revenueBreakdown.map(r => (
                <RevenueBar key={r.label} label={r.label} value={r.value} max={maxRev} />
              ))}
            </div>
            {stats?.totalRevenue === 0 && (
              <p style={{ fontSize: '0.875rem', color: 'var(--neutral-400)', textAlign: 'center', marginTop: 'var(--space-4)' }}>
                Revenue will appear here once you receive orders.
              </p>
            )}
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div className="card dashboard-card">
              <div className="dashboard-card-header">
                <h3>📦 Manage Orders</h3>
              </div>
              <p style={{ marginBottom: 'var(--space-4)', fontSize: '0.9375rem' }}>
                View customer orders containing your products and update their status.
              </p>
              <Link to="/farmer/orders" className="btn btn-outline btn-sm" id="dash-view-orders-btn">
                View Orders →
              </Link>
            </div>

            <div className="card dashboard-card">
              <div className="dashboard-card-header">
                <h3>🥦 Manage Inventory</h3>
              </div>
              <p style={{ marginBottom: 'var(--space-4)', fontSize: '0.9375rem' }}>
                Add new organic produce, update stock levels, or adjust prices.
              </p>
              <Link to="/farmer/products" className="btn btn-outline btn-sm" id="dash-view-products-btn">
                Manage Inventory →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
