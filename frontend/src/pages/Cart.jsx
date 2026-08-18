import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { createOrder } from '../services/api'
import CartItem from '../components/CartItem'
import ErrorMessage from '../components/ErrorMessage'

export default function Cart() {
  const { cart, cartTotal, clearCart, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  async function handleCheckout() {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    setError('')
    setLoading(true)

    try {
      const items = cart.map(i => ({
        productId: i.product.id,
        quantity:  i.quantity,
      }))
      const order = await createOrder({ items })
      clearCart()
      navigate(`/orders/${order.id}`, { state: { justPlaced: true } })
    } catch (err) {
      setError(err.message || 'Checkout failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="page container">
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Explore our organic marketplace and add fresh produce to your cart.</p>
          <Link to="/products" className="btn btn-primary" id="cart-empty-browse-btn">
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Your Cart</h1>
          <p>{cart.length} item{cart.length > 1 ? 's' : ''} from local farmers</p>
        </div>

        <ErrorMessage message={error} />

        <div className="cart-layout">
          {/* Cart items list */}
          <div>
            {cart.map(item => (
              <CartItem key={item.product.id} item={item} />
            ))}

            <div style={{ marginTop: 'var(--space-4)', display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn btn-ghost btn-sm" onClick={clearCart}>
                Clear Cart
              </button>
              <Link to="/products" className="btn btn-outline btn-sm">
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary sidebar */}
          <div className="order-summary">
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Order Summary</h3>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Estimated Delivery</span>
              <span style={{ color: 'var(--success)', fontWeight: 600 }}>FREE (Local)</span>
            </div>

            <div className="summary-row summary-total">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>

            <button
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: 'var(--space-6)' }}
              onClick={handleCheckout}
              disabled={loading}
              id="checkout-btn"
            >
              {loading ? 'Processing Order…' : 'Place Order'}
            </button>

            <p style={{
              fontSize: '0.75rem',
              color: 'var(--neutral-500)',
              textAlign: 'center',
              marginTop: 'var(--space-3)'
            }}>
              🔒 Fast &amp; direct payment to local farmers.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
