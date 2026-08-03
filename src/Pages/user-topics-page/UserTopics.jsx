import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import Header from "../../components/header/header";
import { useAuth } from "../../context/AuthContext";
import "./UserTopics.css";

function UserTopics() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [selected, setSelected] = useState(new Set());
  const [bookmarked, setBookmarked] = useState(new Set());
  const { user } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    fetch("/api/topics")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch topics");
        return r.json();
      })
      .then((data) => {
        setTopics(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!user) return;
    fetch("/api/bookmarks")
      .then((r) => (r.ok ? r.json() : []))
      .then((slugs) => setBookmarked(new Set(slugs)))
      .catch(() => setBookmarked(new Set()));
  }, [user]);

  const toggleSelect = (slug) =>
    setSelected((prev) => {
      const s = new Set(prev);
      s.has(slug) ? s.delete(slug) : s.add(slug);
      return s;
    });

  const toggleBookmark = async (slug) => {
    if (!user) {
      navigate("/login");
      return;
    }
    const isCurrentlyBookmarked = bookmarked.has(slug);

    // Optimistic update — flip it immediately, revert only if the request fails.
    setBookmarked((prev) => {
      const s = new Set(prev);
      isCurrentlyBookmarked ? s.delete(slug) : s.add(slug);
      return s;
    });

    try {
      const res = await fetch(`/api/bookmarks/${slug}`, {
        method: isCurrentlyBookmarked ? "DELETE" : "POST",
      });
      if (!res.ok) throw new Error("Failed to update bookmark");
    } catch {
      // Revert on failure
      setBookmarked((prev) => {
        const s = new Set(prev);
        isCurrentlyBookmarked ? s.add(slug) : s.delete(slug);
        return s;
      });
    }
  };

  const categories = [
    "All",
    ...Array.from(new Set(topics.map((t) => t.category))),
  ];

  const visible = topics.filter((t) => {
    const matchesFilter = filter === "All" || t.category === filter;
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const selectedItems = topics.filter((t) => selected.has(t.slug));

  if (loading)
    return (
      <div className="ut-page">
        <Header hideNav />
        <div className="ut-page-header">
          <div className="ut-page-header-text">
            <h1 className="ut-title">Pick Your Topics</h1>
            <p className="ut-subtitle">Loading topics...</p>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="ut-page">
        <Header hideNav />
        <div className="ut-page-header">
          <div className="ut-page-header-text">
            <h1 className="ut-title">Pick Your Topics</h1>
            <p className="ut-subtitle" style={{ color: "#f87171" }}>
              Error: {error}
            </p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="ut-page">
      <Header hideNav />
      <div className="ut-page-header">
        <div className="ut-page-header-text">
          <h1 className="ut-title">Pick Your Topics</h1>
          <p className="ut-subtitle">
            Choose the topics you want to study. Click any card to open it, star
            to save it, or add it to your learning list.
          </p>
        </div>
        <div className="ut-search-wrap">
          <span className="ut-search-icon">⌕</span>
          <input
            className="ut-search"
            type="text"
            placeholder="Search topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="ut-search-clear" onClick={() => setSearch("")}>
              ✕
            </button>
          )}
        </div>
      </div>

      {selected.size > 0 && (
        <div className="ut-selected-bar">
          <div className="ut-selected-chips">
            {selectedItems.map((t) => (
              <span
                key={t.slug}
                className="ut-selected-chip"
                style={{ borderColor: t.borderColor, color: t.color }}
              >
                {t.name}
                <button
                  onClick={() => toggleSelect(t.slug)}
                  className="ut-chip-remove"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
          <button className="ut-start-btn">
            Start Learning ({selected.size}) →
          </button>
        </div>
      )}

      <div className="ut-filter-bar">
        {categories.map((c) => (
          <button
            key={c}
            className={`ut-filter-btn ${filter === c ? "ut-filter-btn--active" : ""}`}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <section className="ut-grid-section">
        {visible.length > 0 ? (
          <div className="ut-grid">
            {visible.map((topic) => {
              const isSel = selected.has(topic.slug);
              const isFav = bookmarked.has(topic.slug);
              return (
                <div
                  key={topic.slug}
                  className={`ut-item-card ${isSel ? "ut-item-card--selected" : ""}`}
                  style={{
                    "--c": topic.color,
                    "--ca": topic.accentColor,
                    "--cb": topic.borderColor,
                  }}
                >
                  <div className="ui-top-row">
                    <span
                      className="ui-category"
                      style={{ color: topic.color }}
                    >
                      {topic.categorySymbol} {topic.category}
                    </span>
                    <button
                      className={`ui-star ${isFav ? "ui-star--active" : ""}`}
                      onClick={() => toggleBookmark(topic.slug)}
                    >
                      {isFav ? "★" : "☆"}
                    </button>
                  </div>
                  <Link href={`/concepts/${topic.slug}`}>
                    <h2 className="ui-name" style={{ color: topic.color }}>
                      {topic.name}
                    </h2>
                  </Link>
                  <p className="ui-desc">{topic.description}</p>
                  <div className="ui-bottom-row">
                    <span className="ui-concepts-count">
                      {topic.conceptCount ?? 0} concepts
                    </span>
                    <button
                      className={`ui-add-btn ${isSel ? "ui-add-btn--active" : ""}`}
                      onClick={() => toggleSelect(topic.slug)}
                    >
                      {isSel ? "✓ Added" : "+ Add"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="ut-empty">
            <span className="ut-empty-icon">⌕</span>
            <p>
              No topics match <strong>"{search}"</strong>
            </p>
            <button className="ut-clear-search" onClick={() => setSearch("")}>
              Clear search
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default UserTopics;
