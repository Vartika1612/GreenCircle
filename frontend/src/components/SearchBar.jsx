import { useState, useEffect } from 'react'

/**
 * Debounced search input.
 * Calls onChange after the user stops typing for `delay` ms.
 */
export default function SearchBar({ value, onChange, placeholder = 'Search products…', delay = 350 }) {
  const [local, setLocal] = useState(value)

  useEffect(() => { setLocal(value) }, [value])

  useEffect(() => {
    const timer = setTimeout(() => onChange(local), delay)
    return () => clearTimeout(timer)
  }, [local])   // intentionally omitting onChange / delay to avoid re-trigger

  return (
    <div className="search-bar">
      <span className="search-icon">🔍</span>
      <input
        type="search"
        id="product-search"
        placeholder={placeholder}
        value={local}
        onChange={e => setLocal(e.target.value)}
        autoComplete="off"
      />
    </div>
  )
}
