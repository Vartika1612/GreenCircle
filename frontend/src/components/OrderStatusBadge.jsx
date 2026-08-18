const STATUS_CONFIG = {
  PLACED:    { label: 'Placed',    className: 'badge badge-placed' },
  CONFIRMED: { label: 'Confirmed', className: 'badge badge-confirmed' },
  COMPLETED: { label: 'Completed', className: 'badge badge-completed' },
}

export default function OrderStatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { label: status, className: 'badge badge-gray' }
  return <span className={config.className}>{config.label}</span>
}
