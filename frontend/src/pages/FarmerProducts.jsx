import { useEffect, useState } from 'react'
import { getFarmerProducts, createProduct, updateProduct, deleteProduct } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const CATEGORIES = ['VEGETABLES', 'FRUITS', 'GRAINS', 'EGGS', 'HONEY', 'DAIRY', 'HERBS']
const UNITS = ['lb', 'kg', 'oz', 'dozen', 'bunch', 'jar', 'bottle', 'pack']

const EMPTY_FORM = {
  name: '', description: '', category: 'VEGETABLES',
  price: '', unit: 'lb', stock: '', isOrganic: true, imageKey: ''
}

export default function FarmerProducts() {
  const [products, setProducts]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm]           = useState(EMPTY_FORM)
  const [saving, setSaving]       = useState(false)

  function loadProducts() {
    setLoading(true)
    getFarmerProducts()
      .then(setProducts)
      .catch(err => setError(err.message || 'Failed to load products'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadProducts() }, [])

  function openCreate() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setShowModal(true)
  }

  function openEdit(p) {
    setEditingId(p.id)
    setForm({
      name: p.name,
      description: p.description || '',
      category: p.category,
      price: p.price,
      unit: p.unit,
      stock: p.stock,
      isOrganic: p.isOrganic ?? true,
      imageKey: p.imageKey || ''
    })
    setShowModal(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const payload = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10),
    }

    try {
      if (editingId) {
        await updateProduct(editingId, payload)
      } else {
        await createProduct(payload)
      }
      setShowModal(false)
      loadProducts()
    } catch (err) {
      setError(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      await deleteProduct(id)
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      setError(err.message || 'Delete failed')
    }
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="page-title">My Products</h1>
            <p>Add and manage your organic farm listings.</p>
          </div>
          <button className="btn btn-primary" onClick={openCreate} id="add-product-btn">
            + Add Product
          </button>
        </div>

        <ErrorMessage message={error} />

        {loading ? <LoadingSpinner /> : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🚜</div>
            <h3>No products listed yet</h3>
            <p>Start listing your organic produce so local customers can order!</p>
            <button className="btn btn-primary" onClick={openCreate}>+ Add Your First Product</button>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--neutral-500)' }}>
                        {p.description ? p.description.slice(0, 50) + '…' : 'No description'}
                      </div>
                    </td>
                    <td><span className="badge badge-green">{p.category}</span></td>
                    <td style={{ fontWeight: 600 }}>${parseFloat(p.price).toFixed(2)} / {p.unit}</td>
                    <td>
                      <span className={`stock-indicator${p.stock === 0 ? ' out' : p.stock < 10 ? ' low' : ''}`}>
                        {p.stock} {p.unit}s
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}>
                          Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal Form */}
        {showModal && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: 'var(--space-4)'
          }}>
            <div className="card" style={{ width: '100%', maxWidth: '520px', padding: 'var(--space-6)', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>✕</button>
              </div>

              <form onSubmit={handleSubmit} id="product-form" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="p-name">Product Name</label>
                  <input
                    id="p-name" type="text" className="form-input" required
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Heirloom Organic Tomatoes"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="p-category">Category</label>
                    <select
                      id="p-category" className="form-select" value={form.category}
                      onChange={e => setForm({ ...form, category: e.target.value })}
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="p-unit">Unit</label>
                    <select
                      id="p-unit" className="form-select" value={form.unit}
                      onChange={e => setForm({ ...form, unit: e.target.value })}
                    >
                      {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="p-price">Price ($)</label>
                    <input
                      id="p-price" type="number" step="0.01" min="0.01" className="form-input" required
                      value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                      placeholder="4.99"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="p-stock">Stock Quantity</label>
                    <input
                      id="p-stock" type="number" min="0" className="form-input" required
                      value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })}
                      placeholder="50"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="p-desc">Description</label>
                  <textarea
                    id="p-desc" className="form-textarea" rows="3"
                    value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe how it was grown, harvest date, tasting notes…"
                  />
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving} id="save-product-btn">
                    {saving ? 'Saving…' : editingId ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
