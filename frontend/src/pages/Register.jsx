import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register as apiRegister } from '../services/api'
import { useAuth } from '../context/AuthContext'
import ErrorMessage from '../components/ErrorMessage'

export default function Register() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'CUSTOMER', location: ''
  })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    navigate('/', { replace: true })
    return null
  }

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    try {
      const data = await apiRegister(form)
      login(data)
      navigate(data.role === 'FARMER' ? '/farmer/dashboard' : '/products', { replace: true })
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: '480px' }}>
        <div className="auth-logo">🌿 GreenCircle</div>

        <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-6)', fontSize: '1.4rem' }}>
          Create your account
        </h2>

        <form className="auth-form" onSubmit={handleSubmit} id="register-form">
          <ErrorMessage message={error} />

          {/* Role selector */}
          <div className="form-group">
            <label className="form-label">I am a…</label>
            <div className="role-selector">
              {[
                { value: 'CUSTOMER', icon: '🛒', label: 'Customer' },
                { value: 'FARMER',   icon: '🚜', label: 'Farmer' },
              ].map(r => (
                <button
                  key={r.value}
                  type="button"
                  className={`role-btn${form.role === r.value ? ' selected' : ''}`}
                  onClick={() => setForm(f => ({ ...f, role: r.value }))}
                  id={`role-${r.value.toLowerCase()}`}
                >
                  <div className="role-btn-icon">{r.icon}</div>
                  <div className="role-btn-label">{r.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <input
              id="name" name="name" type="text"
              className="form-input" value={form.name}
              onChange={handleChange} placeholder="Your name" required autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email</label>
            <input
              id="reg-email" name="email" type="email"
              className="form-input" value={form.email}
              onChange={handleChange} placeholder="you@example.com" required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Password</label>
            <input
              id="reg-password" name="password" type="password"
              className="form-input" value={form.password}
              onChange={handleChange} placeholder="Min. 8 characters" required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="location">Location (optional)</label>
            <input
              id="location" name="location" type="text"
              className="form-input" value={form.location}
              onChange={handleChange}
              placeholder={form.role === 'FARMER' ? 'e.g. Napa Valley, CA' : 'e.g. San Francisco, CA'}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', marginTop: 'var(--space-2)' }}
            disabled={loading}
            id="register-submit-btn"
          >
            {loading ? 'Creating account…' : `Sign Up as ${form.role === 'FARMER' ? 'Farmer' : 'Customer'}`}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in →</Link>
        </p>
      </div>
    </div>
  )
}
