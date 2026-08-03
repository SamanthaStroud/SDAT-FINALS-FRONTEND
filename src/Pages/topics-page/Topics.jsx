import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@mantine/core';
import Header from '../../components/header/header';
import './Topics.css';

// Hardcoded topic data for demonstration purposes. In a real app, this would come from an API.
const topics = [
  {
    id: 1,
    symbol: '{ }',
    color: '#c084fc',
    accentColor: 'rgba(192,132,252,0.12)',
    borderColor: 'rgba(192,132,252,0.25)',
    title: 'Languages',
    category: 'Languages',
    desc: 'Core programming languages — from beginner scripting to enterprise-level development.',
    count: 5,
    items: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Ruby'],
  },
  {
    id: 2,
    symbol: '⬡',
    color: '#60a5fa',
    accentColor: 'rgba(96,165,250,0.1)',
    borderColor: 'rgba(96,165,250,0.22)',
    title: 'Databases',
    category: 'Databases',
    desc: 'Relational and NoSQL databases — query writing, schema design, and best practices.',
    count: 5,
    items: ['SQL', 'MongoDB', 'Firebase', 'PostgreSQL', 'MySQL'],
  },
  {
    id: 3,
    symbol: '⚙',
    color: '#34d399',
    accentColor: 'rgba(52,211,153,0.1)',
    borderColor: 'rgba(52,211,153,0.22)',
    title: 'DevOps',
    category: 'DevOps',
    desc: 'Version control, containerisation, cloud infrastructure and deployment pipelines.',
    count: 5,
    items: ['Git', 'Docker', 'AWS', 'CI/CD', 'Kubernetes'],
  },
  {
    id: 4,
    symbol: '◈',
    color: '#fbbf24',
    accentColor: 'rgba(251,191,36,0.1)',
    borderColor: 'rgba(251,191,36,0.22)',
    title: 'Frameworks',
    category: 'Frameworks',
    desc: 'Frontend and backend frameworks to build modern, production-ready applications.',
    count: 5,
    items: ['React', 'Vue', 'Next.js', 'Django', 'Express'],
  },
  {
    id: 5,
    symbol: '▲',
    color: '#f472b6',
    accentColor: 'rgba(244,114,182,0.1)',
    borderColor: 'rgba(244,114,182,0.22)',
    title: 'Tools',
    category: 'Tools',
    desc: 'Developer tools for editing, testing, designing, and shipping software faster.',
    count: 5,
    items: ['VS Code', 'Postman', 'Figma', 'Jest', 'Webpack'],
  },
  {
    id: 6,
    symbol: '◎',
    color: '#a78bfa',
    accentColor: 'rgba(167,139,250,0.1)',
    borderColor: 'rgba(167,139,250,0.22)',
    title: 'Environments',
    category: 'Environments',
    desc: 'Operating systems, terminals, and shell environments every developer should know.',
    count: 5,
    items: ['Linux', 'Windows', 'macOS', 'WSL', 'Terminal'],
  },
];

const filters = ['All', ...topics.map(t => t.category)];

function Topics() {
  const [active, setActive] = useState('All');

  const visible = active === 'All'
    ? topics
    : topics.filter(t => t.category === active);

  return (
    <div className="topics-page-box">
      {/* <Header hideNav /> */}

      {/*Page banner*/}
      <section className="topics-banner">
        <div className="topics-banner-content">
          <span className="topics-page-badge">◈ Study Scripts</span>
          <h1 className="topics-page-title">Available Topics</h1>
          <p className="topics-page-subtitle">
            Browse every topic in the library. Each section contains scripts, examples,
            and notes to help you learn at your own pace.
          </p>
          <div className="topics-banner-stats">
            <div className="banner-stat">
              <span className="banner-stat-number">{topics.length}</span>
              <span className="banner-stat-label">Categories</span>
            </div>
            <div className="banner-stat-dot" />
            <div className="banner-stat">
              <span className="banner-stat-number">30+</span>
              <span className="banner-stat-label">Topics</span>
            </div>
            <div className="banner-stat-dot" />
            <div className="banner-stat">
              <span className="banner-stat-number">300+</span>
              <span className="banner-stat-label">Scripts</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter bar*/}
      <div className="topics-filter-bar">
        {filters.map(f => (
          <button
            key={f}
            className={`filter-btn ${active === f ? 'filter-btn--active' : ''}`}
            onClick={() => setActive(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/*Topics grid */}
      <section className="topics-page-grid-section">
        <div className="topics-page-grid">
          {visible.map(topic => (
            <div
              className="topics-page-card"
              key={topic.id}
              style={{ '--card-accent': topic.accentColor, '--card-border': topic.borderColor }}
            >
              {/* Card header */}
              <div className="tpc-header">
                <div className="tpc-title-row">
                  <span className="tpc-symbol" style={{ color: topic.color }}>{topic.symbol}</span>
                  <h2 className="tpc-title">{topic.title}</h2>
                </div>
                <span className="tpc-count" style={{ color: topic.color, borderColor: topic.borderColor }}>
                  {topic.count} topics
                </span>
              </div>

              {/* Description */}
              <p className="tpc-desc">{topic.desc}</p>

              {/* Item chips */}
              <div className="tpc-chips">
                {topic.items.map(item => (
                  <span className="tpc-chip" key={item} style={{ borderColor: topic.borderColor, color: topic.color }}>
                    {item}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="tpc-footer">
                <Link href="/login">
                  <button className="tpc-btn" style={{ '--btn-color': topic.color, '--btn-bg': topic.accentColor }}>
                    Explore {topic.title} →
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state if filter returns nothing */}
        {visible.length === 0 && (
          <div className="topics-empty">
            <span>No topics found for this filter.</span>
          </div>
        )}
      </section>

      {/* Coming soon banner */}
      <section className="topics-coming-soon">
        <div className="tcs-inner">
          <span className="tcs-badge">⚡ Coming Soon</span>
          <h2 className="tcs-title">More Topics on the Way</h2>
          <p className="tcs-desc">
            We're actively adding new categories, scripts, and deep-dive guides.
            Sign up to get notified when new content drops.
          </p>
          <Link href="/login">
            <Button size="lg" radius="xl" className="btn-primary">
              Get Notified
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Topics;
