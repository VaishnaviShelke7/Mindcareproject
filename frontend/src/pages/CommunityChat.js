import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CommunityChat.css";

const TAGS = ["All", "Anxiety", "Stress", "Motivation", "Sleep", "Loneliness", "Gratitude", "General"];

const AVATARS = [
  { emoji: "🌿", bg: "#d1fae5", color: "#065f46" },
  { emoji: "🌸", bg: "#fce7f3", color: "#9d174d" },
  { emoji: "🌙", bg: "#ede9fe", color: "#5b21b6" },
  { emoji: "☀️", bg: "#fef9c3", color: "#854d0e" },
  { emoji: "🍀", bg: "#dcfce7", color: "#166534" },
  { emoji: "🌊", bg: "#dbeafe", color: "#1e40af" },
  { emoji: "🦋", bg: "#fae8ff", color: "#7e22ce" },
  { emoji: "⭐", bg: "#fef3c7", color: "#92400e" },
];

const NAMES = ["Peaceful Soul", "Gentle Heart", "Quiet Star", "Warm Light", "Soft Cloud",
               "Kind Spirit", "Brave Mind", "Calm River", "Open Sky", "Safe Space"];

const randomAvatar = () => AVATARS[Math.floor(Math.random() * AVATARS.length)];
const randomName   = () => NAMES[Math.floor(Math.random() * NAMES.length)];
const timeNow = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const INITIAL_POSTS = [
  {
    id: 0, text: "Remember: it's okay to not be okay. You're among friends here. 💙",
    name: "MindCare Team", avatar: { emoji: "🌿", bg: "#d1fae5", color: "#065f46" },
    tag: "General", time: "Welcome", likes: 24, hugs: 18,
    likedBy: [], huggedBy: [], pinned: true,
  },
];

const MAX_CHARS = 280;

export default function CommunityChat() {
  const navigate = useNavigate();
  const [posts, setPosts]     = useState(INITIAL_POSTS);
  const [msg, setMsg]         = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [selectedTag, setSelectedTag] = useState("General");
  const [userId]              = useState(() => Math.random().toString(36).slice(2));

  const filtered = activeTag === "All" ? posts : posts.filter((p) => p.tag === activeTag || p.pinned);

  const addPost = () => {
    const trimmed = msg.trim();
    if (!trimmed) return;
    const av = randomAvatar();
    const newPost = {
      id: Date.now(), text: trimmed, name: randomName(), avatar: av,
      tag: selectedTag, time: timeNow(), likes: 0, hugs: 0,
      likedBy: [], huggedBy: [], pinned: false,
    };
    setPosts((prev) => [newPost, ...prev]);
    setMsg("");
  };

  const react = (id, type) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const field   = type === "like" ? "likedBy"  : "huggedBy";
        const counter = type === "like" ? "likes"    : "hugs";
        const already = p[field].includes(userId);
        return {
          ...p,
          [field]:   already ? p[field].filter((u) => u !== userId) : [...p[field], userId],
          [counter]: already ? p[counter] - 1 : p[counter] + 1,
        };
      })
    );
  };

  const TAG_COLORS = {
    Anxiety: "#fb923c", Stress: "#fbbf24", Motivation: "#4ade80",
    Sleep: "#c084fc", Loneliness: "#60a5fa", Gratitude: "#34d399", General: "#94a3b8",
  };

  return (
    <div className="cc-page">
      <div className="cc-inner">
        {/* Header */}
        <div className="cc-header">
          <button className="cc-back-btn" onClick={() => navigate("/dashboard")}>← Back</button>
          <div className="cc-header-center">
            <h1>💬 Community Support Wall</h1>
            <p>A safe, anonymous space to share and support each other</p>
          </div>
          <div className="cc-online">
            <span className="cc-dot" /> Anonymous & Safe
          </div>
        </div>

        {/* Pinned welcome */}
        <div className="cc-pinned">
          <strong>📌 Community Guidelines</strong>
          Be kind, be supportive, and respect everyone's journey. All posts are anonymous.
          You are never alone here. 💙
        </div>

        {/* Filter tags */}
        <div className="cc-tags">
          {TAGS.map((t) => (
            <button key={t} className={`cc-tag ${activeTag === t ? "active" : ""}`} onClick={() => setActiveTag(t)}>
              {t}
            </button>
          ))}
        </div>

        {/* Compose */}
        <div className="cc-compose">
          <div className="cc-compose-top">
            <div className="cc-avatar-small" style={{ background: "#d1fae5" }}>🌿</div>
            <span style={{ fontSize: 13, color: "#64748b" }}>Posting anonymously as <strong>You</strong></span>
          </div>

          <textarea
            className="cc-textarea"
            placeholder="Share how you're feeling, a kind word, or something uplifting..."
            value={msg}
            onChange={(e) => setMsg(e.target.value.slice(0, MAX_CHARS))}
            rows={3}
          />

          <div className="cc-compose-bottom">
            <div>
              <div className="cc-tag-select">
                {TAGS.slice(1).map((t) => (
                  <button key={t} className={`cc-tag-sm ${selectedTag === t ? "active" : ""}`} onClick={() => setSelectedTag(t)}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span className={`cc-char ${msg.length > MAX_CHARS - 30 ? "warn" : ""}`}>
                {MAX_CHARS - msg.length}
              </span>
              <button className="cc-post-btn" onClick={addPost} disabled={!msg.trim()}>
                Share 💙
              </button>
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="cc-posts">
          {filtered.length === 0 && (
            <div className="cc-empty">No posts in this category yet. Be the first to share! 🌱</div>
          )}
          {filtered.map((p) => (
            <div
              key={p.id}
              className="cc-post"
              style={{ borderLeftColor: TAG_COLORS[p.tag] || "#94a3b8" }}
            >
              <div className="cc-post-header">
                <div className="cc-post-avatar" style={{ background: p.avatar.bg }}>
                  {p.avatar.emoji}
                </div>
                <div>
                  <div className="cc-post-name">{p.name}</div>
                  <div className="cc-post-time">{p.time}</div>
                </div>
                <span
                  className="cc-post-badge"
                  style={{ background: TAG_COLORS[p.tag] + "22", color: TAG_COLORS[p.tag] }}
                >
                  {p.tag}
                </span>
              </div>

              <p className="cc-post-text">{p.text}</p>

              <div className="cc-post-footer">
                <button
                  className={`cc-react-btn ${p.likedBy.includes(userId) ? "liked" : ""}`}
                  onClick={() => react(p.id, "like")}
                >
                  ❤️ {p.likes}
                </button>
                <button
                  className={`cc-react-btn ${p.huggedBy.includes(userId) ? "hugged" : ""}`}
                  onClick={() => react(p.id, "hug")}
                >
                  🤗 {p.hugs}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
