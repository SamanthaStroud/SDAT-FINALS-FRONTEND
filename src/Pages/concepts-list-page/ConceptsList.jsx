import { useState, useEffect } from "react";
import { Link, useParams } from "wouter";
import Header from "../../components/header/header";
import { useAuth } from "../../context/AuthContext";
import "./ConceptsList.css";

const GROUP_COLORS = {
  "JS Beginner Fundamentals": "#c084fc",
  "Intermediate Execution Concepts": "#60a5fa",
  "Advanced Async & Architecture": "#34d399",
  "TS Basics": "#818cf8",
  "Object Structuring": "#a78bfa",
  "Combining & Restricting Types": "#c4b5fd",
  "Advanced Type Manipulation": "#7c3aed",
  "Tooling & Configuration": "#6d28d9",
  "SQL Beginner Fundamentals": "#60a5fa",
  "Intermediate SQL": "#3b82f6",
  "Advanced SQL": "#2563eb",
};

function ConceptsList() {
  const { topicSlug } = useParams();

  const { user, loading: authLoading } = useAuth();

  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [notesError, setNotesError] = useState(null);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    if (!user || !topicSlug) {
      setNotesLoading(false);
      return;
    }
    setNotesLoading(true);
    setNotesError(null);
    fetch(`/api/notes/topic/${topicSlug}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load notes");
        return r.json();
      })
      .then((data) => setNotes(data))
      .catch(() => setNotesError("Could not load your notes. Try refreshing."))
      .finally(() => setNotesLoading(false));
  }, [user, topicSlug]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newContent.trim() && !newTitle.trim()) return;
    setCreating(true);
    setNotesError(null);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicSlug,
          title: newTitle.trim() || "Untitled Note",
          content: newContent,
        }),
      });
      if (!res.ok) throw new Error("Failed to save note");
      const note = await res.json();
      setNotes((prev) => [note, ...prev]);
      setNewTitle("");
      setNewContent("");
    } catch {
      setNotesError("Could not save your note. Try again.");
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (note) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
  };

  const handleUpdate = async (id) => {
    setSavingId(id);
    setNotesError(null);
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle.trim() || "Untitled Note",
          content: editContent,
        }),
      });
      if (!res.ok) throw new Error("Failed to update note");
      const updated = await res.json();
      setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
      cancelEdit();
    } catch {
      setNotesError("Could not save your changes. Try again.");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id) => {
    setSavingId(id);
    setNotesError(null);
    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete note");
      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (editingId === id) cancelEdit();
    } catch {
      setNotesError("Could not delete that note. Try again.");
    } finally {
      setSavingId(null);
    }
  };

  const [topic, setTopic] = useState(null);
  const [concepts, setConcepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetch(`/api/topics/${topicSlug}`).then((r) => {
        if (!r.ok) throw new Error("Topic not found");
        return r.json();
      }),
      fetch(`/api/concepts/${topicSlug}`).then((r) => {
        if (!r.ok) throw new Error("Failed to fetch concepts");
        return r.json();
      }),
    ])
      .then(([topicData, conceptsData]) => {
        setTopic(topicData);
        setConcepts(conceptsData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [topicSlug]);

  const parseGlance = (glance) => {
    if (Array.isArray(glance)) return glance;
    try {
      return JSON.parse(glance);
    } catch {
      return [];
    }
  };

  if (loading)
    return (
      <div className="cl-page">
        <Header hideNav />
        <div className="cl-not-found">
          <h1>Loading...</h1>
        </div>
      </div>
    );

  if (error || !topic || concepts.length === 0)
    return (
      <div className="cl-page">
        <Header hideNav />
        <div className="cl-not-found">
          <h1>No concepts found</h1>
          <p>
            We haven't added concept pages for this topic yet — check back soon.
          </p>
          <Link href="/user-topics">
            <button className="cl-back-btn">← Back to Topics</button>
          </Link>
        </div>
      </div>
    );

  const groupMap = {};
  concepts.forEach((c) => {
    if (!groupMap[c.group]) groupMap[c.group] = [];
    groupMap[c.group].push(c);
  });
  const grouped = Object.entries(groupMap).map(([label, items]) => ({
    label,
    color: GROUP_COLORS[label] ?? topic.color,
    concepts: items,
  }));

  return (
    <div className="cl-page">
      <Header hideNav />
      <div className="cl-breadcrumb">
        <Link href="/user-topics">
          <span className="cl-crumb">Topics</span>
        </Link>
        <span className="cl-crumb-sep">›</span>
        <span className="cl-crumb cl-crumb--active">{topic.name}</span>
      </div>
      <section
        className="cl-banner"
        style={{
          "--topic-color": topic.color,
          "--topic-accent": topic.accentColor,
          "--topic-border": topic.borderColor,
        }}
      >
        <div className="cl-banner-left">
          <span
            className="cl-topic-badge"
            style={{
              color: topic.color,
              borderColor: topic.borderColor,
              background: topic.accentColor,
            }}
          >
            {topic.categorySymbol} {topic.category}
          </span>
          <h1 className="cl-topic-title">{topic.name}</h1>
          <p className="cl-topic-desc">{topic.description}</p>
        </div>
        <div className="cl-banner-stats">
          <div className="cl-stat">
            <span className="cl-stat-num">{concepts.length}</span>
            <span className="cl-stat-label">Concepts</span>
          </div>
          <div className="cl-stat-dot" />
          <div className="cl-stat">
            <span className="cl-stat-num">{grouped.length}</span>
            <span className="cl-stat-label">Groups</span>
          </div>
        </div>
      </section>
      <div className="cl-body">
        {grouped.map((group) => (
          <section className="cl-group" key={group.label}>
            <div className="cl-group-header">
              <span className="cl-group-badge" style={{ color: group.color }}>
                {group.label}
              </span>
              <span className="cl-group-count">
                {group.concepts.length} concepts
              </span>
            </div>
            <div className="cl-grid">
              {group.concepts.map((concept) => {
                const glance = parseGlance(concept.glance);
                return (
                  <Link href={`/concept/${concept.slug}`} key={concept.slug}>
                    <div
                      className="cl-card"
                      style={{
                        "--cc": topic.color,
                        "--ca": topic.accentColor,
                        "--cb": topic.borderColor,
                      }}
                    >
                      <h3 className="cl-card-name">{concept.name}</h3>
                      <p className="cl-card-simple">
                        {concept.simpleExplanation}
                      </p>
                      <div className="cl-card-footer">
                        <div className="cl-card-glance">
                          {glance.slice(0, 2).map((g, i) => (
                            <span
                              className="cl-card-tag"
                              key={i}
                              style={{
                                color: topic.color,
                                borderColor: topic.borderColor,
                              }}
                            >
                              {typeof g === "string" ? g : g.label}
                            </span>
                          ))}
                        </div>
                        <span
                          className="cl-card-cta"
                          style={{ color: topic.color }}
                        >
                          Study →
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
      <section className="cl-notes-section">
        <h2 className="cl-notes-title">
          <span style={{ color: topic.color }}>✎</span> My Notes
        </h2>

        {!authLoading && !user && (
          <div className="cl-notes-placeholder">
            <p>
              Log in to write personal notes for <strong>{topic.name}</strong>.
            </p>
            <Link href="/login">
              <button className="cl-back-btn">Log In</button>
            </Link>
          </div>
        )}

        {user && (
          <div className="cl-notes-live">
            {notesError && <p className="cl-notes-error">{notesError}</p>}

            <form className="cl-note-form" onSubmit={handleCreate}>
              <input
                className="cl-note-input cl-note-input--title"
                type="text"
                placeholder="Note title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                maxLength={150}
              />
              <textarea
                className="cl-note-input cl-note-input--content"
                placeholder={`Write a note about ${topic.name}...`}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={3}
              />
              <button
                type="submit"
                className="cl-note-save-btn"
                disabled={creating || (!newTitle.trim() && !newContent.trim())}
                style={{ background: topic.color }}
              >
                {creating ? "Saving..." : "+ Add Note"}
              </button>
            </form>

            {notesLoading ? (
              <p className="cl-notes-status">Loading your notes...</p>
            ) : notes.length === 0 ? (
              <p className="cl-notes-status">
                No notes yet for {topic.name} — add your first one above.
              </p>
            ) : (
              <ul className="cl-note-list">
                {notes.map((note) => (
                  <li
                    key={note.id}
                    className="cl-note-card"
                    style={{ borderColor: topic.borderColor }}
                  >
                    {editingId === note.id ? (
                      <>
                        <input
                          className="cl-note-input cl-note-input--title"
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          maxLength={150}
                        />
                        <textarea
                          className="cl-note-input cl-note-input--content"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={3}
                        />
                        <div className="cl-note-actions">
                          <button
                            className="cl-note-save-btn"
                            style={{ background: topic.color }}
                            disabled={savingId === note.id}
                            onClick={() => handleUpdate(note.id)}
                          >
                            {savingId === note.id ? "Saving..." : "Save"}
                          </button>
                          <button
                            className="cl-note-cancel-btn"
                            onClick={cancelEdit}
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="cl-note-card-header">
                          <span className="cl-note-card-title">
                            {note.title}
                          </span>
                          <span className="cl-note-card-date">
                            {new Date(note.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                        {note.content && (
                          <p className="cl-note-card-content">{note.content}</p>
                        )}
                        <div className="cl-note-actions">
                          <button
                            className="cl-note-edit-btn"
                            onClick={() => startEdit(note)}
                          >
                            Edit
                          </button>
                          <button
                            className="cl-note-delete-btn"
                            disabled={savingId === note.id}
                            onClick={() => handleDelete(note.id)}
                          >
                            {savingId === note.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>
      <div className="cl-nav-row">
        <Link href="/user-topics">
          <button className="cl-back-btn">← All Topics</button>
        </Link>
      </div>
    </div>
  );
}

export default ConceptsList;
