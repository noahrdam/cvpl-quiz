import { useState } from 'react'
import Home from './components/Home.jsx'
import Quiz from './components/Quiz.jsx'
import Results from './components/Results.jsx'
import { getQuizQuestions } from './quiz.js'

export default function App() {
  const [view, setView] = useState('home') // 'home' | 'quiz' | 'results'
  const [activeQuiz, setActiveQuiz] = useState(null)
  const [quizQuestions, setQuizQuestions] = useState([])
  const [results, setResults] = useState(null)

  function startQuiz(quiz) {
    const qs = getQuizQuestions(quiz)
    if (qs.length === 0) return
    setActiveQuiz(quiz)
    setQuizQuestions(qs)
    setResults(null)
    setView('quiz')
  }

  function finishQuiz(payload) {
    setResults(payload)
    setView('results')
  }

  function restart() {
    // Re-run the same preset → reshuffled question order.
    startQuiz(activeQuiz)
  }

  function goHome() {
    setView('home')
    setActiveQuiz(null)
    setQuizQuestions([])
    setResults(null)
  }

  return (
    <div className="app">
      <header className="app-header">
        <button className="brand" onClick={goHome}>
          🛡️ <span>Cyberværnepligt&nbsp;Quiz</span>
        </button>
        {view !== 'home' && (
          <button className="ghost-btn" onClick={goHome}>
            Afslut
          </button>
        )}
      </header>

      <main className="app-main">
        {view === 'home' && <Home onStart={startQuiz} />}
        {view === 'quiz' && (
          <Quiz
            quiz={activeQuiz}
            questions={quizQuestions}
            onFinish={finishQuiz}
            onQuit={goHome}
          />
        )}
        {view === 'results' && (
          <Results
            quiz={activeQuiz}
            results={results}
            onRestart={restart}
            onHome={goHome}
          />
        )}
      </main>

      <footer className="app-footer">
        Lavet til forberedelse til optagelsesprøven · {quizCountLabel()} 
        <br />
        <br />
        Noah Dam © {new Date().getFullYear()  }
      </footer>
    </div>
  )
}

function quizCountLabel() {
  return '120 spørgsmål i banken'
}
