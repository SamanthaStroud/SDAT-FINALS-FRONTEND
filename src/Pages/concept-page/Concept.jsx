import { useState, useEffect } from "react";
import { Link, useParams } from "wouter";
import Header from "../../components/header/header";
import "./Concept.css";

function Concept() {
  const { slug } = useParams();
  const [concept, setConcept] = useState(null);
  const [allConcepts, setAllConcepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setConcept(null);
    setAllConcepts([]);
    fetch(`/api/concept/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("Concept not found");
        return r.json();
      })
      .then((data) => {
        setConcept(data);
        return fetch(`/api/concepts/${data.topicSlug}`);
      })
      .then((r) => r.json())
      .then((siblings) => {
        setAllConcepts(siblings);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  if (loading)
    return (
      <div className="cp-page">
        <Header hideNav />
        <div className="cp-not-found">
          <h1>Loading...</h1>
        </div>
      </div>
    );

  if (error || !concept)
    return (
      <div className="cp-page">
        <Header hideNav />
        <div className="cp-not-found">
          <h1>Concept not found</h1>
          <Link href="/user-topics">
            <button className="cp-back-btn">← Back to Topics</button>
          </Link>
        </div>
      </div>
    );

  const currentIndex = allConcepts.findIndex((c) => c.slug === slug);
  const prevConcept = currentIndex > 0 ? allConcepts[currentIndex - 1] : null;
  const nextConcept =
    currentIndex < allConcepts.length - 1
      ? allConcepts[currentIndex + 1]
      : null;

  return (
    <div
      className="cp-page"
      style={{
        "--concept-color": concept.color,
        "--concept-accent": concept.accentColor,
        "--concept-border": concept.borderColor,
      }}
    >
      <div className="cp-breadcrumb">
        <Link href="/user-topics">
          <span className="cp-crumb">Topics</span>
        </Link>
        <span className="cp-crumb-sep">›</span>
        <Link href={`/concepts/${concept.topicSlug}`}>
          <span className="cp-crumb">{concept.topicName}</span>
        </Link>
        <span className="cp-crumb-sep">›</span>
        <span className="cp-crumb cp-crumb--active">{concept.name}</span>
      </div>

      <section className="cp-hero">
        <div className="cp-hero-top-row">
          <span
            className="cp-category-badge"
            style={{
              color: concept.color,
              borderColor: concept.borderColor,
              background: concept.accentColor,
            }}
          >
            {concept.categorySymbol} {concept.topicName}
          </span>
          <Link href={`/notes?topic=${concept.topicSlug}`}>
            <button
              className="cp-add-note-btn"
              style={{ borderColor: concept.borderColor, color: concept.color }}
            >
              ✎ Add Note
            </button>
          </Link>
        </div>
        <h1 className="cp-concept-title">{concept.name}</h1>
        <p className="cp-concept-simple">{concept.simpleExplanation}</p>
      </section>

      <section className="cp-glance-section">
        <p className="cp-glance-header">At a Glance</p>
        <div className="cp-glance-cards">
          {concept.glance.map((g, i) => {
            const isObj = typeof g === "object";
            return (
              <div
                key={i}
                className="cp-glance-card"
                style={{ color: concept.color }}
              >
                <span className="cp-glance-card-label">
                  {isObj ? g.label : g}
                </span>
                {isObj && g.detail && (
                  <p className="cp-glance-card-detail">{g.detail}</p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="cp-section">
        <h2 className="cp-section-title">
          <span style={{ color: concept.color }}>{"{ }"}</span> Technical
          Explanation
        </h2>
        <div className="cp-technical-box">
          <p>{concept.technicalExplanation}</p>
        </div>
      </section>

      <section className="cp-section cp-section--alt">
        <h2 className="cp-section-title">
          <span style={{ color: concept.color }}>◈</span> Visual Diagram
        </h2>
        <div className="cp-diagram-window">
          <div className="cp-diagram-bar">
            <span
              className="cp-diagram-dot"
              style={{ background: "#ec4899" }}
            />
            <span
              className="cp-diagram-dot"
              style={{ background: "#f59e0b" }}
            />
            <span
              className="cp-diagram-dot"
              style={{ background: "#10b981" }}
            />
            <span className="cp-diagram-filename">{concept.slug}.diagram</span>
          </div>
          <pre className="cp-diagram">{concept.diagram}</pre>
        </div>
      </section>

      <section className="cp-section">
        <h2 className="cp-section-title">
          <span style={{ color: "#f472b6" }}>⚠</span> Common Mistakes
        </h2>
        <div className="cp-mistakes-grid">
          {concept.commonMistakes.map((m, i) => (
            <div className="cp-mistake-card" key={i}>
              <span className="cp-mistake-num">0{i + 1}</span>
              <div className="cp-mistake-body">
                <h3 className="cp-mistake-title">{m.title}</h3>
                <p className="cp-mistake-desc">{m.desc}</p>
                {m.fix && <p className="cp-mistake-fix">✓ Fix: {m.fix}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cp-section cp-section--alt">
        <h2 className="cp-section-title">
          <span style={{ color: "#34d399" }}>⬡</span> Why This Matters
        </h2>
        <div className="cp-why-grid">
          {concept.whyItMatters.map((w, i) => (
            <div className="cp-why-card" key={i}>
              <span className="cp-why-icon">{w.icon}</span>
              <h3 className="cp-why-title">{w.title}</h3>
              <p className="cp-why-desc">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cp-section">
        <h2 className="cp-section-title">
          <span style={{ color: concept.color }}>{"{ }"}</span> Code Examples
        </h2>
        <div className="cp-examples">
          {concept.codeExamples.map((ex, i) => (
            <div className="cp-example" key={i}>
              <p className="cp-example-label">{ex.label}</p>
              <div className="cp-code-window">
                <div className="cp-code-bar">
                  <span
                    className="cp-code-dot"
                    style={{ background: "#ec4899" }}
                  />
                  <span
                    className="cp-code-dot"
                    style={{ background: "#f59e0b" }}
                  />
                  <span
                    className="cp-code-dot"
                    style={{ background: "#10b981" }}
                  />
                  <span className="cp-code-filename">{ex.filename}</span>
                </div>
                <pre className="cp-code-body">
                  <code>{ex.code}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cp-section cp-section--alt">
        <h2 className="cp-section-title">
          <span style={{ color: "#fbbf24" }}>▲</span> Mini Challenge
        </h2>
        <div className="cp-challenge-box">
          <span className="cp-challenge-badge">Practice</span>
          <h3 className="cp-challenge-title">{concept.miniChallenge.title}</h3>
          <p className="cp-challenge-desc">
            {concept.miniChallenge.description}
          </p>
          {concept.miniChallenge.hints && (
            <div className="cp-hints">
              <p className="cp-hints-label">Hints</p>
              <ul className="cp-hints-list">
                {concept.miniChallenge.hints.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <div className="cp-nav-row">
        {prevConcept ? (
          <Link href={`/concept/${prevConcept.slug}`}>
            <button className="cp-nav-btn">← {prevConcept.name}</button>
          </Link>
        ) : (
          <Link href={`/concepts/${concept.topicSlug}`}>
            <button className="cp-nav-btn">
              ← Back to {concept.topicName}
            </button>
          </Link>
        )}
        <Link href="/user-topics">
          <button className="cp-nav-btn cp-nav-btn--mid">All Topics</button>
        </Link>
        {nextConcept ? (
          <Link href={`/concept/${nextConcept.slug}`}>
            <button className="cp-next-btn">{nextConcept.name} →</button>
          </Link>
        ) : (
          <Link href={`/concepts/${concept.topicSlug}`}>
            <button className="cp-next-btn">Back to list →</button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Concept;
