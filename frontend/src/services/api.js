/**
 * api.js — ALL fetch calls live here.
 * Never call fetch() directly from pages or components.
 */

const BASE = import.meta.env.VITE_API_BASE_URL || ''

// ── Helpers ───────────────────────────────────────────────────────────────────

function getToken() {
  try {
    const user = JSON.parse(localStorage.getItem('gc_user') || 'null')
    return user?.token || null
  } catch { return null }
}

async function request(method, path, body, auth = false) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (res.status === 204) return null          // No Content

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const message = data.message || `Request failed (${res.status})`
    throw Object.assign(new Error(message), { status: res.status, data })
  }

  return data
}

const get    = (path, auth)         => request('GET',    path, null, auth)
const post   = (path, body, auth)   => request('POST',   path, body, auth)
const put    = (path, body, auth)   => request('PUT',    path, body, auth)
const del    = (path, auth)         => request('DELETE', path, null, auth)

// ── Auth ──────────────────────────────────────────────────────────────────────

export const register = (data)  => post('/api/auth/register', data)
export const login    = (data)  => post('/api/auth/login', data)

// ── Products (public) ─────────────────────────────────────────────────────────

export function getProducts({ search = '', category = '', location = '' } = {}) {
  const params = new URLSearchParams()
  if (search)   params.set('search',   search)
  if (category) params.set('category', category)
  if (location) params.set('location', location)
  const qs = params.toString()
  return get(`/api/products${qs ? '?' + qs : ''}`)
}

export const getProductById = (id) => get(`/api/products/${id}`)

// ── Products (FARMER) ─────────────────────────────────────────────────────────

export const createProduct = (data) => post('/api/products', data, true)
export const updateProduct = (id, data) => put(`/api/products/${id}`, data, true)
export const deleteProduct = (id)   => del(`/api/products/${id}`, true)

// ── Orders (CUSTOMER) ─────────────────────────────────────────────────────────

export const createOrder  = (data) => post('/api/orders', data, true)
export const getMyOrders  = ()     => get('/api/orders', true)
export const getOrderById = (id)   => get(`/api/orders/${id}`, true)

// ── Farmer endpoints ──────────────────────────────────────────────────────────

export const getFarmerProducts  = () => get('/api/farmer/products',  true)
export const getFarmerOrders    = () => get('/api/farmer/orders',    true)
export const getFarmerDashboard = () => get('/api/farmer/dashboard', true)
