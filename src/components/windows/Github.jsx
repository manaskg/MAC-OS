import { useState, useEffect, useMemo } from "react";
import githubData from "../../assets/github.json";
import MacWindow from "./MacWindow";
import "./github.scss";

// --- Contribution Graph Component ---
const ContributionGraph = () => {
  const weeks = 52;
  const days = 7;
  const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];
  const monthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Generate stable random contribution data
  const contributions = useMemo(() => {
    const data = [];
    const seed = 42;
    let s = seed;
    const pseudoRandom = () => {
      s = (s * 16807 + 0) % 2147483647;
      return s / 2147483647;
    };
    for (let w = 0; w < weeks; w++) {
      const week = [];
      for (let d = 0; d < days; d++) {
        const r = pseudoRandom();
        let level = 0;
        if (r > 0.65) level = 1;
        if (r > 0.78) level = 2;
        if (r > 0.88) level = 3;
        if (r > 0.94) level = 4;
        week.push(level);
      }
      data.push(week);
    }
    return data;
  }, []);

  const levelColors = [
    "#161b22",
    "#0e4429",
    "#006d32",
    "#26a641",
    "#39d353",
  ];

  const totalContributions = useMemo(
    () =>
      contributions.reduce(
        (sum, week) =>
          sum + week.reduce((ws, d) => ws + (d > 0 ? d * 2 + 1 : 0), 0),
        0
      ),
    [contributions]
  );

  return (
    <div className="gh-contributions">
      <h2 className="gh-section-title">
        {totalContributions} contributions in the last year
      </h2>
      <div className="gh-graph-wrapper">
        <div className="gh-graph-labels">
          {dayLabels.map((l, i) => (
            <span key={i} className="gh-day-label">
              {l}
            </span>
          ))}
        </div>
        <div className="gh-graph-scroll">
          <div className="gh-month-labels">
            {monthLabels.map((m, i) => (
              <span key={i} className="gh-month-label">
                {m}
              </span>
            ))}
          </div>
          <div className="gh-graph-grid">
            {contributions.map((week, wi) => (
              <div key={wi} className="gh-graph-col">
                {week.map((level, di) => (
                  <div
                    key={di}
                    className="gh-graph-cell"
                    style={{ backgroundColor: levelColors[level] }}
                    title={`${level > 0 ? level * 2 + 1 : "No"} contributions`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="gh-graph-legend">
        <span>Less</span>
        {levelColors.map((c, i) => (
          <div
            key={i}
            className="gh-graph-cell"
            style={{ backgroundColor: c }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
};

// --- Pinned Repo Card ---
const PinnedRepo = ({ data }) => {
  const langColors = {
    React: "#61dafb",
    "Node.js": "#68a063",
    JavaScript: "#f7df1e",
    Python: "#3776ab",
    Java: "#b07219",
    "Express.js": "#ffffff",
    MongoDB: "#47a248",
    "Gemini API": "#8e75ff",
    "REST API": "#00bcd4",
    Redis: "#dc382d",
    Mongoose: "#880000",
    Pandas: "#150458",
    NumPy: "#013243",
    Jupyter: "#f37626",
    "Data Science": "#4caf50",
    DSA: "#ff5722",
    Algorithms: "#ff9800",
    "Problem Solving": "#e91e63",
    AI: "#9c27b0",
    "Tailwind CSS": "#06b6d4",
    HTML: "#e34c26",
    CSS: "#264de4",
    SCSS: "#cc6699",
  };

  const primaryLang = data.tags?.[0] || "JavaScript";
  const langColor = langColors[primaryLang] || "#8b949e";

  return (
    <a
      href={data.repoLink}
      target="_blank"
      rel="noopener noreferrer"
      className="gh-pinned-card"
    >
      <div className="gh-pinned-header">
        <svg
          viewBox="0 0 16 16"
          width="16"
          height="16"
          className="gh-repo-icon"
        >
          <path
            fill="#8b949e"
            d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"
          />
        </svg>
        <span className="gh-pinned-name">{data.title}</span>
      </div>
      <p className="gh-pinned-desc">{data.description}</p>
      <div className="gh-pinned-meta">
        <span className="gh-pinned-lang">
          <span
            className="gh-lang-dot"
            style={{ backgroundColor: langColor }}
          />
          {primaryLang}
        </span>
        <span className="gh-pinned-stars">
          <svg viewBox="0 0 16 16" width="16" height="16">
            <path
              fill="#8b949e"
              d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"
            />
          </svg>
          {data.id * 3 + 2}
        </span>
        <span className="gh-pinned-forks">
          <svg viewBox="0 0 16 16" width="16" height="16">
            <path
              fill="#8b949e"
              d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 0-1.5 0v.878a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 5 6.25v-.878a2.25 2.25 0 1 0-1.5 0ZM8 1.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM3.25 1a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5ZM5 9.872v-.878a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0-.75.75v.878a2.25 2.25 0 1 0 1.5 0ZM1.25 11a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z"
            />
          </svg>
          {data.id}
        </span>
      </div>
    </a>
  );
};

// --- Tab Content: Overview ---
const OverviewTab = () => (
  <div className="gh-tab-content">
    <div className="gh-pinned-section">
      <div className="gh-pinned-section-header">
        <h2>Pinned</h2>
      </div>
      <div className="gh-pinned-grid">
        {githubData.map((project) => (
          <PinnedRepo key={project.id} data={project} />
        ))}
      </div>
    </div>
    <ContributionGraph />
  </div>
);

// --- Tab Content: Repositories ---
const ReposTab = () => (
  <div className="gh-tab-content gh-repos-tab">
    <div className="gh-repos-search">
      <input type="text" placeholder="Find a repository…" readOnly />
      <div className="gh-repos-filters">
        <button>Type ▾</button>
        <button>Language ▾</button>
        <button>Sort ▾</button>
      </div>
    </div>
    <div className="gh-repos-list">
      {githubData.map((repo) => (
        <a
          key={repo.id}
          href={repo.repoLink}
          target="_blank"
          rel="noopener noreferrer"
          className="gh-repo-item"
        >
          <div className="gh-repo-item-main">
            <h3 className="gh-repo-item-name">{repo.title}</h3>
            {repo.id <= 2 && <span className="gh-repo-badge">Public</span>}
          </div>
          <p className="gh-repo-item-desc">{repo.description}</p>
          <div className="gh-repo-item-meta">
            <span className="gh-pinned-lang">
              <span
                className="gh-lang-dot"
                style={{
                  backgroundColor:
                    repo.tags[0] === "React"
                      ? "#61dafb"
                      : repo.tags[0] === "Python"
                        ? "#3776ab"
                        : repo.tags[0] === "Java"
                          ? "#b07219"
                          : "#f7df1e",
                }}
              />
              {repo.tags[0]}
            </span>
            <span className="gh-repo-item-updated">
              Updated {repo.id <= 2 ? "this week" : "last month"}
            </span>
          </div>
        </a>
      ))}
    </div>
  </div>
);

// --- Main GitHub Component ---
const Github = ({ windowName, setWindowsState }) => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: (
        <svg viewBox="0 0 16 16" width="16" height="16">
          <path
            fill="currentColor"
            d="M0 1.75A.75.75 0 0 1 .75 1h4.253c1.227 0 2.317.59 3 1.501A3.743 3.743 0 0 1 11.006 1h4.245a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-4.507a2.25 2.25 0 0 0-1.591.659l-.622.621a.75.75 0 0 1-1.06 0l-.622-.621A2.25 2.25 0 0 0 5.258 13H.75a.75.75 0 0 1-.75-.75Zm7.251 10.324.004-5.073-.002-2.253A2.25 2.25 0 0 0 5.003 2.5H1.5v9h3.757a3.75 3.75 0 0 1 1.994.574ZM8.755 4.75l-.004 7.322a3.752 3.752 0 0 1 1.992-.572H14.5v-9h-3.495a2.25 2.25 0 0 0-2.25 2.25Z"
          />
        </svg>
      ),
    },
    {
      id: "repositories",
      label: "Repositories",
      count: githubData.length,
      icon: (
        <svg viewBox="0 0 16 16" width="16" height="16">
          <path
            fill="currentColor"
            d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"
          />
        </svg>
      ),
    },
  ];

  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      case "repositories":
        return <ReposTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <MacWindow
      width="72vw"
      height="75vh"
      windowName={windowName}
      setWindowsState={setWindowsState}
      title="GitHub — manaskg"
    >
      <div className="gh-window">
        {/* GitHub Header Bar */}
        <div className="gh-header">
          <div className="gh-header-inner">
            <svg
              height="32"
              viewBox="0 0 16 16"
              width="32"
              className="gh-logo"
            >
              <path
                fill="#ffffff"
                d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"
              />
            </svg>
            <div className="gh-header-search">
              <svg viewBox="0 0 16 16" width="16" height="16">
                <path
                  fill="#8b949e"
                  d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z"
                />
              </svg>
              <span>Type / to search</span>
            </div>
            <a
              href="https://github.com/manaskg"
              target="_blank"
              rel="noopener noreferrer"
              className="gh-header-profile-link"
              title="Visit real GitHub profile"
            >
              <img
                src="https://github.com/manaskg.png"
                alt="Profile"
                className="gh-header-avatar"
              />
            </a>
          </div>
        </div>

        {/* Profile + Content Layout */}
        <div className="gh-body">
          {/* Left Sidebar - Profile */}
          <aside className="gh-sidebar">
            <div className="gh-avatar-wrapper">
              <img
                src="https://github.com/manaskg.png"
                alt="Manas Kumar Ghosh"
                className="gh-avatar"
              />
              <div className="gh-status-emoji" title="Working on exciting projects">
                🚀
              </div>
            </div>
            <div className="gh-profile-info">
              <h1 className="gh-display-name">Manas Kumar Ghosh</h1>
              <p className="gh-username">manaskg</p>
              <p className="gh-bio">
                CSE Student @ Brainware University • Full-Stack Developer •
                AI Enthusiast • IIT Bombay Research Intern
              </p>
              <a
                href="https://github.com/manaskg"
                target="_blank"
                rel="noopener noreferrer"
                className="gh-follow-btn"
              >
                <svg viewBox="0 0 16 16" width="16" height="16">
                  <path
                    fill="currentColor"
                    d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"
                  />
                </svg>
                Visit GitHub Profile
              </a>
            </div>
            <div className="gh-details">
              <div className="gh-detail-item">
                <svg viewBox="0 0 16 16" width="16" height="16">
                  <path
                    fill="#8b949e"
                    d="M1.5 8a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0ZM8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0ZM6.379 5.227A.25.25 0 0 0 6 5.442v5.117a.25.25 0 0 0 .379.214l4.264-2.559a.25.25 0 0 0 0-.428L6.379 5.227Z"
                  />
                </svg>
                <span>Kolkata, India</span>
              </div>
              <div className="gh-detail-item">
                <svg viewBox="0 0 16 16" width="16" height="16">
                  <path
                    fill="#8b949e"
                    d="M1.75 2h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 14.25 14H1.75A1.75 1.75 0 0 1 0 12.25v-8.5C0 2.784.784 2 1.75 2ZM1.5 12.251c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V5.809L8.38 9.397a.75.75 0 0 1-.76 0L1.5 5.809v6.442Zm13-8.181v-.32a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25v.32L8 7.88Z"
                  />
                </svg>
                <span>manaskumarghosh91@gmail.com</span>
              </div>
              <div className="gh-detail-item">
                <svg viewBox="0 0 16 16" width="16" height="16">
                  <path
                    fill="#8b949e"
                    d="M7.775 3.275a.75.75 0 0 0 1.06 1.06l1.25-1.25a2 2 0 1 1 2.83 2.83l-2.5 2.5a2 2 0 0 1-2.83 0 .75.75 0 0 0-1.06 1.06 3.5 3.5 0 0 0 4.95 0l2.5-2.5a3.5 3.5 0 0 0-4.95-4.95l-1.25 1.25Zm-4.69 9.64a2 2 0 0 1 0-2.83l2.5-2.5a2 2 0 0 1 2.83 0 .75.75 0 0 0 1.06-1.06 3.5 3.5 0 0 0-4.95 0l-2.5 2.5a3.5 3.5 0 0 0 4.95 4.95l1.25-1.25a.75.75 0 0 0-1.06-1.06l-1.25 1.25a2 2 0 0 1-2.83 0Z"
                  />
                </svg>
                <a
                  href="https://www.linkedin.com/in/manaskumarghosh/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  linkedin.com/in/manaskumarghosh
                </a>
              </div>
            </div>

            <div className="gh-stats-row">
              <div className="gh-stat">
                <svg viewBox="0 0 16 16" width="16" height="16">
                  <path
                    fill="#8b949e"
                    d="M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4.001 4.001 0 0 0-6.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 4.6 8.048 3.5 3.5 0 0 1 2 5.5ZM5.5 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm5.5.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1H12v1.5h1.5a.5.5 0 0 1 0 1H12V9a.5.5 0 0 1-1 0V4.5Z"
                  />
                </svg>
                <strong>12</strong>
                <span>followers</span>
              </div>
              <span className="gh-stat-dot">·</span>
              <div className="gh-stat">
                <strong>8</strong>
                <span>following</span>
              </div>
            </div>
          </aside>

          {/* Right Content */}
          <div className="gh-content">
            {/* Tabs */}
            <nav className="gh-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`gh-tab ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="gh-tab-count">{tab.count}</span>
                  )}
                </button>
              ))}
            </nav>
            {renderTab()}
          </div>
        </div>
      </div>
    </MacWindow>
  );
};

export default Github;
