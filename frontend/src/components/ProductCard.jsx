import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const CATEGORY_EMOJI = {
  VEGETABLES: '🥦', FRUITS: '🍎', GRAINS: '🌾',
  EGGS: '🥚', HONEY: '🍯', DAIRY: '🥛', HERBS: '🌿',
}

export default function ProductCard({ product }) {
  const { isCustomer, addToCart } = useAuth()
  const toast = useToast()

  const stockStatus =
    product.stock === 0   ? 'out' :
    product.stock < 10    ? 'low' : 'ok'

  function handleAddToCart(e) {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
    toast?.addToast(`${product.name} added to cart!`, 'success')
  }

  return (
    <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
      <div className="product-card">
        {/* Image / emoji */}
        <div className="product-card-image">
          {product.imageKey ? (
            <img
              src={`${import.meta.env.VITE_S3_BASE_URL || ''}/${product.imageKey}`}
              alt={product.name}
              loading="lazy"
            />
          ) : (
            <div className="product-card-emoji">
              {CATEGORY_EMOJI[product.category] || '🌱'}
            </div>
          )}
          <div className="product-card-badges">
            {product.isOrganic !== false && (
              <span className="badge badge-organic">🌱 Organic</span>
            )}
            {stockStatus === 'low' && (
              <span className="badge badge-yellow" style={{ fontSize: '0.65rem' }}>Low Stock</span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="product-card-body">
          <div className="product-card-category">{product.category}</div>
          <div className="product-card-name">{product.name}</div>
          <div className="product-card-farmer">by {product.farmer?.name}</div>

          <div className="product-card-footer">
            <div>
              <span className="product-price">
                ${parseFloat(product.price).toFixed(2)}
              </span>
              <span className="product-price-unit"> / {product.unit}</span>
            </div>

            {stockStatus === 'out' ? (
              <span className="stock-indicator out">Out of stock</span>
            ) : isCustomer ? (
              <button
                className="btn btn-primary btn-sm"
                onClick={handleAddToCart}
                id={`add-to-cart-${product.id}`}
              >
                + Cart
              </button>
            ) : (
              <span className={`stock-indicator${stockStatus === 'low' ? ' low' : ''}`}>
                {product.stock} left
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
