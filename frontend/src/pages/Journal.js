import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Journal.css";

const MOOD_TAGS = [
  { label: "😊 Happy",    color: "#4ade80" },
  { label: "😌 Calm",     color: "#34d399" },
  { label: "😔 Sad",      color: "#60a5fa" },
  { label: "😰 Anxious",  color: "#fb923c" },
  { label: "😤 Frustrated",color: "#f87171" },
  { label: "🙏 Grateful", color: "#a78bfa" },
  { label: "😐 Neutral",  color: "#94a3b8" },
];

const PROMPTS = [
  "What made me smile today?",
  "What am I grateful for right now?",
  "What's been weighing on my mind?",
  "What would make tomorrow better?",
  "One thing I'm proud of today...",
  "How am I really feeling, deep down?",
  "What do I need more of in my life?",
  "A moment today I want to remember...",
];

const wordCount = (text) =>
  text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en", {
    weekday: "short", day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit",
  });

export default function Journal() {
  const navigate = useNavigate();

  const [entries, setEntries] = useState(() => {
    try { return JSON.parse(localStorage.getItem("journalEntries")) || []; }
    catch { return []; }
  });
  const [text, setText]         = useState("");
  const [moodTag, setMoodTag]   = useState("");
  const [editIdx, setEditIdx]   = useState(null);
  const [search, setSearch]     = useState("");
  const [expanded, setExpanded] = useState({});
  const [saved, setSaved]       = useState(false);
  const [promptIdx, setPromptIdx] = useState(0);

  useEffect(() => {
    localStorage.setItem("journalEntries", JSON.stringify(entries));
  }, [entries]);

  // Rotate prompt every 8 s
  useEffect(() => {
    const t = setInterval(() => setPromptIdx((i) => (i + 1) % PROMPTS.length), 8000);
    return () => clearInterval(t);
  }, []);

  const handleSave = () => {
    if (!text.trim()) return;
    const entry = { text, moodTag, date: new Date().toISOString() };
    if (editIdx !== null) {
      setEntries((prev) => prev.map((e, i) => (i === editIdx ? entry : e)));
      setEditIdx(null);
    } else {
      setEntries((prev) => [entry, ...prev]);
    }
    setText(""); setMoodTag("");
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleEdit = (i) => {
    setText(entries[i].text);
    setMoodTag(entries[i].moodTag || "");
    setEditIdx(i);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (i) =>
    setEntries((prev) => prev.filter((_, idx) => idx !== i));

  const addPrompt = (p) =>
  setText((prev) => (prev ? prev + "\n\n" + p + " " : p + " "));

  const toggleExpand = (i) =>
    setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));

  const filtered = entries.filter(
    (e) =>
      e.text.toLowerCase().includes(search.toLowerCase()) ||
      (e.moodTag || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="jn-page">
      <div className="jn-inner">

        {/* Header */}
        <div className="jn-header">
          <button className="jn-back-btn" onClick={() => navigate("/dashboard")}>← Back</button>
          <div className="jn-header-center">
            <h1>📔 My Journal</h1>
            <p>Your private space to think, feel, and heal</p>
          </div>
          <div className="jn-count-badge">📝 {entries.length} {entries.length === 1 ? "entry" : "entries"}</div>
        </div>

        {/* Writing prompts */}
        <div className="jn-prompts">
          <p>✨ Need inspiration? Try a prompt:</p>
          <div className="jn-prompt-chips">
            {PROMPTS.map((p, i) => (
              <button key={i} className="jn-chip" onClick={() => addPrompt(p)}
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Compose */}
        <div className="jn-compose">
          <p className="jn-compose-title">
            {editIdx !== null ? "✏️ Editing Entry" : "🌿 New Entry"}
          </p>

          <div className="jn-textarea-wrap">
            <textarea
              className="jn-textarea"
              placeholder={`"${PROMPTS[promptIdx]}"`}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          {/* Mood tag */}
          <div className="jn-mood-row">
            <span>How are you feeling?</span>
            {MOOD_TAGS.map((m) => (
              <button
                key={m.label}
                className={`jn-mood-tag ${moodTag === m.label ? "active" : ""}`}
                style={moodTag === m.label ? { background: m.color } : {}}
                onClick={() => setMoodTag(moodTag === m.label ? "" : m.label)}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="jn-compose-footer">
            <span className="jn-word-count">{wordCount(text)} words</span>
            <button
              className={`jn-save-btn ${editIdx !== null ? "editing" : ""}`}
              onClick={handleSave}
              disabled={!text.trim()}
            >
              {editIdx !== null ? "Update Entry ✏️" : "Save Entry 💾"}
            </button>
          </div>
        </div>

        {saved && <div className="jn-saved">✅ Entry saved! Keep writing — every word matters. 💙</div>}

        {/* Search */}
        {entries.length > 0 && (
          <div className="jn-search-wrap">
            <span className="jn-search-icon">🔍</span>
            <input
              className="jn-search"
              placeholder="Search your entries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}

        {/* Entries */}
        <div className="jn-entries">
          {filtered.length === 0 && entries.length === 0 && (
            <div className="jn-empty">
              <span>📔</span>
              Your journal is waiting for you.<br />
              Write your first entry above — no rules, just you.
            </div>
          )}
          {filtered.length === 0 && entries.length > 0 && (
            <div className="jn-empty">
              <span>🔍</span>
              No entries match your search.
            </div>
          )}

          {filtered.map((entry, i) => {
            const moodObj = MOOD_TAGS.find((m) => m.label === entry.moodTag);
            const isLong  = entry.text.length > 240;
            const isExp   = expanded[i];
            const realIdx = entries.indexOf(entry);

            return (
              <div
                key={i}
                className="jn-entry"
                style={{ borderLeftColor: moodObj?.color || "#4fb3a2" }}
              >
                <div className="jn-entry-header">
                  {moodObj && (
                    <span
                      className="jn-entry-mood-tag"
                      style={{ background: moodObj.color }}
                    >
                      {moodObj.label}
                    </span>
                  )}
                  <span className="jn-entry-date">{formatDate(entry.date)}</span>
                </div>

                <div className={`jn-entry-text ${isLong && !isExp ? "collapsed" : ""}`}>
                  {entry.text}
                </div>

                {isLong && (
                  <button className="jn-expand-btn" onClick={() => toggleExpand(i)}>
                    {isExp ? "▲ Show less" : "▼ Read more"}
                  </button>
                )}

                <div className="jn-entry-footer">
                  <span className="jn-entry-words">{wordCount(entry.text)} words</span>
                  <div className="jn-entry-actions">
                    <button className="jn-edit-btn" onClick={() => handleEdit(realIdx)}>✏️ Edit</button>
                    <button className="jn-del-btn"  onClick={() => handleDelete(realIdx)}>🗑️ Delete</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
