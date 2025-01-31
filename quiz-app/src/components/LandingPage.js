import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const NameModal = ({ onSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
      <div className="name-modal">
        <h2>Enter Your Name</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="name-input"
            autoFocus
            required
            minLength={2}
            maxLength={20}
          />
          <button 
            type="submit"
            className="start-button"
            disabled={!name.trim()}
          >
            <span className="game-icon">🎮</span> Start Quiz
          </button>
        </form>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const [players, setPlayers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://api.jsonserve.com/Uw5CrX')
      .then(response => response.json())
      .then(data => setPlayers(data.players))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleStartGame = (playerName) => {
    localStorage.setItem('playerName', playerName);
    navigate('/quiz', { replace: true });
  };

  return (
    <div className="landing-page">
      <div className="sparkle sparkle-1">✨</div>
      <div className="sparkle sparkle-2">✨</div>
      
      <h1 className="title">QuizMaster</h1>
      <p className="subtitle">Are you ready to play?</p>
      
      <button 
        className="start-button" 
        onClick={() => setShowModal(true)}
      >
        <span className="game-icon">🎮</span> Start Game
      </button>
      
      <div className="leaderboard">
        <div className="leaderboard-header">
          <span className="trophy-icon">🏆</span>
          <h2>Top Players</h2>
          <span className="rankings-text">Global Rankings</span>
        </div>
        
        <ul className="players-list">
          {players.map((player, index) => (
            <li key={index} className="player-item">
              <div className="player-info">
                <span className="player-rank">#{index + 1}</span>
                <div className="player-avatar">
                  <img 
                    src={player.avatar || "/placeholder.svg"} 
                    alt={`${player.name}'s avatar`}
                  />
                </div>
                <span className="player-name">{player.name}</span>
              </div>
              <span className="player-points">{player.points} pts</span>
            </li>
          ))}
        </ul>
      </div>

      {showModal && <NameModal onSubmit={handleStartGame} />}
    </div>
  );
};

export default LandingPage;
