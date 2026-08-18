import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as apiLogin } from '../services/api'
import { useAuth } from '../context/AuthContext'
import ErrorMessage from '../components/ErrorMessage'

export default function Login() {
  const { login, isAuthenticated, isFarmer } = useAuth()
  const navigate = useNavigate()

  const [form, setForm]     = useState({ email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  // If already logged in, redirect
  if (isAuthenticated) {
    navigate(isFarmer ? '/farmer/dashboard' : '/products', { replace: true })
    return null
  }

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await apiLogin(form)
      login(data)
      navigate(data.role === 'FARMER' ? '/farmer/dashboard' : '/products', { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span>🌿</span> GreenCircle
        </div>

        <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-6)', fontSize: '1.4rem' }}>
          Welcome back
        </h2>

        <form className="auth-form" onSubmit={handleSubmit} id="login-form">
          <ErrorMessage message={error} />

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 'var(--space-2)', padding: '0.75rem' }}
            disabled={loading}
            id="login-submit-btn"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register">Create one →</Link>
        </p>

        {/* Demo hint */}
        <div style={{
          marginTop: 'var(--space-6)',
          padding: 'var(--space-4)',
          background: 'var(--green-50)',
          borderRadius: 'var(--radius)',
          fontSize: '0.8125rem',
          color: 'var(--neutral-600)'
        }}>
          <strong>Demo credentials:</strong><br />
          Farmer: farmer@greencircle.com / password123<br />
          Customer: customer@greencircle.com / password123
        </div>
      </div>
    </div>
  )
}
