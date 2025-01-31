import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Quiz.css';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const playerName = localStorage.getItem('playerName') || 'Anonymous';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('https://api.jsonserve.com/Uw5CrX');
        const data = await response.json();
        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions);
        } else {
          throw new Error('No questions available');
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [navigate]);

  useEffect(() => {
    if (!playerName) {
      navigate('/');
      return;
    }
  }, [playerName, navigate]);

  const endGame = useCallback(() => {
    setIsGameOver(true);
    if (answers.length > 0 && questions.length > 0) {
      const finalScore = answers.reduce((total, answer, index) => {
        if (index < questions.length) {
          return total + (answer === questions[index].options.find(opt => opt.is_correct).id ? 1 : 0);
        }
        return total;
      }, 0);
      setScore(finalScore);
    }
  }, [answers, questions]);

  useEffect(() => {
    if (timeLeft > 0 && !isGameOver && !isLoading) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isGameOver) {
      endGame();
    }
  }, [timeLeft, isGameOver, isLoading, endGame]);

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
  };

  const handleNextQuestion = () => {
    if (selectedOption !== null) {
      setAnswers(prev => [...prev, selectedOption]);
      setSelectedOption(null);
      
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        endGame();
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="quiz-loading">
        <div className="loading-spinner"></div>
        <p>Loading your quiz...</p>
      </div>
    );
  }

  if (isGameOver) {
    return (
      <div className="quiz-container">
        <div className="result-card">
          <h2>Game Over! 🎮</h2>
          <h3>Well played, {playerName}!</h3>
          <div className="final-stats">
            <div className="stat-item">
              <span className="stat-label">Questions Attempted</span>
              <span className="stat-value">{answers.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Correct Answers</span>
              <span className="stat-value">{score}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Accuracy</span>
              <span className="stat-value">
                {Math.round((score / answers.length) * 100) || 0}%
              </span>
            </div>
          </div>
          <div className="result-buttons">
            <button onClick={() => window.location.reload()} className="retry-button">
              Play Again
            </button>
            <button onClick={() => navigate('/')} className="exit-button">
              View Leaderboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="timer-container">
          <div className="timer-bar" style={{ width: `${(timeLeft / 60) * 100}%` }}></div>
          <span className="timer-text">{formatTime(timeLeft)}</span>
        </div>
        <div className="quiz-progress">
          <span className="player-name">Player: {playerName}</span>
          <span>Question {currentQuestion + 1} of {questions.length}</span>
        </div>
      </div>

      {questions[currentQuestion] && (
        <div className="question-card">
          <h2 className="question-text">{questions[currentQuestion].description}</h2>
          
          <div className="options-grid">
            {questions[currentQuestion].options.map((option) => (
              <button
                key={option.id}
                className={`option-button ${selectedOption === option.id ? 'selected' : ''}`}
                onClick={() => handleOptionSelect(option.id)}
              >
                <span className="option-letter">
                  {String.fromCharCode(65 + questions[currentQuestion].options.indexOf(option))}
                </span>
                {option.description}
              </button>
            ))}
          </div>

          <button
            className={`next-button ${!selectedOption ? 'disabled' : ''}`}
            onClick={handleNextQuestion}
            disabled={selectedOption === null}
          >
            {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      )}

      <div className="sparkle sparkle-1">✨</div>
      <div className="sparkle sparkle-2">✨</div>
    </div>
  );
};

export default Quiz;
