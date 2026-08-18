import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/header/header";

const inputStyle = {
  width: "100%",
  padding: "0.5rem 0.75rem",
  borderRadius: "0.4rem",
  border: "1px solid rgba(167,139,250,0.25)",
  background: "rgba(255,255,255,0.03)",
  color: "#e9d5ff",
  fontSize: "0.85rem",
  marginBottom: "0.75rem",
};

const labelStyle = {
  display: "block",
  fontSize: "0.75rem",
  color: "rgba(233,213,255,0.6)",
  marginBottom: "0.25rem",
};

function TopicForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    slug: initial?.slug || "",
    name: initial?.name || "",
    description: initial?.description || "",
    category: initial?.category || "",
    categorySymbol: initial?.categorySymbol || "",
    color: initial?.color || "#7c3aed",
    accentColor: initial?.accentColor || "#a78bfa",
    borderColor: initial?.borderColor || "#5b21b6",
  });

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div
      style={{
        background: "rgba(167,139,250,0.06)",
        border: "1px solid rgba(167,139,250,0.2)",
        borderRadius: "0.75rem",
        padding: "1.25rem",
        marginBottom: "1.5rem",
      }}
    >
      <h3 style={{ margin: "0 0 1rem", fontSize: "1rem" }}>
        {initial?.id ? "Edit Topic" : "New Topic"}
      </h3>
      <label style={labelStyle}>Slug</label>
      <input style={inputStyle} value={form.slug} onChange={set("slug")} />
      <label style={labelStyle}>Name</label>
      <input style={inputStyle} value={form.name} onChange={set("name")} />
      <label style={labelStyle}>Description</label>
      <input
        style={inputStyle}
        value={form.description}
        onChange={set("description")}
      />
      <label style={labelStyle}>Category</label>
      <input
        style={inputStyle}
        value={form.category}
        onChange={set("category")}
      />
      <label style={labelStyle}>Category Symbol (emoji)</label>
      <input
        style={inputStyle}
        value={form.categorySymbol}
        onChange={set("categorySymbol")}
      />
      <div style={{ display: "flex", gap: "0.75rem" }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Color</label>
          <input
            style={inputStyle}
            value={form.color}
            onChange={set("color")}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Accent Color</label>
          <input
            style={inputStyle}
            value={form.accentColor}
            onChange={set("accentColor")}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Border Color</label>
          <input
            style={inputStyle}
            value={form.borderColor}
            onChange={set("borderColor")}
          />
        </div>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
        <button
          onClick={() => onSubmit(form, initial?.id)}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            border: "none",
            background: "#a78bfa",
            color: "#18052D",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Save
        </button>
        <button
          onClick={onCancel}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            border: "1px solid rgba(167,139,250,0.3)",
            background: "transparent",
            color: "#a78bfa",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function ConceptForm({ initial, topics, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    topicSlug: initial?.topic?.slug || topics[0]?.slug || "",
    slug: initial?.slug || "",
    name: initial?.name || "",
    simpleExplanation: initial?.simpleExplanation || "",
    group: initial?.group || "",
    technicalExplanation: initial?.technicalExplanation || "",
    diagram: initial?.diagram || "",
    glance: JSON.stringify(initial?.glance ?? [], null, 2),
    commonMistakes: JSON.stringify(initial?.commonMistakes ?? [], null, 2),
    whyItMatters: JSON.stringify(initial?.whyItMatters ?? [], null, 2),
    codeExamples: JSON.stringify(initial?.codeExamples ?? [], null, 2),
    miniChallenge: JSON.stringify(initial?.miniChallenge ?? {}, null, 2),
  });
  const [jsonError, setJsonError] = useState(null);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = () => {
    try {
      const payload = {
        topicSlug: form.topicSlug,
        slug: form.slug,
        name: form.name,
        simpleExplanation: form.simpleExplanation,
        group: form.group,
        technicalExplanation: form.technicalExplanation,
        diagram: form.diagram,
        glance: JSON.parse(form.glance),
        commonMistakes: JSON.parse(form.commonMistakes),
        whyItMatters: JSON.parse(form.whyItMatters),
        codeExamples: JSON.parse(form.codeExamples),
        miniChallenge: JSON.parse(form.miniChallenge),
      };
      setJsonError(null);
      onSubmit(payload, initial?.id);
    } catch (e) {
      setJsonError(
        "Invalid JSON in one of the structured fields: " + e.message,
      );
    }
  };

  const textareaStyle = {
    ...inputStyle,
    fontFamily: "monospace",
    minHeight: "70px",
  };

  return (
    <div
      style={{
        background: "rgba(167,139,250,0.06)",
        border: "1px solid rgba(167,139,250,0.2)",
        borderRadius: "0.75rem",
        padding: "1.25rem",
        marginBottom: "1.5rem",
      }}
    >
      <h3 style={{ margin: "0 0 1rem", fontSize: "1rem" }}>
        {initial?.id ? "Edit Concept" : "New Concept"}
      </h3>
      <label style={labelStyle}>Topic</label>
      <select
        style={inputStyle}
        value={form.topicSlug}
        onChange={set("topicSlug")}
      >
        {topics.map((t) => (
          <option key={t.slug} value={t.slug}>
            {t.name}
          </option>
        ))}
      </select>
      <label style={labelStyle}>Slug</label>
      <input style={inputStyle} value={form.slug} onChange={set("slug")} />
      <label style={labelStyle}>Name</label>
      <input style={inputStyle} value={form.name} onChange={set("name")} />
      <label style={labelStyle}>Simple Explanation</label>
      <input
        style={inputStyle}
        value={form.simpleExplanation}
        onChange={set("simpleExplanation")}
      />
      <label style={labelStyle}>Group</label>
      <input style={inputStyle} value={form.group} onChange={set("group")} />
      <label style={labelStyle}>Technical Explanation</label>
      <input
        style={inputStyle}
        value={form.technicalExplanation}
        onChange={set("technicalExplanation")}
      />
      <label style={labelStyle}>Diagram (optional URL/text)</label>
      <input
        style={inputStyle}
        value={form.diagram}
        onChange={set("diagram")}
      />

      <label style={labelStyle}>Glance (JSON array of strings)</label>
      <textarea
        style={textareaStyle}
        value={form.glance}
        onChange={set("glance")}
      />

      <label style={labelStyle}>
        Common Mistakes (JSON array of {"{title, desc, fix}"})
      </label>
      <textarea
        style={textareaStyle}
        value={form.commonMistakes}
        onChange={set("commonMistakes")}
      />

      <label style={labelStyle}>
        Why It Matters (JSON array of {"{icon, title, desc}"})
      </label>
      <textarea
        style={textareaStyle}
        value={form.whyItMatters}
        onChange={set("whyItMatters")}
      />

      <label style={labelStyle}>
        Code Examples (JSON array of {"{label, filename, code}"})
      </label>
      <textarea
        style={textareaStyle}
        value={form.codeExamples}
        onChange={set("codeExamples")}
      />

      <label style={labelStyle}>
        Mini Challenge (JSON object {"{title, description, hints}"})
      </label>
      <textarea
        style={textareaStyle}
        value={form.miniChallenge}
        onChange={set("miniChallenge")}
      />

      {jsonError && (
        <div
          style={{
            color: "#f87171",
            fontSize: "0.8rem",
            marginBottom: "0.5rem",
          }}
        >
          {jsonError}
        </div>
      )}

      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
        <button
          onClick={handleSubmit}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            border: "none",
            background: "#a78bfa",
            color: "#18052D",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Save
        </button>
        <button
          onClick={onCancel}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            border: "1px solid rgba(167,139,250,0.3)",
            background: "transparent",
            color: "#a78bfa",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function Admin() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [acting, setActing] = useState(null);
  const [activeTab, setActiveTab] = useState("users");
  const [topics, setTopics] = useState([]);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [topicForm, setTopicForm] = useState(null);
  const [concepts, setConcepts] = useState([]);
  const [conceptsLoading, setConceptsLoading] = useState(true);
  const [conceptForm, setConceptForm] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    if (user.role !== "admin") {
      navigate("/account");
      return;
    }
    fetchUsers();
  }, [user]);

  useEffect(() => {
    if (activeTab === "topics" || activeTab === "concepts") {
      fetchTopics();
    }
    if (activeTab === "concepts") {
      fetchAllConcepts();
    }
  }, [activeTab]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUsers = () => {
    fetch("/api/admin/users")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch users");
        return r.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const fetchTopics = () => {
    setTopicsLoading(true);
    fetch("/api/topics")
      .then((r) => r.json())
      .then((data) => {
        setTopics(data);
        setTopicsLoading(false);
      })
      .catch(() => setTopicsLoading(false));
  };

  const fetchAllConcepts = async () => {
    setConceptsLoading(true);
    try {
      const topicsRes = await fetch("/api/topics");
      const topicsData = await topicsRes.json();
      const all = [];
      for (const t of topicsData) {
        const res = await fetch(`/api/concepts/${t.slug}`);
        const data = await res.json();
        all.push(...data.map((c) => ({ ...c, topic: t })));
      }
      setConcepts(all);
    } catch {
      // leave concepts as-is on error
    } finally {
      setConceptsLoading(false);
    }
  };

  const handleDelete = async (targetUser) => {
    setOpenMenu(null);
    if (
      !confirm(
        `Are you sure you want to delete ${targetUser.name}? This cannot be undone.`,
      )
    )
      return;
    setActing(targetUser.id);
    try {
      const res = await fetch(`/api/admin/users/${targetUser.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error ?? "Failed to delete user");
        return;
      }
      setUsers((prev) => prev.filter((u) => u.id !== targetUser.id));
    } catch {
      alert("Something went wrong.");
    } finally {
      setActing(null);
    }
  };

  const handlePromote = async (targetUser) => {
    setOpenMenu(null);
    if (!confirm(`Promote ${targetUser.name} to admin?`)) return;
    setActing(targetUser.id);
    try {
      const res = await fetch(`/api/admin/users/${targetUser.id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "admin" }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error ?? "Failed to promote user");
        return;
      }
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, role: "admin" } : u)),
      );
    } catch {
      alert("Something went wrong.");
    } finally {
      setActing(null);
    }
  };

  const handleTopicSubmit = async (formData, editingId) => {
    const method = editingId ? "PATCH" : "POST";
    const url = editingId ? `/api/topics/${editingId}` : "/api/topics";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(
          data.error ?? `Failed to ${editingId ? "update" : "create"} topic`,
        );
        return;
      }
      setTopicForm(null);
      fetchTopics();
    } catch {
      alert("Something went wrong.");
    }
  };

  const handleTopicDelete = async (topic) => {
    if (!confirm(`Delete topic "${topic.name}"? This cannot be undone.`))
      return;
    try {
      const res = await fetch(`/api/topics/${topic.id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        alert("Failed to delete topic");
        return;
      }
      setTopics((prev) => prev.filter((t) => t.id !== topic.id));
    } catch {
      alert("Something went wrong.");
    }
  };

  const handleConceptSubmit = async (formData, editingId) => {
    const method = editingId ? "PATCH" : "POST";
    const url = editingId ? `/api/concepts/${editingId}` : "/api/concepts";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(
          data.error ?? `Failed to ${editingId ? "update" : "create"} concept`,
        );
        return;
      }
      setConceptForm(null);
      fetchAllConcepts();
    } catch {
      alert("Something went wrong.");
    }
  };

  const handleConceptDelete = async (concept) => {
    if (!confirm(`Delete concept "${concept.name}"? This cannot be undone.`))
      return;
    try {
      const res = await fetch(`/api/concepts/${concept.id}`, {
        method: "DELETE",
      });
      if (!res.ok && res.status !== 204) {
        alert("Failed to delete concept");
        return;
      }
      setConcepts((prev) => prev.filter((c) => c.id !== concept.id));
    } catch {
      alert("Something went wrong.");
    }
  };

  if (!user || user.role !== "admin") return null;

  const isAdmin = (u) => u.role === "admin";

  const tabButtonStyle = (tab) => ({
    padding: "0.5rem 1.25rem",
    borderRadius: "0.5rem",
    border: `1px solid ${activeTab === tab ? "#a78bfa" : "rgba(167,139,250,0.2)"}`,
    background: activeTab === tab ? "rgba(167,139,250,0.15)" : "transparent",
    color: activeTab === tab ? "#a78bfa" : "rgba(233,213,255,0.6)",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: 600,
    textTransform: "capitalize",
  });

  const addButtonStyle = {
    padding: "0.4rem 0.9rem",
    borderRadius: "0.5rem",
    border: "1px solid rgba(167,139,250,0.3)",
    background: "rgba(167,139,250,0.1)",
    color: "#a78bfa",
    cursor: "pointer",
    fontSize: "0.8rem",
    fontWeight: 600,
  };

  const smallActionBtn = (color) => ({
    padding: "0.3rem 0.6rem",
    borderRadius: "0.4rem",
    border: `1px solid ${color}55`,
    background: "transparent",
    color,
    cursor: "pointer",
    fontSize: "0.75rem",
    marginLeft: "0.4rem",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#18052D",
        color: "#e9d5ff",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      <Header hideNav />
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "2rem",
          }}
        >
          <div>
            <p style={{ color: "#a78bfa", fontSize: "0.85rem", margin: 0 }}>
              ⚙ Admin Panel
            </p>
            <h1
              style={{
                margin: "0.25rem 0 0",
                fontSize: "1.8rem",
                fontWeight: 700,
              }}
            >
              Software Study Scripts
            </h1>
          </div>
          <Link href="/account">
            <button
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                border: "1px solid rgba(167,139,250,0.3)",
                background: "transparent",
                color: "#a78bfa",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              ← Back to Account
            </button>
          </Link>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
          {["users", "topics", "concepts"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={tabButtonStyle(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "users" && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1rem",
                marginBottom: "2rem",
              }}
            >
              {[
                { label: "Total Users", value: users.length },
                {
                  label: "Admins",
                  value: users.filter((u) => u.role === "admin").length,
                },
                {
                  label: "Regular Users",
                  value: users.filter((u) => u.role === "user").length,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    background: "rgba(167,139,250,0.08)",
                    border: "1px solid rgba(167,139,250,0.2)",
                    borderRadius: "0.75rem",
                    padding: "1.25rem",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: 700,
                      color: "#a78bfa",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "rgba(233,213,255,0.6)",
                      marginTop: "0.25rem",
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(167,139,250,0.15)",
                borderRadius: "0.75rem",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "1rem 1.5rem",
                  borderBottom: "1px solid rgba(167,139,250,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>
                  Registered Users
                </h2>
                <span
                  style={{ fontSize: "0.8rem", color: "rgba(233,213,255,0.5)" }}
                >
                  {users.length} total
                </span>
              </div>

              {loading && (
                <div
                  style={{
                    padding: "2rem",
                    textAlign: "center",
                    color: "rgba(233,213,255,0.5)",
                  }}
                >
                  Loading users...
                </div>
              )}
              {error && (
                <div
                  style={{
                    padding: "2rem",
                    textAlign: "center",
                    color: "#f87171",
                  }}
                >
                  {error}
                </div>
              )}

              {!loading && !error && (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid rgba(167,139,250,0.1)",
                      }}
                    >
                      {[
                        "Name",
                        "Email",
                        "Role",
                        "Joined",
                        "Last Login",
                        "",
                      ].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "0.75rem 1.5rem",
                            textAlign: "left",
                            fontSize: "0.75rem",
                            color: "rgba(233,213,255,0.5)",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr
                        key={u.id}
                        style={{
                          borderBottom:
                            i < users.length - 1
                              ? "1px solid rgba(167,139,250,0.08)"
                              : "none",
                        }}
                      >
                        <td style={{ padding: "1rem 1.5rem" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.75rem",
                            }}
                          >
                            <div
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                background: "rgba(167,139,250,0.15)",
                                border: "1px solid rgba(167,139,250,0.3)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#a78bfa",
                                fontWeight: 700,
                                fontSize: "0.85rem",
                                flexShrink: 0,
                              }}
                            >
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <span style={{ fontWeight: 500 }}>{u.name}</span>
                          </div>
                        </td>
                        <td
                          style={{
                            padding: "1rem 1.5rem",
                            color: "rgba(233,213,255,0.7)",
                            fontSize: "0.9rem",
                          }}
                        >
                          {u.email}
                        </td>
                        <td style={{ padding: "1rem 1.5rem" }}>
                          <span
                            style={{
                              padding: "0.2rem 0.6rem",
                              borderRadius: "999px",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              background:
                                u.role === "admin"
                                  ? "rgba(167,139,250,0.15)"
                                  : "rgba(255,255,255,0.05)",
                              border: `1px solid ${u.role === "admin" ? "rgba(167,139,250,0.4)" : "rgba(255,255,255,0.1)"}`,
                              color:
                                u.role === "admin"
                                  ? "#a78bfa"
                                  : "rgba(233,213,255,0.5)",
                            }}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "1rem 1.5rem",
                            color: "rgba(233,213,255,0.5)",
                            fontSize: "0.85rem",
                          }}
                        >
                          {new Date(u.createdAt).toLocaleDateString("en-CA")}
                        </td>
                        <td
                          style={{
                            padding: "1rem 1.5rem",
                            color: "rgba(233,213,255,0.5)",
                            fontSize: "0.85rem",
                          }}
                        >
                          {u.lastLoginAt
                            ? new Date(u.lastLoginAt).toLocaleDateString(
                                "en-CA",
                              )
                            : "Never"}
                        </td>

                        <td
                          style={{
                            padding: "1rem 1.5rem",
                            textAlign: "right",
                            position: "relative",
                          }}
                        >
                          {!isAdmin(u) && (
                            <div
                              ref={openMenu === u.id ? menuRef : null}
                              style={{
                                display: "inline-block",
                                position: "relative",
                              }}
                            >
                              <button
                                onClick={() =>
                                  setOpenMenu(openMenu === u.id ? null : u.id)
                                }
                                disabled={acting === u.id}
                                style={{
                                  padding: "0.3rem 0.6rem",
                                  borderRadius: "0.4rem",
                                  border: "1px solid rgba(167,139,250,0.2)",
                                  background: "transparent",
                                  color: "rgba(233,213,255,0.6)",
                                  cursor: "pointer",
                                  fontSize: "1rem",
                                  opacity: acting === u.id ? 0.5 : 1,
                                }}
                              >
                                {acting === u.id ? "..." : "⋯"}
                              </button>

                              {openMenu === u.id && (
                                <div
                                  style={{
                                    position: "absolute",
                                    right: 0,
                                    top: "calc(100% + 4px)",
                                    background: "#1e0a3c",
                                    border: "1px solid rgba(167,139,250,0.25)",
                                    borderRadius: "0.5rem",
                                    padding: "0.35rem",
                                    zIndex: 100,
                                    minWidth: "160px",
                                    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                                  }}
                                >
                                  <button
                                    onClick={() => handlePromote(u)}
                                    style={{
                                      display: "block",
                                      width: "100%",
                                      textAlign: "left",
                                      padding: "0.5rem 0.75rem",
                                      borderRadius: "0.35rem",
                                      border: "none",
                                      background: "transparent",
                                      color: "#a78bfa",
                                      cursor: "pointer",
                                      fontSize: "0.85rem",
                                    }}
                                    onMouseEnter={(e) =>
                                      (e.target.style.background =
                                        "rgba(167,139,250,0.1)")
                                    }
                                    onMouseLeave={(e) =>
                                      (e.target.style.background =
                                        "transparent")
                                    }
                                  >
                                    ↑ Promote to Admin
                                  </button>
                                  <div
                                    style={{
                                      height: "1px",
                                      background: "rgba(167,139,250,0.1)",
                                      margin: "0.25rem 0",
                                    }}
                                  />
                                  <button
                                    onClick={() => handleDelete(u)}
                                    style={{
                                      display: "block",
                                      width: "100%",
                                      textAlign: "left",
                                      padding: "0.5rem 0.75rem",
                                      borderRadius: "0.35rem",
                                      border: "none",
                                      background: "transparent",
                                      color: "#f87171",
                                      cursor: "pointer",
                                      fontSize: "0.85rem",
                                    }}
                                    onMouseEnter={(e) =>
                                      (e.target.style.background =
                                        "rgba(248,113,113,0.08)")
                                    }
                                    onMouseLeave={(e) =>
                                      (e.target.style.background =
                                        "transparent")
                                    }
                                  >
                                    🗑 Delete User
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {activeTab === "topics" && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "1rem" }}>Topics</h2>
              {!topicForm && (
                <button style={addButtonStyle} onClick={() => setTopicForm({})}>
                  + Add Topic
                </button>
              )}
            </div>

            {topicForm && (
              <TopicForm
                initial={topicForm.id ? topicForm : null}
                onSubmit={handleTopicSubmit}
                onCancel={() => setTopicForm(null)}
              />
            )}

            {topicsLoading ? (
              <div style={{ color: "rgba(233,213,255,0.5)" }}>
                Loading topics...
              </div>
            ) : (
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(167,139,250,0.15)",
                  borderRadius: "0.75rem",
                  overflow: "hidden",
                }}
              >
                {topics.map((t, i) => (
                  <div
                    key={t.id}
                    style={{
                      padding: "1rem 1.5rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderBottom:
                        i < topics.length - 1
                          ? "1px solid rgba(167,139,250,0.08)"
                          : "none",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600 }}>
                        {t.categorySymbol} {t.name}
                      </div>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "rgba(233,213,255,0.5)",
                        }}
                      >
                        {t.slug} · {t.category}
                      </div>
                    </div>
                    <div>
                      <button
                        style={smallActionBtn("#a78bfa")}
                        onClick={() => setTopicForm(t)}
                      >
                        Edit
                      </button>
                      <button
                        style={smallActionBtn("#f87171")}
                        onClick={() => handleTopicDelete(t)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "concepts" && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "1rem" }}>Concepts</h2>
              {!conceptForm && topics.length > 0 && (
                <button
                  style={addButtonStyle}
                  onClick={() => setConceptForm({})}
                >
                  + Add Concept
                </button>
              )}
            </div>

            {conceptForm && (
              <ConceptForm
                initial={conceptForm.id ? conceptForm : null}
                topics={topics}
                onSubmit={handleConceptSubmit}
                onCancel={() => setConceptForm(null)}
              />
            )}

            {conceptsLoading ? (
              <div style={{ color: "rgba(233,213,255,0.5)" }}>
                Loading concepts...
              </div>
            ) : (
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(167,139,250,0.15)",
                  borderRadius: "0.75rem",
                  overflow: "hidden",
                }}
              >
                {concepts.map((c, i) => (
                  <div
                    key={c.id}
                    style={{
                      padding: "1rem 1.5rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderBottom:
                        i < concepts.length - 1
                          ? "1px solid rgba(167,139,250,0.08)"
                          : "none",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600 }}>{c.name}</div>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "rgba(233,213,255,0.5)",
                        }}
                      >
                        {c.slug} · {c.topic?.name} · {c.group}
                      </div>
                    </div>
                    <div>
                      <button
                        style={smallActionBtn("#a78bfa")}
                        onClick={() => setConceptForm(c)}
                      >
                        Edit
                      </button>
                      <button
                        style={smallActionBtn("#f87171")}
                        onClick={() => handleConceptDelete(c)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Admin;
