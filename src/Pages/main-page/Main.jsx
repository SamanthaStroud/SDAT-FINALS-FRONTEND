import "./Main.css";
import { Button } from "@mantine/core";
import { Link } from "wouter";
import Header from "../../components/header/header";
import mainimg from "../../assets/heroimg.svg";
import { useAuth } from "../../context/AuthContext";

// Data for topics and features - can be easily extended or modified
const topics = [
  {
    id: 1,
    symbol: "{ }",
    color: "#7c3aed",
    title: "Languages",
    items: ["JavaScript", "TypeScript", "Python", "Java", "Ruby"],
  },
  {
    id: 2,
    symbol: "⬡",
    color: "#0ea5e9",
    title: "Databases",
    items: ["SQL", "MongoDB", "PostgreSQL", "MySQL"],
  },
  {
    id: 3,
    symbol: "⚙",
    color: "#10b981",
    title: "DevOps",
    items: ["Git", "Docker", "AWS"],
  },
  {
    id: 4,
    symbol: "◈",
    color: "#f59e0b",
    title: "Frameworks",
    items: ["React", "Vue", "Next.js", "Express"],
  },
  {
    id: 5,
    symbol: "▲",
    color: "#ec4899",
    title: "Tools",
    items: ["VS Code", "Postman", "Figma", "Jest"],
  },
  {
    id: 6,
    symbol: "◎",
    color: "#8b5cf6",
    title: "Environments",
    items: ["Linux", "Windows", "macOS", "WSL", "Terminal"],
  },
];

// This is a simple data structure for the "How It Works" section. Each feature has a symbol, title, and description.
const features = [
  {
    symbol: "◎",
    title: "Discover",
    desc: "Browse a growing library of scripts and guides organised by topic, language, and skill level.",
  },
  {
    symbol: "✎",
    title: "Document",
    desc: "Save your own notes, annotate scripts, and build a personal reference you can return to anytime.",
  },
  {
    symbol: "⬡",
    title: "Master",
    desc: "Follow structured paths from beginner to advanced and track your progress every step of the way.",
  },
];

// The Main component is the landing page of the application. It includes a hero section, stats bar, available topics, how it works, notes feature, AI tool teaser, CTA, and about us section.
function Main() {
  const { user } = useAuth();

  return (
    <div id="top" className="main-box">
      <Header />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">Smart Script Library</span>
          <h1 className="hero-title">
            Software
            <br />
            Study Scripts
          </h1>
          <p className="hero-subtitle">
            A structured library of scripts, guides, and notes to help you
            learn, document, and master software development — all in one place.
          </p>
          <div className="hero-actions">
            <Link href={user ? "/user-topics" : "/login"}>
              <Button size="lg" radius="xl" className="btn-primary">
                {user ? "Continue Learning" : "Get Started"}
              </Button>
            </Link>
            <Link href="/topics">
              <Button
                size="lg"
                radius="xl"
                variant="outline"
                className="btn-outline"
              >
                Explore Topics
              </Button>
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img src={mainimg} alt="Software Study Scripts illustration" />
        </div>
      </section>

      {/* Stats bar Section */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-number">50+</span>
          <span className="stat-label">Topics</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-number">300+</span>
          <span className="stat-label">Scripts</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-number">12</span>
          <span className="stat-label">Languages</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-number">24/7</span>
          <span className="stat-label">Access</span>
        </div>
      </div>

      {/* Available Topics Section */}
      <section id="topics" className="topics-section">
        <div className="section-header">
          <h2 className="section-title">Available Topics</h2>
          <p className="section-subtitle">
            Everything you need, organised and ready to explore
          </p>
        </div>
        <div className="topics-grid">
          {topics.map((topic) => (
            <div className="topic-card" key={topic.id}>
              <div className="topic-card-header">
                <span className="topic-symbol" style={{ color: topic.color }}>
                  {topic.symbol}
                </span>
                <h3 className="topic-title">{topic.title}</h3>
              </div>
              <ul className="topic-list">
                {topic.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="topics-view-all">
          <Link href="/user-topics">
            <Button size="lg" radius="xl" className="btn-outline">
              View All Topics →
            </Button>
          </Link>
        </div>
      </section>

      {/* Notes Section */}
      <section id="notes" className="notes-section">
        <div className="notes-content">
          <span className="notes-badge">✎ Personal Notes</span>
          <h2 className="notes-title">Take Notes Your Way</h2>
          <p className="notes-desc">
            Learning sticks better when it's in your own words. Software Study
            Scripts lets you write and save personal notes on any topic — so you
            can annotate what you've learned, jot down reminders, and build a
            reference library that actually makes sense to you.
          </p>
          <ul className="notes-features">
            <li>Create notes attached to any topic or script</li>
            <li>Annotate code snippets with your own explanations</li>
            <li>Organise notes by language, framework, or concept</li>
            <li>Pick up exactly where you left off, any time</li>
          </ul>
          <Link href={user ? "/notes" : "/login"}>
            <Button size="md" radius="xl" className="btn-primary">
              Start Taking Notes
            </Button>
          </Link>
        </div>
        <div className="notes-visual">
          <div className="notes-mock">
            <div className="mock-bar">
              <span className="mock-dot" style={{ background: "#ec4899" }} />
              <span className="mock-dot" style={{ background: "#f59e0b" }} />
              <span className="mock-dot" style={{ background: "#10b981" }} />
              <span className="mock-filename">my-notes.md</span>
            </div>
            <div className="mock-body">
              <span className="mock-line mock-heading">
                # JavaScript Arrays
              </span>
              <span className="mock-line mock-comment">
                // push() adds to the end
              </span>
              <span className="mock-line mock-code">
                const arr = [1, 2, 3];
              </span>
              <span className="mock-line mock-code">
                arr.push(4); <span className="mock-muted">// [1,2,3,4]</span>
              </span>
              <span className="mock-line mock-blank" />
              <span className="mock-line mock-comment">
                // my note: remember spread for copies
              </span>
              <span className="mock-line mock-code">
                const copy = [...arr];
              </span>
              <span className="mock-cursor" />
            </div>
          </div>
        </div>
      </section>

      {/* AI Tool Section */}
      <section id="ai-tool" className="ai-section">
        <div className="ai-inner">
          <span className="ai-badge">⚡ AI Tool</span>
          <h2 className="ai-title">An AI Built for Developers</h2>
          <p className="ai-desc">
            We're building an AI-powered assistant directly into Software Study
            Scripts. More details coming soon — but the goal is simple: get
            instant, accurate answers on any code topic without leaving your
            workflow.
          </p>
          <div className="ai-chips">
            <span className="ai-chip">Code Explanations</span>
            <span className="ai-chip">Debug Help</span>
            <span className="ai-chip">Concept Summaries</span>
            <span className="ai-chip">Coming Soon</span>
          </div>
          <p className="ai-coming-soon">
            Full details dropping soon — stay tuned.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Three steps to level up your skills
          </p>
        </div>
        <div className="features-grid">
          {features.map((f) => (
            <div className="feature-card" key={f.title}>
              <span className="feature-symbol">{f.symbol}</span>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2 className="cta-title">Ready to master software development?</h2>
        <p className="cta-subtitle">
          Join developers learning with structured scripts and guides. Sign up
          to unlock the full library.
        </p>
        <Link href={user ? "/user-topics" : "/login"}>
          <Button size="xl" radius="xl" className="btn-primary">
            Start Learning Today
          </Button>
        </Link>
      </section>

      {/* About Us Section */}
      <section id="about" className="about-section">
        <div className="about-inner">
          <span className="about-badge">◈ About Us</span>
          <h2 className="about-title">Built by Students, for Students</h2>
          <p className="about-desc">
            Software Study Scripts was created by two college students who found
            themselves constantly searching the same documentation, rewriting
            the same notes, and wishing there was one clean place to learn and
            reference code properly.
          </p>
          <p className="about-desc">
            So we built it. Our goal is simple, make it easier for students and
            aspiring developers to learn software concepts without the noise. No
            endless ads, no confusing documentation dumps. Just clean scripts,
            clear explanations, and tools that actually help you grow as a
            coder.
          </p>
          <div className="about-cards">
            <a
              href="https://github.com/SamanthaStroud"
              target="_blank"
              rel="noreferrer"
              className="about-card"
            >
              <div className="about-avatar">S</div>
              <div className="about-card-info">
                <span className="about-person-name">Samantha Stroud</span>
                <span className="about-name">Co-Founder</span>
                <span className="about-role">Full-Stack Development</span>
              </div>
            </a>
            <a
              href="https://github.com/BCoishous"
              target="_blank"
              rel="noreferrer"
              className="about-card"
            >
              <div className="about-avatar">B</div>
              <div className="about-card-info">
                <span className="about-person-name">Brandon Coish</span>
                <span className="about-name">Co-Founder</span>
                <span className="about-role">Full-Stack Development</span>
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Main;
