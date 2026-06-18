import data from './data/quizData.json'

export const questions = data.questions
export const categories = data.categories
export const meta = data.metadata

export const DIFFICULTIES = ['let', 'mellem', 'svær']

// Fisher-Yates shuffle (returns a new array)
export function shuffle(array) {
  const a = [...array]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Emoji + ordering helpers per category, used purely for presentation.
const CATEGORY_META = {
  Computeropbygning: { icon: '🖥️' },
  Operativsystemer: { icon: '🪟' },
  Virtualisering: { icon: '📦' },
  Netværk: { icon: '🌐' },
  Netværksprotokoller: { icon: '🔌' },
  'Kryptografi & Hashing': { icon: '🔐' },
  'IT-sikkerhed': { icon: '🛡️' },
  'Malware & Angrebsmetoder': { icon: '🦠' },
  Serveradministration: { icon: '🗄️' },
}

const DIFFICULTY_META = {
  let: { icon: '🟢', label: 'Let' },
  mellem: { icon: '🟡', label: 'Mellem' },
  svær: { icon: '🔴', label: 'Svær' },
}

export function categoryIcon(cat) {
  return CATEGORY_META[cat]?.icon ?? '❓'
}

export function difficultyMeta(diff) {
  return DIFFICULTY_META[diff] ?? { icon: '⚪', label: diff }
}

function countBy(list, predicate) {
  return list.filter(predicate).length
}

/**
 * Builds the list of selectable quizzes from the question bank.
 * Each preset describes how to pick its questions via a `filter` function.
 */
export function buildQuizzes() {
  const quizzes = []

  // 1. The full mixed quiz - everything, shuffled.
  quizzes.push({
    id: 'all',
    group: 'Blandet',
    title: 'Den Store Blandede Quiz',
    subtitle: 'Alle kategorier og sværhedsgrader blandet',
    icon: '🎲',
    count: questions.length,
    filter: () => true,
  })

  // 2. A quick 10-question random sample.
  quizzes.push({
    id: 'quick-10',
    group: 'Blandet',
    title: 'Hurtig Quiz',
    subtitle: '10 tilfældige spørgsmål - perfekt til en hurtig opvarmning',
    icon: '⚡',
    count: 10,
    limit: 10,
    filter: () => true,
  })

  // 3. Eksamens-simulation: 30 blandede spørgsmål.
  quizzes.push({
    id: 'exam-30',
    group: 'Blandet',
    title: 'Eksamenssimulation',
    subtitle: '30 blandede spørgsmål på tværs af alt stoffet',
    icon: '🎓',
    count: 30,
    limit: 30,
    filter: () => true,
  })

  // 4. One quiz per category.
  for (const cat of categories) {
    const c = countBy(questions, (q) => q.category === cat)
    if (c === 0) continue
    quizzes.push({
      id: `cat-${cat}`,
      group: 'Kategorier',
      title: cat,
      subtitle: `Alle spørgsmål om ${cat.toLowerCase()}`,
      icon: categoryIcon(cat),
      count: c,
      filter: (q) => q.category === cat,
    })
  }

  // 5. One quiz per difficulty.
  for (const diff of DIFFICULTIES) {
    const c = countBy(questions, (q) => q.difficulty === diff)
    if (c === 0) continue
    const m = difficultyMeta(diff)
    quizzes.push({
      id: `diff-${diff}`,
      group: 'Sværhedsgrad',
      title: `Kun ${m.label.toLowerCase()}e spørgsmål`,
      subtitle: `Alle spørgsmål med sværhedsgrad "${m.label.toLowerCase()}"`,
      icon: m.icon,
      count: c,
      filter: (q) => q.difficulty === diff,
    })
  }

  return quizzes
}

export const QUIZZES = buildQuizzes()
export const QUIZ_GROUPS = ['Blandet', 'Kategorier', 'Sværhedsgrad']

/**
 * Returns a freshly shuffled set of questions for a quiz preset (or a custom
 * filter), respecting an optional question limit.
 */
export function getQuizQuestions(quiz) {
  const pool = questions.filter(quiz.filter)
  const shuffled = shuffle(pool)
  return quiz.limit ? shuffled.slice(0, quiz.limit) : shuffled
}

/** Builds a custom quiz from selected categories + difficulties. */
export function buildCustomQuiz({ cats, diffs, limit }) {
  const filter = (q) =>
    (cats.length === 0 || cats.includes(q.category)) &&
    (diffs.length === 0 || diffs.includes(q.difficulty))
  return {
    id: 'custom',
    title: 'Tilpasset quiz',
    icon: '🛠️',
    limit: limit || null,
    filter,
  }
}

/** Compares a set of selected option indices against the correct answers. */
export function isCorrect(question, selected) {
  const correct = question.correctAnswers
  if (selected.length !== correct.length) return false
  const s = [...selected].sort((a, b) => a - b)
  const c = [...correct].sort((a, b) => a - b)
  return s.every((v, i) => v === c[i])
}
