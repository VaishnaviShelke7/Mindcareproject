import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import "../styles/Relax.css";

const EXERCISES = [
  { id: "breathing",  label: "🌬️ Breathing"  },
  { id: "stretching", label: "🤸 Stretching"  },
  { id: "meditation", label: "🧘 Meditation"  },
  { id: "music",      label: "🎵 Music"       },
];

const INHALE = 4, HOLD = 4, EXHALE = 6;
const TOTAL  = INHALE + HOLD + EXHALE;

export default function Relax() {
  const navigate = useNavigate();

  const [exercise, setExercise]       = useState("breathing");
  const [timer, setTimer]             = useState(0);
  const [isRunning, setIsRunning]     = useState(false);
  const [breathPhase, setBreathPhase] = useState("Inhale");
  const [progress, setProgress]       = useState(0);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setTimer((prev) => {
        const t = prev + 1;
        const c = t % TOTAL;
        if      (c < INHALE)          setBreathPhase("Inhale");
        else if (c < INHALE + HOLD)   setBreathPhase("Hold");
        else                          setBreathPhase("Exhale");
        setProgress(c / TOTAL);
        return t;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  const resetTimer = () => {
    setTimer(0); setIsRunning(false);
    setBreathPhase("Inhale"); setProgress(0);
  };

  const fmt = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const phaseEmoji = { Inhale: "🫁", Hold: "⏸️", Exhale: "💨" };

  return (
    <div className="relax-page">
      {/* animated-bg div kept for DOM but hidden via CSS */}
      <div className="animated-bg" />
      {[...Array(8)].map((_, i) => <div key={i} className="floating-bubble" />)}

      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        ← Back
      </button>

      <h1>🧘 Relax &amp; Rejuvenate</h1>
      <p className="relax-sub">Take a moment for yourself. You deserve this.</p>

      {/* Tab selector */}
      <div className="exercise-selector">
        {EXERCISES.map((ex) => (
          <button
            key={ex.id}
            className={`btn ${exercise === ex.id ? "active" : ""}`}
            onClick={() => { setExercise(ex.id); resetTimer(); }}
          >
            {ex.label}
          </button>
        ))}
      </div>

      {/* ══════════ BREATHING ══════════ */}
      {exercise === "breathing" && (
        <div className="breathing-section">
          <div className="breath-phase-label">
            {isRunning ? breathPhase.toUpperCase() : "READY"}
          </div>

          <div className="breath-circle" data-phase={isRunning ? breathPhase : "Ready"}>
            {isRunning ? phaseEmoji[breathPhase] : "🌿"}
          </div>

          <p className="breathing-instruction">
            {isRunning
              ? breathPhase === "Inhale" ? "Breathe in slowly…"
              : breathPhase === "Hold"   ? "Hold gently…"
              : "Release slowly…"
              : "Press Start when you're ready"}
          </p>

          <div className="breathing-timer">
            <p className="timer">{fmt(timer)}</p>
            <div className="breath-btn-row">
              <button className="btn" onClick={() => setIsRunning((r) => !r)}>
                {isRunning ? "⏸ Pause" : "▶ Start"}
              </button>
              <button className="btn reset" onClick={resetTimer}>↺ Reset</button>
            </div>
          </div>

          <div className="progress-ring">
            <svg width="140" height="140">
              <circle className="progress-bg" cx="70" cy="70" r="60" />
              <circle
                className="progress-fg"
                cx="70" cy="70" r="60"
                strokeDasharray={2 * Math.PI * 60}
                strokeDashoffset={(1 - progress) * 2 * Math.PI * 60}
              />
            </svg>
          </div>
        </div>
      )}

      {/* ══════════ STRETCHING ══════════ */}
      {exercise === "stretching" && (
        <div className="relax-content">
          <div className="relax-patch">
            <h2>🤸 Yoga &amp; Stretching</h2>
            <p>Short routines to release tension and restore your body.</p>
            <div className="video-grid">
              <iframe src="https://www.youtube.com/embed/v7AYKMP6rOE" title="Morning Yoga"            allowFullScreen />
              <iframe src="https://www.youtube.com/embed/4pKly2JojMw" title="Office Stretch"          allowFullScreen />
              <iframe src="https://www.youtube.com/embed/COp7BR_Dvps" title="Neck & Shoulder Stretch" allowFullScreen />
              <iframe src="https://www.youtube.com/embed/sTANio_2E0Q" title="Full Body Stretch"       allowFullScreen />
              <iframe src="https://www.youtube.com/embed/qULTwquOuT4" title="Back Pain Relief"        allowFullScreen />
              <iframe src="https://www.youtube.com/embed/2L2lnxIcNmo" title="Morning Flexibility"     allowFullScreen />
            </div>
            <p className="tip">💡 Stretch slowly, breathe deeply, and listen to your body.</p>
          </div>
        </div>
      )}

      {/* ══════════ MEDITATION ══════════ */}
      {exercise === "meditation" && (
        <div className="relax-content">
          <div className="relax-patch">
            <h2>🧘 Guided Meditation</h2>
            <p>Choose a session that matches your mood right now.</p>
            <div className="video-grid">
              <iframe src="https://www.youtube.com/embed/inpok4MKVLM" title="5 Minute Meditation"     allowFullScreen />
              <iframe src="https://www.youtube.com/embed/ZToicYcHIOU" title="Anxiety Relief"          allowFullScreen />
              <iframe src="https://www.youtube.com/embed/5qap5aO4i9A" title="Lofi Focus"              allowFullScreen />
              <iframe src="https://www.youtube.com/embed/jfKfPfyJRdk" title="Chill Beats"             allowFullScreen />
              <iframe src="https://www.youtube.com/embed/4xDzrJKXOOY" title="Anxiety Relief Music"    allowFullScreen />
              <iframe src="https://www.youtube.com/embed/xQ6xgDI7Whc" title="Calm Mind Sounds"        allowFullScreen />
            </div>
            <ul className="meditation-tips">
              <li>🌿 Sit comfortably</li>
              <li>🌬️ Focus on breath</li>
              <li>📵 Minimize distractions</li>
              <li>🕯️ Dim the lights</li>
            </ul>
          </div>
        </div>
      )}

      {/* ══════════ MUSIC ══════════ */}
      {exercise === "music" && (
        <div className="relax-content">
          <div className="relax-patch">
            <h2>🎵 Relaxing Sounds</h2>
            <p>Let calming audio ease your mind and improve sleep quality.</p>
            <div className="video-grid">
              <iframe src="https://www.youtube.com/embed/2OEL4P1Rz04" title="Calm Piano"            allowFullScreen />
              <iframe src="https://www.youtube.com/embed/lFcSrYw-ARY" title="Deep Sleep Music"      allowFullScreen />
              <iframe src="https://www.youtube.com/embed/1ZYbU82GVz4" title="Calm Background"       allowFullScreen />
              <iframe src="https://www.youtube.com/embed/aXItOY0sLRY" title="Deep Sleep"            allowFullScreen />
              <iframe src="https://www.youtube.com/embed/eKFTSSKCzWA" title="Rain Sounds"           allowFullScreen />
              <iframe src="https://www.youtube.com/embed/MkNeIUgNPQ8" title="Waterfall Sounds"      allowFullScreen />
              <iframe src="https://www.youtube.com/embed/DWcJFNfaw9c" title="Sleep Instantly"       allowFullScreen />
              <iframe src="https://www.youtube.com/embed/1fueZCTYkpA" title="Healing Sleep"         allowFullScreen />
            </div>
            <p className="tip">🎧 Use headphones for the best experience.</p>
          </div>
        </div>
      )}
    </div>
  );
}
