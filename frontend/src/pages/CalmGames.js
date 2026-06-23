import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CalmGames.css";

/* ─────────────────────────────────────────
   GAME 1 — MEMORY MATCH
───────────────────────────────────────── */
const EMOJIS = ["🌿", "🌸", "🌙", "☀️", "🍀", "🌊", "🦋", "⭐"];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function MemoryMatch() {
  const [cards, setCards]     = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves]     = useState(0);
  const [lock, setLock]       = useState(false);

  const init = useCallback(() => {
    setCards(shuffle([...EMOJIS, ...EMOJIS]).map((v, i) => ({ id: i, value: v })));
    setFlipped([]); setMatched([]); setMoves(0); setLock(false);
  }, []);

  useEffect(() => { init(); }, [init]);

  const handleClick = (card) => {
    if (lock || flipped.includes(card.id) || matched.includes(card.id)) return;
    const next = [...flipped, card.id];
    setFlipped(next);

    if (next.length === 2) {
      setLock(true);
      setMoves((m) => m + 1);
      const [a, b] = next.map((id) => cards.find((c) => c.id === id));
      if (a.value === b.value) {
        setMatched((prev) => [...prev, a.id, b.id]);
        setFlipped([]); setLock(false);
      } else {
        setTimeout(() => { setFlipped([]); setLock(false); }, 900);
      }
    }
  };

  const won = cards.length > 0 && matched.length === cards.length;

  return (
    <div className="cg-card">
      <h2>🃏 Memory Match</h2>
      <p>Flip cards to find all matching pairs. Calm your mind with each turn.</p>

      <div className="cg-score-row">
        <span>🔄 Moves: {moves}</span>
        <span>✅ Pairs: {matched.length / 2} / {EMOJIS.length}</span>
      </div>

      {won ? (
        <>
          <div className="cg-win">🎉 Well done! Completed in {moves} moves!</div>
          <button className="cg-btn" onClick={init}>Play Again</button>
        </>
      ) : (
        <>
          <div className="cg-grid">
            {cards.map((card) => {
              const vis = flipped.includes(card.id) || matched.includes(card.id);
              return (
                <button
                  key={card.id}
                  className={`cg-card-tile ${vis ? (matched.includes(card.id) ? "matched" : "visible") : "hidden"}`}
                  onClick={() => handleClick(card)}
                >
                  {vis ? card.value : ""}
                </button>
              );
            })}
          </div>
          <button className="cg-btn" onClick={init}>Restart</button>
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   GAME 2 — BUBBLE POP
───────────────────────────────────────── */
const BUBBLE_EMOJIS = ["😰", "😟", "😤", "😓", "😩", "😬"];
const BUBBLE_COLORS = ["#99f6e4", "#93c5fd", "#fca5a5", "#fde68a", "#c4b5fd", "#fbcfe8"];

function BubblePop() {
  const [bubbles, setBubbles] = useState([]);
  const [score, setScore]     = useState(0);
  const [missed, setMissed]   = useState(0);
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const idRef = useRef(0);

  const start = () => {
    setBubbles([]); setScore(0); setMissed(0); setTimeLeft(30); setRunning(true);
  };

  // Spawn bubbles
  useEffect(() => {
    if (!running) return;
    const spawn = setInterval(() => {
      const id = idRef.current++;
      const dur = 3 + Math.random() * 2;
      setBubbles((prev) => [
        ...prev,
        {
          id, left: 5 + Math.random() * 85,
          size: 48 + Math.random() * 28,
          color: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)],
          emoji: BUBBLE_EMOJIS[Math.floor(Math.random() * BUBBLE_EMOJIS.length)],
          dur,
        },
      ]);
      // Remove escaped bubble after animation
      setTimeout(() => {
        setBubbles((prev) => {
          const exists = prev.find((b) => b.id === id);
          if (exists) { setMissed((m) => m + 1); }
          return prev.filter((b) => b.id !== id);
        });
      }, dur * 1000);
    }, 900);
    return () => clearInterval(spawn);
  }, [running]);

  // Timer countdown
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(t); setRunning(false); setBubbles([]); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running]);

  const pop = (id) => {
    setBubbles((prev) => prev.filter((b) => b.id !== id));
    setScore((s) => s + 1);
  };

  const done = !running && timeLeft === 0;

  return (
    <div className="cg-card">
      <h2>🫧 Bubble Pop</h2>
      <p>Pop the stress bubbles before they float away! Release tension with every pop.</p>

      <div className="cg-score-row">
        <span>💥 Popped: {score}</span>
        <span>😬 Escaped: {missed}</span>
        {running && <span className="cg-bubble-timer">⏱ {timeLeft}s</span>}
      </div>

      {!running && !done && (
        <button className="cg-btn" onClick={start}>Start Popping!</button>
      )}

      {running && (
        <div className="cg-bubble-area">
          {bubbles.map((b) => (
            <div
              key={b.id}
              className="cg-bubble"
              style={{
                left: `${b.left}%`,
                width: b.size, height: b.size,
                background: b.color,
                animationDuration: `${b.dur}s`,
              }}
              onClick={() => pop(b.id)}
            >
              {b.emoji}
            </div>
          ))}
        </div>
      )}

      {done && (
        <>
          <div className="cg-win">
            {score >= 20 ? "🏆 Amazing!" : score >= 10 ? "🌟 Great job!" : "💙 Good effort!"}
            <br />
            <span style={{ fontSize: 16 }}>You popped {score} stress bubbles!</span>
          </div>
          <button className="cg-btn" onClick={start}>Play Again</button>
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   GAME 3 — BREATHING BALLOON
───────────────────────────────────────── */
const PHASES = [
  { label: "Inhale",  duration: 4, size: 200, instruction: "Breathe in slowly..." },
  { label: "Hold",    duration: 4, size: 200, instruction: "Hold gently..." },
  { label: "Exhale",  duration: 6, size: 110, instruction: "Breathe out slowly..." },
  { label: "Rest",    duration: 2, size: 110, instruction: "Rest..." },
];

function BreathingBalloon() {
  const [running, setRunning]   = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [count, setCount]       = useState(PHASES[0].duration);
  const [cycles, setCycles]     = useState(0);

  useEffect(() => {
    if (!running) return;
    if (count <= 0) {
      const next = (phaseIdx + 1) % PHASES.length;
      if (next === 0) setCycles((c) => c + 1);
      setPhaseIdx(next);
      setCount(PHASES[next].duration);
      return;
    }
    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [running, count, phaseIdx]);

  const reset = () => { setRunning(false); setPhaseIdx(0); setCount(PHASES[0].duration); setCycles(0); };

  const phase = PHASES[phaseIdx];
  const size  = running ? phase.size : 140;

  return (
    <div className="cg-card">
      <h2>🎈 Breathing Balloon</h2>
      <p>Follow the balloon to guide your breathing. 4-4-6-2 box breathing pattern.</p>

      <div className="cg-balloon-wrap">
        <div className="cg-breath-phase">{running ? phase.label : "Ready"}</div>

        <div
          className="cg-balloon"
          style={{ width: size, height: size }}
        >
          {running ? phase.instruction : "🎈"}
        </div>

        <div className="cg-breath-count">{running ? count : ""}</div>
        <div className="cg-breath-sub">{running ? phase.instruction : "Press Start to begin"}</div>
        {cycles > 0 && <div className="cg-cycles">🔄 Cycles completed: {cycles}</div>}
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        {!running
          ? <button className="cg-btn" onClick={() => setRunning(true)}>Start Breathing</button>
          : <button className="cg-btn" onClick={reset}>Stop</button>
        }
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function CalmGames() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("memory");

  return (
    <div className="cg-page">
      <div className="cg-inner">
        {/* Header */}
        <div className="cg-header">
          <button className="cg-back-btn" onClick={() => navigate("/dashboard")}>← Back</button>
          <div className="cg-header-center">
            <h1>🎮 Calm Games</h1>
            <p>Mindful activities to ease stress and restore calm</p>
          </div>
          <div style={{ width: 80 }} />
        </div>

        {/* Tabs */}
        <div className="cg-tabs">
          <button className={`cg-tab ${tab === "memory"    ? "active" : ""}`} onClick={() => setTab("memory")}>🃏 Memory Match</button>
          <button className={`cg-tab ${tab === "bubbles"   ? "active" : ""}`} onClick={() => setTab("bubbles")}>🫧 Bubble Pop</button>
          <button className={`cg-tab ${tab === "breathing" ? "active" : ""}`} onClick={() => setTab("breathing")}>🎈 Breathing</button>
        </div>

        {tab === "memory"    && <MemoryMatch />}
        {tab === "bubbles"   && <BubblePop />}
        {tab === "breathing" && <BreathingBalloon />}
      </div>
    </div>
  );
}
