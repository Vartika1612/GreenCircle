import { useEffect, useState } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { getOrderById } from '../services/api'
import OrderStatusBadge from '../components/OrderStatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const STATUS_STEPS = ['PLACED', 'CONFIRMED', 'COMPLETED']
const STATUS_ICONS = { PLACED: '📋', CONFIRMED: '✅', COMPLETED: '🎉' }
const STATUS_LABELS = { PLACED: 'Order Placed', CONFIRMED: 'Confirmed', COMPLETED: 'Delivered' }

function OrderTimeline({ status }) {
  const currentIdx = STATUS_STEPS.indexOf(status)
  return (
    <div className="order-timeline">
      {STATUS_STEPS.map((step, idx) => (
        <div
          key={step}
          className={`timeline-step${idx <= currentIdx ? ' done' : ''}${idx === currentIdx ? ' current' : ''}`}
        >
          <div className="timeline-dot">
            <span>{STATUS_ICONS[step]}</span>
          </div>
          <div className="timeline-label">{STATUS_LABELS[step]}</div>
          {idx < STATUS_STEPS.length - 1 && (
            <div className={`timeline-line${idx < currentIdx ? ' done' : ''}`} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function OrderDetail() {
  const { id } = useParams()
  const location = useLocation()
  const justPlaced = location.state?.justPlaced

  const [order, setOrder]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    getOrderById(id)
      .then(setOrder)
      .catch(err => setError(err.message || 'Order not found'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="page container"><LoadingSpinner /></div>
  if (error)   return <div className="page container"><ErrorMessage message={error} /></div>
  if (!order)  return null

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '720px' }}>
        {justPlaced && (
          <div className="success-message" style={{ marginBottom: 'var(--space-6)', fontSize: '1rem' }}>
            🎉 <strong>Order Placed Successfully!</strong> Thank you for supporting local organic farming.
          </div>
        )}

        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-title">Order #{order.id}</h1>
            <p>
              Placed on {new Date(order.createdAt).toLocaleDateString(undefined, {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        {/* Order Timeline */}
        <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
          <h3 style={{ marginBottom: 'var(--space-6)' }}>Order Status</h3>
          <OrderTimeline status={order.status} />
        </div>

        {/* Items Card */}
        <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
          <h3 style={{ marginBottom: 'var(--space-4)' }}>Items Ordered</h3>

          {order.items?.map((item, idx) => (
            <div
              key={item.id || idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 'var(--space-3) 0',
                borderBottom: idx < order.items.length - 1 ? '1px solid var(--neutral-100)' : 'none'
              }}
            >
              <div>
                <div style={{ fontWeight: 600 }}>{item.productName || item.product?.name}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--neutral-500)' }}>
                  Quantity: {item.quantity} &nbsp;·&nbsp; ${parseFloat(item.unitPrice).toFixed(2)} each
                </div>
              </div>
              <div style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>
                ${(parseFloat(item.unitPrice) * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}

          <div style={{
            marginTop: 'var(--space-4)',
            paddingTop: 'var(--space-4)',
            borderTop: '2px solid var(--neutral-200)',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '1.125rem',
            fontWeight: 700
          }}>
            <span>Total</span>
            <span style={{ color: 'var(--primary-dark)' }}>
              ${parseFloat(order.totalPrice).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Customer details */}
        <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
          <h3 style={{ marginBottom: 'var(--space-3)' }}>Customer Information</h3>
          <p style={{ margin: 0, color: 'var(--neutral-700)' }}>
            <strong>Name:</strong> {order.customerName || order.customer?.name}
          </p>
        </div>

        <Link to="/orders" className="btn btn-outline">
          ← Back to All Orders
        </Link>
      </div>
    </div>
  )
}
