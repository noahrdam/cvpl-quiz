import { useMemo, useState } from 'react'
import {
  QUIZZES,
  QUIZ_GROUPS,
  categories,
  DIFFICULTIES,
  difficultyMeta,
  categoryIcon,
  questions,
  buildCustomQuiz,
} from '../quiz.js'

export default function Home({ onStart }) {
  return (
    <div className="home">
      <section className="hero">
        <h1>Test dig selv før optagelsesprøven</h1>
        <p>
          Vælg en færdig quiz nedenfor, eller byg din egen ud fra kategori og
          sværhedsgrad. Spørgsmålene blandes i tilfældig rækkefølge hver gang du
          starter.
        </p>
      </section>

      {QUIZ_GROUPS.map((group) => {
        const items = QUIZZES.filter((q) => q.group === group)
        if (items.length === 0) return null
        return (
          <section key={group} className="quiz-group">
            <h2 className="group-title">{group}</h2>
            <div className="card-grid">
              {items.map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} onStart={onStart} />
              ))}
            </div>
          </section>
        )
      })}

      <CustomBuilder onStart={onStart} />
    </div>
  )
}

function QuizCard({ quiz, onStart }) {
  return (
    <button className="quiz-card" onClick={() => onStart(quiz)}>
      <span className="quiz-card-icon">{quiz.icon}</span>
      <span className="quiz-card-body">
        <span className="quiz-card-title">{quiz.title}</span>
        <span className="quiz-card-subtitle">{quiz.subtitle}</span>
      </span>
      <span className="quiz-card-count">{quiz.count} spm</span>
    </button>
  )
}

function CustomBuilder({ onStart }) {
  const [cats, setCats] = useState([])
  const [diffs, setDiffs] = useState([])
  const [limit, setLimit] = useState(0) // 0 = alle

  const matchCount = useMemo(
    () =>
      questions.filter(
        (q) =>
          (cats.length === 0 || cats.includes(q.category)) &&
          (diffs.length === 0 || diffs.includes(q.difficulty)),
      ).length,
    [cats, diffs],
  )

  function toggle(list, setList, value) {
    setList(
      list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value],
    )
  }

  const effectiveCount = limit > 0 ? Math.min(limit, matchCount) : matchCount

  function start() {
    if (matchCount === 0) return
    onStart(buildCustomQuiz({ cats, diffs, limit }))
  }

  return (
    <section className="quiz-group custom-builder">
      <h2 className="group-title">Byg din egen quiz 🛠️</h2>
      <p className="builder-hint">
        Vælg kategorier og sværhedsgrader. Vælger du ingen, kommer alt med.
      </p>

      <div className="builder-block">
        <h3>Kategorier</h3>
        <div className="chip-row">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`chip ${cats.includes(cat) ? 'chip-on' : ''}`}
              onClick={() => toggle(cats, setCats, cat)}
            >
              {categoryIcon(cat)} {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="builder-block">
        <h3>Sværhedsgrad</h3>
        <div className="chip-row">
          {DIFFICULTIES.map((d) => {
            const m = difficultyMeta(d)
            return (
              <button
                key={d}
                className={`chip ${diffs.includes(d) ? 'chip-on' : ''}`}
                onClick={() => toggle(diffs, setDiffs, d)}
              >
                {m.icon} {m.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="builder-block">
        <h3>Antal spørgsmål</h3>
        <div className="chip-row">
          {[0, 5, 10, 20, 30].map((n) => (
            <button
              key={n}
              className={`chip ${limit === n ? 'chip-on' : ''}`}
              onClick={() => setLimit(n)}
            >
              {n === 0 ? 'Alle' : n}
            </button>
          ))}
        </div>
      </div>

      <div className="builder-footer">
        <span className="match-count">
          {matchCount === 0
            ? 'Ingen spørgsmål matcher'
            : `Starter med ${effectiveCount} spørgsmål`}
        </span>
        <button
          className="primary-btn"
          disabled={matchCount === 0}
          onClick={start}
        >
          Start quiz →
        </button>
      </div>
    </section>
  )
}
