import { useState } from 'react';
// import './App.css';

function App() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [fallingCoins, setFallingCoins] = useState([]);
  const [showCard, setShowCard] = useState(false);

  const playCoinSound = () => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    [0, 0.15, 0.3].forEach((delay) => {
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(988, audioCtx.currentTime + delay);
      oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + delay + 0.1);

      gainNode.gain.setValueAtTime(0.4, audioCtx.currentTime + delay);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + 0.3);

      oscillator.start(audioCtx.currentTime + delay);
      oscillator.stop(audioCtx.currentTime + delay + 0.3);
    });
  };

  const handleCoinClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setShowCard(false);

    playCoinSound();

    const coins = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      delay: Math.random() * 0.8,
      size: Math.random() * 20 + 24,
    }));

    setFallingCoins(coins);

    // Show card after coins finish falling
    setTimeout(() => {
      setShowCard(true);
      setFallingCoins([]);
      setIsAnimating(false);
    }, 2500);
  };

  const handleRedeem = () => {
    alert('🎉 You redeemed 200 coins successfully!');
    setShowCard(false);
  };

  return (
    <div className="app">

      {/* Top bar */}
      <div className="topbar">
        <span className="page-title">My Plans</span>
        <div className="coin-badge" onClick={handleCoinClick}>
          🪙 200
        </div>
      </div>

      {/* Falling coins */}
      {fallingCoins.map(coin => (
        <div
          key={coin.id}
          className="falling-coin"
          style={{
            left: `${coin.x}%`,
            fontSize: `${coin.size}px`,
            animationDelay: `${coin.delay}s`,
          }}
        >
          🪙
        </div>
      ))}

      {/* Redeem Card */}
      {showCard && (
        <div className="overlay">
          <div className="redeem-card">
            <div className="card-coin-icon">🪙</div>
            <p className="card-title">Your Coins</p>
            <p className="card-count">200</p>
            <p className="card-subtitle">You have 200 coins ready to redeem!</p>
            <button className="redeem-btn" onClick={handleRedeem}>
              🎁 Redeem Now
            </button>
            <button className="close-btn" onClick={() => setShowCard(false)}>
              Maybe Later
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;