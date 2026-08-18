const CATEGORIES = ['VEGETABLES', 'FRUITS', 'GRAINS', 'EGGS', 'HONEY', 'DAIRY', 'HERBS']

const EMOJI = {
  VEGETABLES: '🥦', FRUITS: '🍎', GRAINS: '🌾',
  EGGS: '🥚', HONEY: '🍯', DAIRY: '🥛', HERBS: '🌿',
}

export default function CategoryFilter({ selected, onSelect }) {
  return (
    <div className="category-chips">
      <button
        className={`chip${!selected ? ' active' : ''}`}
        onClick={() => onSelect('')}
        id="category-all"
      >
        All
      </button>
      {CATEGORIES.map(cat => (
        <button
          key={cat}
          className={`chip${selected === cat ? ' active' : ''}`}
          onClick={() => onSelect(selected === cat ? '' : cat)}
          id={`category-${cat.toLowerCase()}`}
        >
          {EMOJI[cat]} {cat.charAt(0) + cat.slice(1).toLowerCase()}
        </button>
      ))}
    </div>
  )
}
