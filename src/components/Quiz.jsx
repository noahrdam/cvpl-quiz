import { useState } from 'react'
import { isCorrect, difficultyMeta, categoryIcon } from '../quiz.js'

export default function Quiz({ quiz, questions, onFinish }) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [answers, setAnswers] = useState([])

  const question = questions[index]
  const isMulti = question.type === 'multi_select'
  const total = questions.length
  const correct = submitted && isCorrect(question, selected)
  const m = difficultyMeta(question.difficulty)

  function toggleOption(i) {
    if (submitted) return
    if (isMulti) {
      setSelected((s) =>
        s.includes(i) ? s.filter((x) => x !== i) : [...s, i],
      )
    } else {
      setSelected([i])
    }
  }

  function submit() {
    if (selected.length === 0) return
    setSubmitted(true)
  }

  function next() {
    const record = {
      question,
      selected,
      correct: isCorrect(question, selected),
    }
    const updated = [...answers, record]

    if (index + 1 >= total) {
      onFinish({ answers: updated })
      return
    }
    setAnswers(updated)
    setIndex(index + 1)
    setSelected([])
    setSubmitted(false)
  }

  const progress = Math.round((index / total) * 100)

  return (
    <div className="quiz">
      <div className="quiz-topbar">
        <div className="quiz-meta">
          <span className="pill">
            {categoryIcon(question.category)} {question.category}
          </span>
          <span className="pill pill-soft">
            {m.icon} {m.label}
          </span>
          {isMulti && <span className="pill pill-multi">Vælg flere</span>}
        </div>
        <span className="quiz-counter">
          Spørgsmål {index + 1} / {total}
        </span>
      </div>

      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <h2 className="question-text">{question.question}</h2>

      <div className="options">
        {question.options.map((opt, i) => {
          const isSelected = selected.includes(i)
          const isAnswer = question.correctAnswers.includes(i)
          let cls = 'option'
          if (submitted) {
            if (isAnswer) cls += ' option-correct'
            else if (isSelected) cls += ' option-wrong'
            else cls += ' option-dim'
          } else if (isSelected) {
            cls += ' option-selected'
          }
          return (
            <button
              key={i}
              className={cls}
              onClick={() => toggleOption(i)}
              disabled={submitted}
            >
              <span className="option-marker">
                {submitted && isAnswer
                  ? '✓'
                  : submitted && isSelected
                    ? '✕'
                    : isSelected
                      ? isMulti
                        ? '☑'
                        : '●'
                      : isMulti
                        ? '☐'
                        : '○'}
              </span>
              <span className="option-label">{opt}</span>
            </button>
          )
        })}
      </div>

      {submitted && (
        <div className={`feedback ${correct ? 'feedback-ok' : 'feedback-bad'}`}>
          <div className="feedback-head">
            {correct ? '✓ Rigtigt!' : '✕ Ikke helt'}
          </div>
          <p className="feedback-explanation">{question.explanation}</p>
        </div>
      )}

      <div className="quiz-actions">
        {!submitted ? (
          <button
            className="primary-btn"
            onClick={submit}
            disabled={selected.length === 0}
          >
            Tjek svar
          </button>
        ) : (
          <button className="primary-btn" onClick={next}>
            {index + 1 >= total ? 'Se resultat →' : 'Næste spørgsmål →'}
          </button>
        )}
      </div>
    </div>
  )
}
