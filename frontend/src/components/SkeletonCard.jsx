export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image" />
      <div className="skeleton-body">
        <div className="skeleton-line skeleton-line-sm" />
        <div className="skeleton-line skeleton-line-md" />
        <div className="skeleton-line skeleton-line-xs" />
        <div className="skeleton-footer">
          <div className="skeleton-line skeleton-line-price" />
          <div className="skeleton-btn" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="product-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
