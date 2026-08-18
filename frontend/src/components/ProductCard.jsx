import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const CATEGORY_EMOJI = {
  VEGETABLES: '🥦', FRUITS: '🍎', GRAINS: '🌾',
  EGGS: '🥚', HONEY: '🍯', DAIRY: '🥛', HERBS: '🌿',
}

export default function ProductCard({ product }) {
  const { isCustomer, addToCart } = useAuth()

  const stockStatus =
    product.stock === 0   ? 'out' :
    product.stock < 10    ? 'low' : 'ok'

  function handleAddToCart(e) {
    e.preventDefault()
    addToCart(product, 1)
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
            />
          ) : (
            <div className="product-card-emoji">
              {CATEGORY_EMOJI[product.category] || '🌱'}
            </div>
          )}
          <div className="product-card-badges">
            <span className="badge badge-organic">🌱 Organic</span>
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
                disabled={stockStatus === 'out'}
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
