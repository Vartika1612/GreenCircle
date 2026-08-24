import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProductById } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const CATEGORY_EMOJI = {
  VEGETABLES: '🥦', FRUITS: '🍎', GRAINS: '🌾',
  EGGS: '🥚', HONEY: '🍯', DAIRY: '🥛', HERBS: '🌿',
}

export default function ProductDetail() {
  const { id } = useParams()
  const { isCustomer, addToCart } = useAuth()
  const toast = useToast()

  const [product, setProduct] = useState(null)
  const [qty, setQty]         = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [added, setAdded]     = useState(false)

  useEffect(() => {
    getProductById(id)
      .then(setProduct)
      .catch(err => setError(err.message || 'Product not found'))
      .finally(() => setLoading(false))
  }, [id])

  function handleAddToCart() {
    if (!product) return
    addToCart(product, qty)
    setAdded(true)
    toast?.addToast(`${qty} × ${product.name} added to cart!`, 'success')
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) return <div className="page"><LoadingSpinner /></div>
  if (error)   return <div className="page container"><ErrorMessage message={error} /></div>
  if (!product) return null

  return (
    <div className="page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/products">Products</Link>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span style={{ color: 'var(--neutral-800)' }}>{product.name}</span>
        </div>

        <div className="product-detail-layout">
          {/* Image */}
          <div className="product-detail-image">
            {product.imageKey ? (
              <img
                src={`${import.meta.env.VITE_S3_BASE_URL || ''}/${product.imageKey}`}
                alt={product.name}
              />
            ) : (
              <span>{CATEGORY_EMOJI[product.category] || '🌱'}</span>
            )}
          </div>

          {/* Details */}
          <div className="product-detail-info">
            <div>
              <span className="badge badge-green" style={{ marginBottom: 'var(--space-2)' }}>
                {product.category}
              </span>
              {product.isOrganic !== false && (
                <span className="badge badge-organic" style={{ marginLeft: 'var(--space-2)' }}>
                  🌱 Organic
                </span>
              )}
              <h1 style={{ marginTop: 'var(--space-2)' }}>{product.name}</h1>
              <p style={{ marginTop: 'var(--space-2)' }}>
                {product.description || 'Fresh, locally grown organic produce.'}
              </p>
            </div>

            <div className="product-detail-price">
              ${parseFloat(product.price).toFixed(2)}
              <span style={{ fontSize: '1rem', color: 'var(--neutral-500)', fontWeight: 400 }}>
                {' '}/ {product.unit}
              </span>
            </div>

            {/* Farmer info box */}
            <div className="product-meta">
              <div className="product-meta-row">
                <span className="product-meta-label">Grown by</span>
                <span className="product-meta-value">🧑‍🌾 {product.farmer?.name}</span>
              </div>
              {product.farmer?.location && (
                <div className="product-meta-row">
                  <span className="product-meta-label">Location</span>
                  <span className="product-meta-value">📍 {product.farmer.location}</span>
                </div>
              )}
              <div className="product-meta-row">
                <span className="product-meta-label">Stock available</span>
                <span className="product-meta-value" style={{ color: product.stock < 10 ? 'var(--warning)' : 'inherit' }}>
                  {product.stock > 0 ? `${product.stock} ${product.unit}s` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Actions */}
            {product.stock > 0 && isCustomer && (
              <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                <div className="quantity-control" style={{ padding: 'var(--space-2)' }}>
                  <button
                    className="qty-btn"
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >−</button>
                  <span className="qty-value" style={{ width: '36px' }}>{qty}</span>
                  <button
                    className="qty-btn"
                    onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                    aria-label="Increase quantity"
                  >+</button>
                </div>

                <button
                  className={`btn btn-lg${added ? ' btn-success' : ' btn-primary'}`}
                  onClick={handleAddToCart}
                  style={{ flex: 1 }}
                  id="add-to-cart-detail-btn"
                >
                  {added
                    ? '✓ Added to Cart!'
                    : `Add to Cart — $${(parseFloat(product.price) * qty).toFixed(2)}`}
                </button>
              </div>
            )}

            {product.stock === 0 && (
              <div className="error-message">This product is currently out of stock.</div>
            )}

            {!isCustomer && product.stock > 0 && (
              <div style={{ padding: 'var(--space-4)', background: 'var(--green-50)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                <p style={{ marginBottom: 'var(--space-3)', fontSize: '0.9375rem' }}>
                  Sign in as a Customer to add this product to your cart.
                </p>
                <Link to="/login" className="btn btn-primary btn-sm">Sign In →</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
