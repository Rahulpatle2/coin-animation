import {useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

// ── Coin sound ──
function playCoinSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(1046, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.18);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(2093, ctx.currentTime);
    gain2.gain.setValueAtTime(0.12, ctx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc2.start(ctx.currentTime);
    osc2.stop(ctx.currentTime + 0.12);

  } catch (e) {}
}

// ── Single Coin ──
function Coin({ targetX, targetY, startX, startY, delay }) {

  const controls = useAnimation();

  // Small random spread around the spawn point
  const spawnX = startX + (Math.random() - 0.5) * 60;
  const spawnY = startY + (Math.random() - 0.5) * 60;

  // Arc point — coin curves up before reaching badge
  const arcX = spawnX + (targetX - spawnX) * 0.4 + (Math.random() - 0.5) * 80;
  const arcY = Math.min(spawnY, targetY) - 80 - Math.random() * 60;

  useEffect(() => {
    const timer = setTimeout(async () => {

      // Fly: spawn → arc → badge
      await controls.start({
        x: [0, arcX - spawnX, targetX - spawnX],
        y: [0, arcY - spawnY, targetY - spawnY],
        scale:   [1, 1.2, 0.6],
opacity: [1, 1,   1],
        rotate:  [0, 180, 360],
        transition: {
          duration: 0.75,
          ease: "easeInOut",
          times: [0, 0.45, 1],
        }
      });

      // Sound plays when coin reaches badge
      playCoinSound();

    }, delay);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      animate={controls}
      style={{
        position: "fixed",
        top: spawnY,
        left: spawnX,
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: "#F5A623",
        border: "3px solid #C47F17",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        fontWeight: "500",
        color: "#8B5E00",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      ₹
    </motion.div>
  );
}

// ── Main Component ──
export default function CoinAnimation({
  trigger,
  coinBadgeRef,
  originRef,
  coinCount = 12,
  onComplete,
}) {
  const [coins, setCoins] = useState([]);
  const firedRef = useRef(false);

  useEffect(() => {

    // Only fire once per trigger
    if (!trigger || firedRef.current) return;
    firedRef.current = true;

    // Where coins fly TO (badge)
    let tx = window.innerWidth - 60;
    let ty = 24;
    if (coinBadgeRef?.current) {
      const r = coinBadgeRef.current.getBoundingClientRect();
      tx = r.left + r.width / 2;
      ty = r.top + r.height / 2;
    }

    // Where coins spawn FROM (task card)
    let ox = window.innerWidth / 2;
    let oy = window.innerHeight / 2;
    if (originRef?.current) {
      const r = originRef.current.getBoundingClientRect();
      ox = r.left + r.width / 2;
      oy = r.top + r.height / 2;
    }

    // Create 12 coins with staggered delays
    const generated = Array.from({ length: coinCount }, (_, i) => ({
      id: i,
      targetX: tx,
      targetY: ty,
      startX: ox,
      startY: oy,
      delay: i * 80,    // each coin waits 80ms more than the previous
    }));

    setCoins(generated);

    // Clean up after last coin finishes
    const totalTime = coinCount * 80 + 900;
    const cleanup = setTimeout(() => {
      setCoins([]);
      firedRef.current = false;
      if (onComplete) onComplete();
    }, totalTime);

    return () => clearTimeout(cleanup);

  }, [trigger]);

  if (coins.length === 0) return null;

  return (
    <>
      {coins.map((c) => (
        <Coin
          key={c.id}
          targetX={c.targetX}
          targetY={c.targetY}
          startX={c.startX}
          startY={c.startY}
          delay={c.delay}
        />
      ))}
    </>
  );
}