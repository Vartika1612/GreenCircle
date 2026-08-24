import { useEffect, useState } from 'react'
import { getFarmerOrders, updateOrderStatus } from '../services/api'
import OrderStatusBadge from '../components/OrderStatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { useToast } from '../context/ToastContext'

const NEXT_STATUS = {
  PLACED:    { label: 'Confirm Order', next: 'CONFIRMED', className: 'btn-outline btn-sm' },
  CONFIRMED: { label: 'Mark Completed', next: 'COMPLETED', className: 'btn-primary btn-sm' },
}

export default function FarmerOrders() {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [updating, setUpdating] = useState(null)
  const toast = useToast()

  useEffect(() => {
    getFarmerOrders()
      .then(setOrders)
      .catch(err => setError(err.message || 'Failed to load orders'))
      .finally(() => setLoading(false))
  }, [])

  async function handleStatusUpdate(orderId, nextStatus) {
    setUpdating(orderId)
    try {
      const updated = await updateOrderStatus(orderId, nextStatus)
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus, ...updated } : o))
      toast?.addToast(`Order #${orderId} updated to ${nextStatus}`, 'success')
    } catch (err) {
      toast?.addToast(err.message || 'Failed to update order', 'error')
    } finally {
      setUpdating(null)
    }
  }

  if (loading) return <div className="page container"><LoadingSpinner /></div>

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Customer Orders</h1>
          <p>Orders containing your organic farm produce.</p>
        </div>

        <ErrorMessage message={error} />

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>No orders received yet</h3>
            <p>When customers order your products, their orders will appear here.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => {
                  const next = NEXT_STATUS[o.status]
                  return (
                    <tr key={o.id}>
                      <td style={{ fontWeight: 600 }}>#{o.id}</td>
                      <td>{o.customerName || 'Customer'}</td>
                      <td>
                        {new Date(o.createdAt).toLocaleDateString(undefined, {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </td>
                      <td>
                        {o.items?.map((item, idx) => (
                          <div key={idx} style={{ fontSize: '0.875rem' }}>
                            {item.quantity}× {item.productName}
                          </div>
                        ))}
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>
                        ${parseFloat(o.totalPrice).toFixed(2)}
                      </td>
                      <td><OrderStatusBadge status={o.status} /></td>
                      <td>
                        {next ? (
                          <button
                            className={`btn ${next.className}`}
                            onClick={() => handleStatusUpdate(o.id, next.next)}
                            disabled={updating === o.id}
                          >
                            {updating === o.id ? '…' : next.label}
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.8125rem', color: 'var(--neutral-400)' }}>—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
