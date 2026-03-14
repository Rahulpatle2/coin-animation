import { useState, useRef } from "react";
import CoinAnimation from "./CoinAnimation";

export default function App() {

  const coinBadgeRef = useRef(null);
  const taskCardRef  = useRef(null);
  const coinCircleRef = useRef(null);
  const [animate, setAnimate]       = useState(false);
  const [points, setPoints]         = useState(200);
  const [badgePulse, setBadgePulse] = useState(false);

  function handleComplete() {
    setAnimate(true);
  }

  function handleAnimationComplete() {
    // Runs after all 12 coins land
    setAnimate(false);
    setPoints((p) => p + 50);

    // Badge pulses when coins arrive
    setBadgePulse(true);
    setTimeout(() => setBadgePulse(false), 500);
  }

  return (
    <div style={{ fontFamily: "sans-serif", background: "#f0faf7", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{
        background: "#1D9E75",
        padding: "12px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div>
          <div style={{ color: "#fff", fontSize: 16, fontWeight: "500" }}>Hi Devin</div>
          <div style={{ color: "#9FE1CB", fontSize: 12 }}>How're you doing</div>
        </div>

        {/* Coin badge */}
        <div
          ref={coinBadgeRef}
          style={{
            background: "#0F6E56",
            borderRadius: 20,
            padding: "6px 12px",
            display: "flex",
            alignItems: "center",
            gap: 6,
            transform: badgePulse ? "scale(1.3)" : "scale(1)",
            transition: "transform 0.2s ease"
          }}
        >
          <div ref={coinCircleRef} style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "#F5A623",
            border: "2px solid #C47F17",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 9,
            fontWeight: "500",
            color: "#8B5E00"
          }}>₹</div>
          <span style={{ color: "#E1F5EE", fontSize: 13 }}>
            {points}
          </span>
        </div>
      </div>

      {/* Task card */}
      <div style={{ padding: 20 }}>
        <div
          ref={taskCardRef}
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 16,
            border: "1px solid #9FE1CB"
          }}
        >
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start"
          }}>
            <div>
              <div style={{ fontWeight: "500", fontSize: 15, color: "#085041" }}>
                X Ray Order
              </div>
              <div style={{ fontSize: 12, color: "#0F6E56", marginTop: 4 }}>
                Caring for you toddler
              </div>
            </div>
            <div style={{
              background: "#E1F5EE",
              color: "#0F6E56",
              borderRadius: 12,
              padding: "3px 10px",
              fontSize: 12,
              fontWeight: "500"
            }}>
              +50 pts
            </div>
          </div>

          <button
            onClick={handleComplete}
            style={{
              marginTop: 16,
              width: "100%",
              background: "#1D9E75",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: 12,
              fontSize: 14,
              fontWeight: "500",
              cursor: "pointer"
            }}
          >
            Mark as complete
          </button>
        </div>
      </div>

      {/* Coin animation — just drop it here, it handles everything */}
      <CoinAnimation
        trigger={animate}
        coinBadgeRef={coinCircleRef}
        originRef={taskCardRef}
        coinCount={12}
        onComplete={handleAnimationComplete}
      />

    </div>
  );
}