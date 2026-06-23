import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MoodTracker.css";

const MOODS = [
  { emoji: "😄", label: "Happy",   color: "#4ade80", bg: "#f0fdf4" },
  { emoji: "😌", label: "Relaxed", color: "#34d399", bg: "#ecfdf5" },
  { emoji: "😐", label: "Neutral", color: "#94a3b8", bg: "#f8fafc" },
  { emoji: "😰", label: "Anxious", color: "#fb923c", bg: "#fff7ed" },
  { emoji: "😔", label: "Sad",     color: "#60a5fa", bg: "#eff6ff" },
  { emoji: "😡", label: "Angry",   color: "#f87171", bg: "#fef2f2" },
  { emoji: "😴", label: "Tired",   color: "#c084fc", bg: "#faf5ff" },
  { emoji: "😟", label: "Stressed",color: "#fbbf24", bg: "#fffbeb" },
];

const SUGGESTIONS = {
  Happy:   { text: "Keep the energy up! Try a calm game to celebrate 🎮", path: "/games",  icon: "🎮" },
  Relaxed: { text: "Perfect time for a meditation session 🧘", path: "/relax",  icon: "🧘" },
  Neutral: { text: "Write your thoughts in your Journal 📓", path: "/journal", icon: "📓" },
  Anxious: { text: "Try a breathing exercise in Relax 🌿", path: "/relax",  icon: "🌿" },
  Sad:     { text: "Your AI Companion is here to listen 💙", path: "/ai",     icon: "🤖" },
  Angry:   { text: "Cool down with a Relax session 🌊", path: "/relax",  icon: "🌊" },
  Tired:   { text: "Listen to some calming music in Relax 🎵", path: "/relax",  icon: "🎵" },
  Stressed:{ text: "Talk it out with your AI Companion 🤝", path: "/ai",     icon: "🤖" },
};

const STORAGE_KEY = "mindcare_mood_entries";
const today = () => new Date().toLocaleDateString();
const timeNow = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString();
  });
}

export default function MoodTracker() {
  const navigate = useNavigate();
  const [mood, setMood]         = useState("");
  const [note, setNote]         = useState("");
  const [energy, setEnergy]     = useState(5);
  const [sleep, setSleep]       = useState(7);
  const [entries, setEntries]   = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  });
  const [saved, setSaved]       = useState(false);
  const [tab, setTab]           = useState("log"); // "log" | "history" | "insights"

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  /* ── streak ── */
  const streak = (() => {
    let count = 0;
    const check = new Date();
    while (true) {
      const dateStr = check.toLocaleDateString();
      if (entries.some((e) => e.date === dateStr)) { count++; check.setDate(check.getDate() - 1); }
      else break;
    }
    return count;
  })();

  /* ── top mood this week ── */
  const last7 = getLast7Days();
  const weekEntries = entries.filter((e) => last7.includes(e.date));
  const moodCounts = MOODS.map((m) => ({
    ...m,
    count: weekEntries.filter((e) => e.mood === m.label).length,
  }));
  const topMood = [...moodCounts].sort((a, b) => b.count - a.count)[0];

  /* ── chart data ── */
  const chartData = last7.map((dateStr) => {
    const entry = [...entries].reverse().find((e) => e.date === dateStr);
    const moodObj = entry ? MOODS.find((m) => m.label === entry.mood) : null;
    return { dateStr, moodObj, energy: entry?.energy ?? 0 };
  });

  const handleSave = () => {
    if (!mood) return;
    const newEntry = { mood, note, energy, sleep, date: today(), time: timeNow() };
    setEntries((prev) => [newEntry, ...prev]);
    setSaved(true);
    setMood(""); setNote(""); setEnergy(5); setSleep(7);
    setTimeout(() => setSaved(false), 4000);
  };

  const alreadyLoggedToday = entries.some((e) => e.date === today());
  const suggestion = mood ? SUGGESTIONS[mood] : null;

  return (
    <div className="mt-page">
      {/* Header */}
      <div className="mt-header">
        <button className="mt-back-btn" onClick={() => navigate("/dashboard")}>← Back</button>
        <div className="mt-header-center">
          <h1>📊 Mood Tracker</h1>
          <p>Track how you feel, understand your patterns</p>
        </div>
        <div className="mt-streak">
          🔥 <span>{streak}</span> day streak
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-tabs">
        {["log", "history", "insights"].map((t) => (
          <button key={t} className={`mt-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t === "log" ? "📝 Log Mood" : t === "history" ? "📋 History" : "📈 Insights"}
          </button>
        ))}
      </div>

      {/* ═══════════ LOG TAB ═══════════ */}
      {tab === "log" && (
        <div className="mt-section">
          {alreadyLoggedToday && (
            <div className="mt-banner">✅ You've already logged today — you can still add another entry.</div>
          )}

          <div className="mt-card">
            <h2>How are you feeling right now?</h2>
            <div className="mt-mood-grid">
              {MOODS.map((m) => (
                <button
                  key={m.label}
                  className={`mt-mood-btn ${mood === m.label ? "selected" : ""}`}
                  style={mood === m.label ? { background: m.color, borderColor: m.color } : {}}
                  onClick={() => setMood(m.label)}
                >
                  <span className="mt-emoji">{m.emoji}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="mt-sliders-row">
            <div className="mt-card mt-slider-card">
              <h3>⚡ Energy Level</h3>
              <div className="mt-slider-value" style={{ color: energy >= 7 ? "#4ade80" : energy >= 4 ? "#fbbf24" : "#f87171" }}>
                {energy}/10
              </div>
              <input type="range" min="1" max="10" value={energy} onChange={(e) => setEnergy(+e.target.value)} className="mt-slider" />
              <div className="mt-slider-labels"><span>Low</span><span>High</span></div>
            </div>

            <div className="mt-card mt-slider-card">
              <h3>😴 Sleep Last Night</h3>
              <div className="mt-slider-value" style={{ color: sleep >= 7 ? "#4ade80" : sleep >= 5 ? "#fbbf24" : "#f87171" }}>
                {sleep} hrs
              </div>
              <input type="range" min="0" max="12" value={sleep} onChange={(e) => setSleep(+e.target.value)} className="mt-slider" />
              <div className="mt-slider-labels"><span>0h</span><span>12h</span></div>
            </div>
          </div>

          {/* Note */}
          <div className="mt-card">
            <h3>📝 What's on your mind? <span className="optional">(optional)</span></h3>
            <textarea
              className="mt-textarea"
              placeholder="A few words about how your day is going..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>

          {/* Smart suggestion */}
          {suggestion && (
            <div className="mt-suggestion" onClick={() => navigate(suggestion.path)}>
              <span className="mt-suggestion-icon">{suggestion.icon}</span>
              <div>
                <strong>Suggested for you:</strong>
                <p>{suggestion.text}</p>
              </div>
              <span className="mt-arrow">→</span>
            </div>
          )}

          <button className="mt-save-btn" onClick={handleSave} disabled={!mood}>
            Save Entry
          </button>

          {saved && (
            <div className="mt-success">
              ✅ Mood saved! Keep checking in daily to build your streak 🔥
            </div>
          )}
        </div>
      )}

      {/* ═══════════ HISTORY TAB ═══════════ */}
      {tab === "history" && (
        <div className="mt-section">
          {entries.length === 0 ? (
            <div className="mt-empty">No entries yet. Start logging your mood! 😊</div>
          ) : (
            <div className="mt-entries">
              {entries.map((e, i) => {
                const moodObj = MOODS.find((m) => m.label === e.mood);
                return (
                  <div key={i} className="mt-entry" style={{ borderLeft: `4px solid ${moodObj?.color}` }}>
                    <div className="mt-entry-top">
                      <span className="mt-entry-emoji">{moodObj?.emoji}</span>
                      <div>
                        <strong>{e.mood}</strong>
                        <span className="mt-entry-date">{e.date} · {e.time}</span>
                      </div>
                      <div className="mt-entry-stats">
                        <span>⚡ {e.energy}/10</span>
                        <span>😴 {e.sleep}h</span>
                      </div>
                    </div>
                    {e.note && <p className="mt-entry-note">{e.note}</p>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ═══════════ INSIGHTS TAB ═══════════ */}
      {tab === "insights" && (
        <div className="mt-section">
          {/* Summary cards */}
          <div className="mt-summary-row">
            <div className="mt-summary-card">
              <div className="mt-summary-icon">🔥</div>
              <div className="mt-summary-val">{streak}</div>
              <div className="mt-summary-label">Day Streak</div>
            </div>
            <div className="mt-summary-card">
              <div className="mt-summary-icon">{topMood?.count > 0 ? topMood.emoji : "—"}</div>
              <div className="mt-summary-val">{topMood?.count > 0 ? topMood.label : "—"}</div>
              <div className="mt-summary-label">Top Mood This Week</div>
            </div>
            <div className="mt-summary-card">
              <div className="mt-summary-icon">📝</div>
              <div className="mt-summary-val">{entries.length}</div>
              <div className="mt-summary-label">Total Entries</div>
            </div>
            <div className="mt-summary-card">
              <div className="mt-summary-icon">😴</div>
              <div className="mt-summary-val">
                {weekEntries.length > 0
                  ? (weekEntries.reduce((s, e) => s + (e.sleep || 0), 0) / weekEntries.length).toFixed(1)
                  : "—"}h
              </div>
              <div className="mt-summary-label">Avg Sleep This Week</div>
            </div>
          </div>

          {/* 7-day mood chart */}
          <div className="mt-card">
            <h2>7-Day Mood Chart</h2>
            <div className="mt-chart">
              {chartData.map(({ dateStr, moodObj, energy: eng }, i) => (
                <div key={i} className="mt-chart-col">
                  <div className="mt-bar-wrap">
                    <div
                      className="mt-bar"
                      style={{
                        height: `${eng * 10}%`,
                        background: moodObj?.color || "#e2e8f0",
                        opacity: moodObj ? 1 : 0.3,
                      }}
                      title={moodObj ? `${moodObj.label} · Energy ${eng}` : "No entry"}
                    />
                  </div>
                  <span className="mt-chart-emoji">{moodObj?.emoji || "·"}</span>
                  <span className="mt-chart-day">
                    {new Date(dateStr).toLocaleDateString("en", { weekday: "short" })}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-chart-note">Bar height = energy level · Colour = mood</p>
          </div>

          {/* Mood distribution */}
          <div className="mt-card">
            <h2>Mood Distribution This Week</h2>
            {weekEntries.length === 0 ? (
              <p className="mt-empty-small">Log some moods to see your distribution.</p>
            ) : (
              <div className="mt-dist">
                {moodCounts.filter((m) => m.count > 0).map((m) => (
                  <div key={m.label} className="mt-dist-row">
                    <span className="mt-dist-emoji">{m.emoji}</span>
                    <span className="mt-dist-label">{m.label}</span>
                    <div className="mt-dist-bar-bg">
                      <div
                        className="mt-dist-bar"
                        style={{
                          width: `${(m.count / weekEntries.length) * 100}%`,
                          background: m.color,
                        }}
                      />
                    </div>
                    <span className="mt-dist-count">{m.count}x</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Insight tip */}
          {topMood?.count > 0 && SUGGESTIONS[topMood.label] && (
            <div className="mt-suggestion" onClick={() => navigate(SUGGESTIONS[topMood.label].path)}>
              <span className="mt-suggestion-icon">{SUGGESTIONS[topMood.label].icon}</span>
              <div>
                <strong>Weekly Insight:</strong>
                <p>You've been feeling <strong>{topMood.label}</strong> most this week. {SUGGESTIONS[topMood.label].text}</p>
              </div>
              <span className="mt-arrow">→</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
