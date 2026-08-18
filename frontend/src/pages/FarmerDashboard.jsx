import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getFarmerDashboard } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

export default function FarmerDashboard() {
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

  return (
    <div className="page">
      <div className="container">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="page-title">Farmer Dashboard</h1>
            <p>Overview of your products, sales, and orders.</p>
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

        {/* Quick Links / Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <h3 style={{ marginBottom: 'var(--space-2)' }}>📦 Manage Orders</h3>
            <p style={{ marginBottom: 'var(--space-4)', fontSize: '0.9375rem' }}>
              View customer orders containing your products and update their status.
            </p>
            <Link to="/farmer/orders" className="btn btn-outline btn-sm" id="dash-view-orders-btn">
              View Orders →
            </Link>
          </div>

          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <h3 style={{ marginBottom: 'var(--space-2)' }}>🥦 Manage Inventory</h3>
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
  )
}
