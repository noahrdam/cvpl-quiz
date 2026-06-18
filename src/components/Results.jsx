import { useState } from 'react'
import { categoryIcon, difficultyMeta } from '../quiz.js'

export default function Results({ quiz, results, onRestart, onHome }) {
  const [showReview, setShowReview] = useState(false)
  const { answers } = results
  const total = answers.length
  const score = answers.filter((a) => a.correct).length
  const pct = total === 0 ? 0 : Math.round((score / total) * 100)

  const grade = gradeFor(pct)

  return (
    <div className="results">
      <div className="score-card">
        <div className="score-emoji">{grade.emoji}</div>
        <div className="score-ring" style={ringStyle(pct, grade.color)}>
          <div className="score-ring-inner">
            <span className="score-pct">{pct}%</span>
            <span className="score-frac">
              {score} / {total}
            </span>
          </div>
        </div>
        <h2 className="score-headline">{grade.headline}</h2>
        <p className="score-sub">{grade.sub}</p>
        {quiz?.title && (
          <p className="score-quizname">
            {quiz.icon} {quiz.title}
          </p>
        )}
      </div>

      <div className="results-actions">
        <button className="primary-btn" onClick={onRestart}>
          ↻ Prøv igen
        </button>
        <button className="ghost-btn" onClick={() => setShowReview((s) => !s)}>
          {showReview ? 'Skjul gennemgang' : 'Gennemgå svar'}
        </button>
        <button className="ghost-btn" onClick={onHome}>
          ← Til forsiden
        </button>
      </div>

      {showReview && (
        <div className="review">
          {answers.map((a, i) => (
            <ReviewItem key={i} index={i} answer={a} />
          ))}
        </div>
      )}
    </div>
  )
}

function ReviewItem({ index, answer }) {
  const { question, selected, correct } = answer
  const m = difficultyMeta(question.difficulty)
  return (
    <div className={`review-item ${correct ? 'review-ok' : 'review-bad'}`}>
      <div className="review-head">
        <span className="review-num">{index + 1}</span>
        <span className="review-status">{correct ? '✓' : '✕'}</span>
        <span className="pill pill-soft">
          {categoryIcon(question.category)} {question.category}
        </span>
        <span className="pill pill-soft">
          {m.icon} {m.label}
        </span>
      </div>
      <p className="review-question">{question.question}</p>
      <ul className="review-options">
        {question.options.map((opt, i) => {
          const isAnswer = question.correctAnswers.includes(i)
          const isPicked = selected.includes(i)
          let cls = 'review-opt'
          if (isAnswer) cls += ' review-opt-correct'
          else if (isPicked) cls += ' review-opt-wrong'
          return (
            <li key={i} className={cls}>
              <span className="review-opt-mark">
                {isAnswer ? '✓' : isPicked ? '✕' : ''}
              </span>
              {opt}
            </li>
          )
        })}
      </ul>
      <p className="review-explanation">{question.explanation}</p>
    </div>
  )
}

function gradeFor(pct) {
  if (pct >= 90)
    return {
      emoji: '🏆',
      color: '#22c55e',
      headline: 'Fremragende!',
      sub: 'Du er rigtig godt forberedt.',
    }
  if (pct >= 75)
    return {
      emoji: '🎉',
      color: '#4ade80',
      headline: 'Flot klaret!',
      sub: 'Du har styr på det meste.',
    }
  if (pct >= 50)
    return {
      emoji: '💪',
      color: '#facc15',
      headline: 'Godt på vej',
      sub: 'Lidt mere træning, så sidder det.',
    }
  if (pct >= 25)
    return {
      emoji: '📚',
      color: '#fb923c',
      headline: 'Bliv ved med at øve',
      sub: 'Gennemgå svarene og prøv igen.',
    }
  return {
    emoji: '🌱',
    color: '#f87171',
    headline: 'Frisk start',
    sub: 'Alle starter et sted - kør den igen!',
  }
}

function ringStyle(pct, color) {
  return {
    background: `conic-gradient(${color} ${pct * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
  }
}
