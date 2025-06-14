import React, { useState } from 'react';
import './styles.css';

declare global {
  interface Window {
    sendDataToGameLab?: (data: any) => void;
  }
}

export default function App() {
  const [secretNumber, setSecretNumber] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const sendToGameLab = (data: any) => {
    if (typeof window.sendDataToGameLab === 'function') {
      window.sendDataToGameLab(data);
    }
  };

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    const numericGuess = parseInt(guess, 10);
    if (isNaN(numericGuess) || numericGuess < 1 || numericGuess > 100) {
      setFeedback('Please enter a number between 1 and 100.');
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    let newFeedback = '';
    if (numericGuess === secretNumber) {
      newFeedback = `Correct! You guessed the number in ${newAttempts} attempts.`;
      setFeedback(newFeedback);
      setGameOver(true);
      sendToGameLab({ event: 'win', guess: numericGuess, attempts: newAttempts });
    } else if (numericGuess < secretNumber) {
      newFeedback = 'Too low!';
      setFeedback(newFeedback);
      sendToGameLab({ event: 'guess', guess: numericGuess, feedback: 'low', attempts: newAttempts });
    } else {
      newFeedback = 'Too high!';
      setFeedback(newFeedback);
      sendToGameLab({ event: 'guess', guess: numericGuess, feedback: 'high', attempts: newAttempts });
    }
    setGuess('');
  };

  const resetGame = () => {
    const newNumber = Math.floor(Math.random() * 100) + 1;
    setSecretNumber(newNumber);
    setGuess('');
    setFeedback('');
    setAttempts(0);
    setGameOver(false);
    sendToGameLab({ event: 'reset' });
  };

  return (
    <div className="game-container">
      <h1>Number Guessing Game</h1>
      {!gameOver && (
        <form onSubmit={handleGuess} className="guess-form">
          <input
            type="number"
            min="1"
            max="100"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Enter your guess"
            disabled={gameOver}
          />
          <button type="submit" disabled={gameOver}>Guess</button>
        </form>
      )}
      {feedback && <p className="feedback">{feedback}</p>}
      {gameOver && (
        <button className="reset-button" onClick={resetGame}>
          Play Again
        </button>
      )}
      <p className="attempts">Attempts: {attempts}</p>
    </div>
  );
}