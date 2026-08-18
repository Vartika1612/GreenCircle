import { useEffect, useState } from 'react'
import { getProducts } from '../services/api'
import ProductCard from '../components/ProductCard'
import SearchBar from '../components/SearchBar'
import CategoryFilter from '../components/CategoryFilter'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

export default function Products() {
  const [products, setProducts]   = useState([])
  const [search, setSearch]       = useState('')
  const [category, setCategory]   = useState('')
  const [location, setLocation]   = useState('')
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    getProducts({ search, category, location })
      .then(setProducts)
      .catch(err => setError(err.message || 'Failed to load products'))
      .finally(() => setLoading(false))
  }, [search, category, location])

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Organic Marketplace</h1>
          <p>Browse fresh produce directly from local organic farmers.</p>
        </div>

        {/* Filter controls */}
        <div className="filter-row">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search organic products or farms…"
          />
          <input
            type="text"
            className="form-input"
            style={{ width: '220px' }}
            placeholder="Filter by location (e.g. Napa)"
            value={location}
            onChange={e => setLocation(e.target.value)}
            id="location-filter"
          />
        </div>

        <div style={{ marginBottom: 'var(--space-8)' }}>
          <CategoryFilter selected={category} onSelect={setCategory} />
        </div>

        {/* Product list */}
        <ErrorMessage message={error} />

        {loading ? (
          <LoadingSpinner />
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🌱</div>
            <h3>No products found</h3>
            <p>Try clearing your filters or searching for something else.</p>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => { setSearch(''); setCategory(''); setLocation(''); }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
