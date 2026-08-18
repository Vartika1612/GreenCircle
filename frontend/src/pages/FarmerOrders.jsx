import { useEffect, useState } from 'react'
import { getFarmerOrders } from '../services/api'
import OrderStatusBadge from '../components/OrderStatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

export default function FarmerOrders() {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    getFarmerOrders()
      .then(setOrders)
      .catch(err => setError(err.message || 'Failed to load orders'))
      .finally(() => setLoading(false))
  }, [])

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
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
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
                          {item.quantity}x {item.productName}
                        </div>
                      ))}
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>
                      ${parseFloat(o.totalPrice).toFixed(2)}
                    </td>
                    <td><OrderStatusBadge status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
