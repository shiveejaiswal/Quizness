import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { mockQuestions } from "./mockData"
import "./Quiz.css"

const Quiz = () => {
  const [state, setState] = useState({
    questions: [],
    currentQuestion: 0,
    selectedOption: null,
    answers: [],
    timeLeft: 60,
    isGameOver: false,
    score: 0,
    isLoading: true,
    error: null,
  })

  const playerName = localStorage.getItem("playerName") || "Anonymous"
  const navigate = useNavigate()

  // Initialize questions on component mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("https://api.jsonserve.com/Uw5CrX", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          mode: "cors",
        })

        if (!response.ok) {
          throw new Error("API request failed")
        }

        const data = await response.json()

        if (data.questions && data.questions.length > 0) {
          setState((prev) => ({
            ...prev,
            questions: data.questions,
            isLoading: false,
          }))
        } else {
          throw new Error("No questions available")
        }
      } catch (error) {
        console.error("Error fetching questions:", error)
        // Fallback to mock data
        setState((prev) => ({
          ...prev,
          questions: mockQuestions,
          isLoading: false,
          error: "Using sample questions due to connection issues.",
        }))
      }
    }

    fetchQuestions()
  }, [])

  // Timer countdown
  useEffect(() => {
    if (state.timeLeft > 0 && !state.isGameOver && !state.isLoading) {
      const timer = setInterval(() => {
        setState((prev) => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
        }))
      }, 1000)

      return () => clearInterval(timer)
    } else if (state.timeLeft === 0 && !state.isGameOver && !state.isLoading) {
      handleGameOver()
    }
  }, [state.timeLeft, state.isGameOver, state.isLoading])

  const handleOptionSelect = (optionIndex) => {
    setState((prev) => ({
      ...prev,
      selectedOption: optionIndex,
    }))
  }

  const handleGameOver = () => {
    const finalScore = state.answers.reduce((total, answer, index) => {
      const question = state.questions[index]
      const correctAnswerIndex = question.options.findIndex((opt) => opt.is_correct)
      return total + (answer === correctAnswerIndex ? 1 : 0)
    }, 0)

    setState((prev) => ({
      ...prev,
      isGameOver: true,
      score: finalScore,
    }))

    // Update leaderboard
    const leaderboard = JSON.parse(localStorage.getItem("quizLeaderboard") || "[]")
    const newScore = {
      name: playerName,
      points: finalScore * 100,
      avatar: "/placeholder.svg",
    }

    const updatedLeaderboard = [...leaderboard, newScore].sort((a, b) => b.points - a.points).slice(0, 5)

    localStorage.setItem("quizLeaderboard", JSON.stringify(updatedLeaderboard))
  }

  const handleNextQuestion = () => {
    setState((prev) => {
      if (prev.selectedOption === null) return prev

      const newAnswers = [...prev.answers, prev.selectedOption]
      const isLastQuestion = prev.currentQuestion + 1 >= prev.questions.length

      if (isLastQuestion) {
        return {
          ...prev,
          answers: newAnswers,
          isGameOver: true,
        }
      }

      return {
        ...prev,
        answers: newAnswers,
        selectedOption: null,
        currentQuestion: prev.currentQuestion + 1,
      }
    })
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (state.isLoading) {
    return (
      <div className="quiz-loading">
        <div className="loading-spinner"></div>
        <p>Loading your quiz...</p>
      </div>
    )
  }

  if (state.isGameOver) {
    return (
      <div className="quiz-container">
        <div className="result-card">
          <h2>Game Over! 🎮</h2>
          <h3>Well played, {playerName}!</h3>
          <div className="final-stats">
            <div className="stat-item">
              <span className="stat-label">Questions Attempted</span>
              <span className="stat-value">{state.answers.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Correct Answers</span>
              <span className="stat-value">{state.score}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Accuracy</span>
              <span className="stat-value">{Math.round((state.score / state.answers.length) * 100) || 0}%</span>
            </div>
          </div>
          <div className="result-buttons">
            <button onClick={() => window.location.reload()} className="retry-button">
              Try Again
            </button>
            <button onClick={() => navigate("/")} className="exit-button">
              View Leaderboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Guard clause to prevent rendering before questions are loaded
  if (!state.questions || state.questions.length === 0) {
    return (
      <div className="quiz-loading">
        <div className="loading-spinner"></div>
        <p>Preparing questions...</p>
      </div>
    )
  }

  const currentQuestion = state.questions[state.currentQuestion]

  return (
    <div className="quiz-container">
      {state.error && <div className="error-banner">{state.error}</div>}

      {/* Timer and Progress Bar */}
      <div className="quiz-header">
        <div className="timer-container">
          <div className="timer-bar" style={{ width: `${(state.timeLeft / 60) * 100}%` }} />
          <span className="timer-text">{formatTime(state.timeLeft)}</span>
        </div>
        <div className="quiz-progress">
          <div className="quiz-info">
            <span className="player-name">Player: {playerName}</span>
            <span className="topic">{currentQuestion.topic}</span>
          </div>
          <span className="question-counter">
            Question {state.currentQuestion + 1} of {state.questions.length}
          </span>
        </div>
      </div>

      {/* Question Card */}
      <div className="question-card">
        <h2 className="question-text">{currentQuestion.description}</h2>

        <div className="options-grid">
          {currentQuestion.options.map((option, index) => (
            <button
              key={option.id}
              className={`option-button ${state.selectedOption === index ? "selected" : ""}`}
              onClick={() => handleOptionSelect(index)}
            >
              <span className="option-letter">{String.fromCharCode(65 + index)}</span>
              {option.description}
            </button>
          ))}
        </div>

        <button
          className={`next-button ${!state.selectedOption ? "disabled" : ""}`}
          onClick={handleNextQuestion}
          disabled={state.selectedOption === null}
        >
          {state.currentQuestion === state.questions.length - 1 ? "Finish Quiz" : "Next Question"}
        </button>
      </div>

      {/* Decorative elements */}
      <div className="sparkle sparkle-1">✨</div>
      <div className="sparkle sparkle-2">✨</div>
    </div>
  )
}

export default Quiz

