import { useAuth } from '../context/AuthContext'

const CATEGORY_EMOJI = {
  VEGETABLES: '🥦', FRUITS: '🍎', GRAINS: '🌾',
  EGGS: '🥚', HONEY: '🍯', DAIRY: '🥛', HERBS: '🌿',
}

export default function CartItem({ item }) {
  const { updateCartQuantity, removeFromCart } = useAuth()
  const { product, quantity } = item

  return (
    <div className="cart-item">
      <div className="cart-item-emoji">
        {CATEGORY_EMOJI[product.category] || '🌱'}
      </div>

      <div className="cart-item-info">
        <div className="cart-item-name">{product.name}</div>
        <div className="cart-item-price">
          ${parseFloat(product.price).toFixed(2)} / {product.unit}
          &nbsp;·&nbsp;by {product.farmer?.name}
        </div>
      </div>

      <div className="quantity-control">
        <button
          className="qty-btn"
          onClick={() => updateCartQuantity(product.id, quantity - 1)}
          aria-label="Decrease quantity"
        >−</button>
        <span className="qty-value">{quantity}</span>
        <button
          className="qty-btn"
          onClick={() => updateCartQuantity(product.id, Math.min(quantity + 1, product.stock))}
          aria-label="Increase quantity"
          disabled={quantity >= product.stock}
        >+</button>
      </div>

      <div className="cart-item-total">
        ${(parseFloat(product.price) * quantity).toFixed(2)}
      </div>

      <button
        className="btn btn-ghost btn-sm"
        onClick={() => removeFromCart(product.id)}
        aria-label="Remove item"
        style={{ color: 'var(--danger)', marginLeft: 'var(--space-2)' }}
      >✕</button>
    </div>
  )
}
