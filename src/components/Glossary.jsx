import { useMemo, useState } from 'react'
import glossary from '../data/glossary.json'

const CATEGORY_ICON = {
  Hardware: '🖥️',
  Operativsystemer: '🪟',
  Virtualisering: '📦',
  Netværk: '🌐',
  'Protokoller & adressering': '🔌',
  'Kryptografi & hashing': '🔐',
  Sikkerhed: '🛡️',
  'Malware & angreb': '🦠',
  Servere: '🗄️',
}

function normalize(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip diacritics so "kob" matches "køb"
}

export default function Glossary() {
  const [query, setQuery] = useState('')
  const [activeCat, setActiveCat] = useState(null)

  const filtered = useMemo(() => {
    const q = normalize(query.trim())
    return glossary.terms.filter((t) => {
      if (activeCat && t.category !== activeCat) return false
      if (!q) return true
      const haystack = normalize(
        `${t.term} ${t.full ?? ''} ${t.definition}`,
      )
      return haystack.includes(q)
    })
  }, [query, activeCat])

  const sorted = useMemo(
    () =>
      [...filtered].sort((a, b) =>
        a.term.localeCompare(b.term, 'da', { sensitivity: 'base' }),
      ),
    [filtered],
  )

  return (
    <div className="glossary">
      <div className="glossary-intro">
        <h1>Ordbog</h1>
        <p>
          Slå forkortelser og begreber op fra hele pensum. Søg, eller filtrér på
          emne.
        </p>
      </div>

      <div className="glossary-search">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Søg efter begreb, forkortelse eller forklaring…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        {query && (
          <button
            className="search-clear"
            onClick={() => setQuery('')}
            aria-label="Ryd søgning"
          >
            ✕
          </button>
        )}
      </div>

      <div className="chip-row glossary-cats">
        <button
          className={`chip ${activeCat === null ? 'chip-on' : ''}`}
          onClick={() => setActiveCat(null)}
        >
          Alle
        </button>
        {glossary.categories.map((cat) => (
          <button
            key={cat}
            className={`chip ${activeCat === cat ? 'chip-on' : ''}`}
            onClick={() => setActiveCat(activeCat === cat ? null : cat)}
          >
            {CATEGORY_ICON[cat] ?? '•'} {cat}
          </button>
        ))}
      </div>

      <p className="glossary-count">
        {sorted.length} {sorted.length === 1 ? 'begreb' : 'begreber'}
      </p>

      {sorted.length === 0 ? (
        <p className="glossary-empty">
          Ingen begreber matcher din søgning. Prøv et andet ord.
        </p>
      ) : (
        <div className="glossary-list">
          {sorted.map((t) => (
            <article key={t.term} className="glossary-entry">
              <div className="glossary-entry-head">
                <h3 className="glossary-term">{t.term}</h3>
                <span className="glossary-cat-tag">
                  {CATEGORY_ICON[t.category] ?? '•'} {t.category}
                </span>
              </div>
              {t.full && <p className="glossary-full">{t.full}</p>}
              <p className="glossary-def">{t.definition}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
