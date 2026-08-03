import { useState, useEffect } from "react";
import "./AccountHome.css";
import { Link, useLocation } from "wouter";
import Header from "../../components/header/header";
import { useAuth } from "../../context/AuthContext";

// Calendar, Reminders, and Goals are currently commented out for V1. They can be re-enabled in V2 when the features are implemented.

const recommendedTopics = [
  { id: 1, label: "Docker", color: "#0ea5e9" },
  { id: 2, label: "PostgreSQL", color: "#6366f1" },
  { id: 3, label: "Node.js", color: "#10b981" },
];

const previouslyViewed = [
  { id: 1, label: "Git & GitHub", color: "#ec4899" },
  { id: 2, label: "CSS Grid", color: "#8b5cf6" },
  { id: 3, label: "REST APIs", color: "#f59e0b" },
];

const reminders = [
  { id: 1, text: "Review Docker notes", due: "Today" },
  { id: 2, text: "Finish TypeScript module", due: "Tomorrow" },
  { id: 3, text: "Practice SQL queries", due: "Fri" },
];

const goals = [
  { id: 1, text: "Complete React path", progress: 65 },
  { id: 2, text: "Learn Docker basics", progress: 30 },
];

function AccountHome() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();

  const [recentNotes, setRecentNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [favoriteTopics, setFavoriteTopics] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notes")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setRecentNotes(data.slice(0, 5)))
      .catch(() => setRecentNotes([]))
      .finally(() => setNotesLoading(false));
  }, []);

  useEffect(() => {
    Promise.all([
      fetch("/api/bookmarks").then((r) => (r.ok ? r.json() : [])),
      fetch("/api/topics").then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([bookmarkedSlugs, allTopics]) => {
        const slugSet = new Set(bookmarkedSlugs);
        setFavoriteTopics(allTopics.filter((t) => slugSet.has(t.slug)));
      })
      .catch(() => setFavoriteTopics([]))
      .finally(() => setFavoritesLoading(false));
  }, []);

  const displayName = user?.name ?? "User";
  const initials = displayName.charAt(0).toUpperCase();

  const sideActions = [
    { icon: "✎", label: "Notes", href: "/notes" },
    { icon: "⬡", label: "Topics", href: "/user-topics" },
    { icon: "◎", label: "Saved", href: "#saved" },
    { icon: "⚡", label: "AI Tool", href: "#ai-tool" },
    ...(user?.role === "admin"
      ? [{ icon: "⚙", label: "Admin", href: "/admin" }]
      : []),
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    const canvas = document.getElementById("starCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      speed: Math.random() * 0.3 + 0.05,
      opacity: Math.random(),
      delta: Math.random() * 0.005 + 0.002,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        star.opacity += star.delta;
        if (star.opacity >= 1 || star.opacity <= 0) star.delta *= -1;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196, 181, 253, ${star.opacity})`;
        ctx.fill();
      });
      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="account-box">
      <canvas className="star-canvas" id="starCanvas" />
      <Header hideNav />

      <div className="account-layout">
        {/* Left Sidebar */}
        <aside className="profile-sidebar">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar-placeholder">{initials}</div>
          </div>
          <p className="profile-username">{user.username}</p>
          <p className="profile-name">{user.name}</p>
          <p className="profile-title">{user.title}</p>
          <p className="profile-bio">{user.bio}</p>

          <button
            onClick={handleLogout}
            style={{
              marginTop: "1rem",
              padding: "0.4rem 1rem",
              borderRadius: "0.5rem",
              border: "1px solid rgba(255,255,255,0.2)",
              background: "transparent",
              color: "rgba(255,255,255,0.6)",
              cursor: "pointer",
              fontSize: "0.8rem",
            }}
          >
            Sign Out
          </button>

          <Link href="/notes">
            <div className="profile-section-label profile-section-label--link">
              Notes
            </div>
          </Link>
          <div className="profile-widget notes-widget">
            {recentNotes.map((n) => (
              <div key={n.id} className="note-item">
                <span className="note-title">{n.title}</span>
                <span className="note-topic">{n.topic}</span>
              </div>
            ))}
          </div>

          <div className="profile-section-label">Previously Viewed</div>
          <div className="profile-widget topics-pill-wrap">
            {previouslyViewed.map((t) => (
              <span
                key={t.id}
                className="topic-pill"
                style={{ borderColor: t.color, color: t.color }}
              >
                {t.label}
              </span>
            ))}
          </div>
        </aside>

        {/* Main Dashboard */}
        <main className="dashboard-main">
          <h2 className="welcome-heading">Welcome Back, {displayName}!</h2>

          <div className="dash-row">
            <div className="dash-card ai-card">
              <div className="dash-card-label">AI Tool</div>
              <div className="ai-card-inner">
                <p className="ai-coming">⚡ Coming Soon</p>
                <p className="ai-sub">Your dev assistant, built right in.</p>
                <div className="ai-progress-bar">
                  <div className="ai-progress-fill" style={{ width: "60%" }} />
                </div>
              </div>
            </div>
            {/* <div className="dash-card calendar-card">
              <div className="dash-card-label">Calendar</div>
              <div className="calendar-placeholder">
                <span className="calendar-icon">📅</span>
                <p>No events scheduled</p>
              </div>
            </div> */}
          </div>

          <div className="dash-card full-card">
            <div className="dash-card-label">Favorite Topics</div>
            <div className="topics-pill-wrap">
              {favoritesLoading ? (
                <span className="topic-pill">Loading...</span>
              ) : (
                favoriteTopics.map((t) => (
                  <Link key={t.slug} href={`/concepts/${t.slug}`}>
                    <span
                      className="topic-pill topic-pill--filled"
                      style={{
                        background: t.color + "22",
                        borderColor: t.color,
                        color: t.color,
                      }}
                    >
                      {t.name}
                    </span>
                  </Link>
                ))
              )}
              <Link href="/user-topics">
                <span className="topic-pill topic-pill--add">+ Add</span>
              </Link>
            </div>
          </div>

          <div className="dash-card full-card recommended-card">
            <div className="dash-card-label">Recommended Topics</div>
            <div className="topics-pill-wrap">
              {recommendedTopics.map((t) => (
                <Link key={t.id} href={`/topic/${t.label.toLowerCase()}`}>
                  <span
                    className="topic-pill topic-pill--filled"
                    style={{
                      background: t.color + "22",
                      borderColor: t.color,
                      color: t.color,
                    }}
                  >
                    {t.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* commented out both reminder and goals parts until V2 (not adding for V1) */}
          {/* <div className="dash-row">
            <div className="dash-card reminders-card">
              <div className="dash-card-label">Reminders</div>
              <ul className="reminders-list">
                {reminders.map((r) => (
                  <li key={r.id} className="reminder-item">
                    <span className="reminder-dot" />
                    <span className="reminder-text">{r.text}</span>
                    <span className="reminder-due">{r.due}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="dash-card goals-card">
              <div className="dash-card-label">Goals</div>
              <ul className="goals-list">
                {goals.map((g) => (
                  <li key={g.id} className="goal-item">
                    <div className="goal-header">
                      <span className="goal-text">{g.text}</span>
                      <span className="goal-pct">{g.progress}%</span>
                    </div>
                    <div className="goal-bar">
                      <div
                        className="goal-bar-fill"
                        style={{ width: `${g.progress}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div> */}
        </main>

        {/* Right Quick-Action Rail */}
        <aside className="quick-rail">
          {sideActions.map((a) => (
            <Link key={a.label} href={a.href}>
              <div className="rail-btn" title={a.label}>
                <span className="rail-icon">{a.icon}</span>
              </div>
            </Link>
          ))}
        </aside>
      </div>
    </div>
  );
}

export default AccountHome;
