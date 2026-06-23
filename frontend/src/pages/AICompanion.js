import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AICompanion.css";

// Negative phrases that must be checked FIRST before any positive keyword matches
const NEGATIVE_OVERRIDES = [
  "not happy", "not good", "not great", "not okay", "not ok",
  "not fine", "not well", "not feeling good", "not feeling great",
  "not feeling well", "don't feel good", "don't feel great",
  "don't feel well", "don't feel okay", "feeling not", "not excited",
  "not amazing", "not wonderful",
];

const RESPONSES = [
  {
    keywords: ["suicid", "kill myself", "end my life", "don't want to live"],
    reply:
      "I'm deeply concerned about you right now 💙 Please reach out to a crisis helpline immediately — iCall: 9152987821 or Vandrevala Foundation: 1860-2662-345. You matter.",
  },
  {
    keywords: ["depress", "hopeless", "worthless", "empty", "numb"],
    reply:
      "It takes courage to share that. Depression can feel isolating, but you're not alone 💙 Have you been able to talk to anyone you trust about how you feel?",
  },
  {
    keywords: ["sad", "unhappy", "miserable", "cry", "crying", "tears"],
    reply:
      "I'm sorry you're going through this 🌧️ It's okay to let yourself feel sad — your emotions are valid. What's been weighing on your heart?",
  },
  {
    keywords: ["anxious", "anxiety", "panic", "panic attack", "overwhelmed", "overthinking"],
    reply:
      "Let's slow down together 🌿 Try this: breathe in for 4 counts, hold for 4, out for 4. Repeat 3 times. You're safe right now. What triggered this feeling?",
  },
  {
    keywords: ["stress", "stressed", "pressure", "burnout", "exhausted", "drained"],
    reply:
      "You're carrying so much right now 💪 Remember, it's okay to set limits. What's one small thing you could put down today to ease the load?",
  },
  {
    keywords: ["angry", "anger", "furious", "rage", "frustrated", "annoyed"],
    reply:
      "Anger is a signal that something important to you has been crossed 🔥 That's valid. Would it help to talk about what happened, or try a quick grounding exercise first?",
  },
  {
    keywords: ["lonely", "alone", "isolated", "no one", "nobody cares"],
    reply:
      "Loneliness can be really painful 🤍 Just know — I'm here with you right now. Would you like to talk about what's making you feel disconnected?",
  },
  {
    keywords: ["sleep", "insomnia", "can't sleep", "nightmares", "tired", "fatigue"],
    reply:
      "Poor sleep can affect everything else 😴 Try keeping a consistent bedtime, dimming screens an hour before bed, and a short body-scan meditation. Want me to walk you through one?",
  },
  {
    keywords: ["happy", "great", "excited", "amazing", "wonderful", "good day", "feeling good"],
    reply:
      "That's genuinely wonderful to hear! 😊 What's been bringing you joy? I'd love to know!",
  },
  {
    keywords: ["grateful", "thankful", "blessed", "appreciate"],
    reply:
      "Gratitude is such a powerful practice 🌟 Holding onto the good things really does shift our mindset. What are you feeling grateful for today?",
  },
  {
    keywords: ["relationship", "breakup", "heartbreak", "ex", "partner", "love"],
    reply:
      "Relationship pain is one of the hardest things to go through 💔 Your feelings make complete sense. Do you want to talk about what happened?",
  },
  {
    keywords: ["work", "job", "career", "boss", "colleague", "office"],
    reply:
      "Work stress is incredibly common but that doesn't make it easier 💼 Is it the workload, the environment, or something else that's getting to you?",
  },
  {
    keywords: ["family", "parents", "mom", "dad", "sibling", "home"],
    reply:
      "Family dynamics can be complex and emotionally heavy 🏠 I'm here to listen without judgment. What's going on?",
  },
  {
    keywords: ["meditat", "relax", "calm", "breathe", "mindful"],
    reply:
      "Taking a moment for yourself is so important 🧘 Would you like a quick 2-minute breathing exercise or a body-scan relaxation guide?",
  },
  {
    keywords: ["help", "advice", "what should i do", "don't know what to do"],
    reply:
      "I'm here to help you think things through 🤝 Tell me more about the situation — sometimes just talking it out brings clarity.",
  },
];

const NEGATIVE_REPLY =
  "I'm sorry to hear you're not feeling your best right now 💙 That's completely okay — not every day has to be good. Would you like to talk about what's going on?";

const QUICK_REPLIES = [
  "I'm feeling anxious 😟",
  "I feel sad today 😢",
  "I'm stressed out 😰",
  "I can't sleep 😴",
  "I feel lonely 🥺",
  "I'm feeling good! 😊",
];

const getResponse = (text) => {
  const lower = text.toLowerCase();
  // Check negative overrides first so "not happy" never matches the happy rule
  if (NEGATIVE_OVERRIDES.some((phrase) => lower.includes(phrase))) {
    return NEGATIVE_REPLY;
  }
  for (const { keywords, reply } of RESPONSES) {
    if (keywords.some((kw) => lower.includes(kw))) return reply;
  }
  return "Thank you for sharing that with me 💙 I'm here to listen. Can you tell me a little more about how you're feeling?";
};

const now = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function AICompanion() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([
    {
      bot: "Hi there 👋 I'm your AI Companion. I'm here to listen, support, and talk through whatever is on your mind. How are you feeling today?",
      time: now(),
    },
  ]);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, typing]);

  const sendMessage = (text = msg) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setChat((prev) => [...prev, { user: trimmed, time: now() }]);
    setMsg("");
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      setChat((prev) => [...prev, { bot: getResponse(trimmed), time: now() }]);
    }, 1000 + Math.random() * 600);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="ai-wrapper">
      <button className="back-home-btn" onClick={() => navigate("/dashboard")}>
        ← Back
      </button>

      <div className="ai-card">
        {/* Header */}
        <div className="ai-header">
          <div className="ai-avatar">🤖</div>
          <div className="ai-header-info">
            <h2>AI Companion</h2>
            <span>
              <span className="ai-online-dot" />
              Always here for you
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="ai-messages">
          {chat.map((c, i) => (
            <div key={i} className={`msg-row ${c.user ? "user" : "bot"}`}>
              <div className="msg-bubble">{c.user || c.bot}</div>
              <span className="msg-time">{c.time}</span>
            </div>
          ))}

          {typing && (
            <div className="msg-row bot">
              <div className="typing-bubble">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick reply chips */}
        <div className="quick-replies">
          {QUICK_REPLIES.map((q) => (
            <button key={q} className="chip" onClick={() => sendMessage(q)}>
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="ai-input-area">
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Share how you're feeling..."
            disabled={typing}
          />
          <button
            className="ai-send-btn"
            onClick={() => sendMessage()}
            disabled={typing || !msg.trim()}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
