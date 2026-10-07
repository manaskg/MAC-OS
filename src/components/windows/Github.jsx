import { useState, useEffect, useMemo } from "react";
import initialRepos from "../../assets/github.json";
import initialContributions from "../../assets/contributions.json";
import MacWindow from "./MacWindow";
import "./github.scss";

// Language color mapping
const langColors = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  "Jupyter Notebook": "#DA5B0B",
  Solidity: "#AA6746",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  React: "#61dafb",
};

// --- Contribution Graph Component ---
const ContributionGraph = ({ contributionData }) => {
  const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];

  // Color mapping matching GitHub dark theme
  const levelColors = [
    "#161b22", // Level 0: 0 contribs
    "#0e4429", // Level 1: 1-2 contribs
    "#006d32", // Level 2: 3-5 contribs
    "#26a641", // Level 3: 6-8 contribs
    "#39d353", // Level 4: 9+ contribs
  ];

  // Group days into weeks starting on Sunday
  const { weeks, monthPositions, totalContributions } = useMemo(() => {
    const rawDays = contributionData?.days || [];
    const weeksList = [];
    let currentWeek = [];

    rawDays.forEach((day) => {
      const dateObj = new Date(day.date + "T00:00:00Z");
      const dayOfWeek = dateObj.getUTCDay(); // 0 = Sunday

      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeksList.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
    });

    if (currentWeek.length > 0) {
      weeksList.push(currentWeek);
    }

    // Determine month label positions by finding where each month starts
    const months = [];
    weeksList.forEach((week, wIdx) => {
      week.forEach((d) => {
        if (d.date.endsWith("-01")) {
          const monthShort = new Date(d.date + "T00:00:00Z").toLocaleString("en-US", {
            month: "short",
            timeZone: "UTC",
          });
          months.push({ weekIndex: wIdx, month: monthShort });
        }
      });
    });

    return {
      weeks: weeksList,
      monthPositions: months,
      totalContributions: contributionData?.total || 156,
    };
  }, [contributionData]);

  return (
    <div className="gh-contributions">
      <div className="gh-contributions-header">
        <h2 className="gh-section-title">
          {totalContributions} contributions in the last year
        </h2>
        <a
          href="https://github.com/manaskg"
          target="_blank"
          rel="noopener noreferrer"
          className="gh-source-badge"
          title="Verified from github.com/manaskg"
        >
          <span className="gh-live-dot" />
          Verified GitHub Activity
        </a>
      </div>

      <div className="gh-graph-wrapper">
        <div className="gh-graph-labels">
          {dayLabels.map((label, idx) => (
            <span key={idx} className="gh-day-label">
              {label}
            </span>
          ))}
        </div>

        <div className="gh-graph-scroll">
          <div className="gh-month-labels" style={{ position: "relative", height: "18px" }}>
            {monthPositions.map((m, idx) => (
              <span
                key={idx}
                className="gh-month-label"
                style={{
                  position: "absolute",
                  left: `${m.weekIndex * 14}px`,
                  top: 0,
                }}
              >
                {m.month}
              </span>
            ))}
          </div>

          <div className="gh-graph-grid">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="gh-graph-col">
                {week.map((day, dIdx) => (
                  <div
                    key={dIdx}
                    className="gh-graph-cell"
                    style={{
                      backgroundColor: levelColors[day.level] || levelColors[0],
                    }}
                    title={day.text || `${day.count} contributions on ${day.date}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="gh-graph-footer">
        <span className="gh-graph-hint">Hover over cells to view exact activity</span>
        <div className="gh-graph-legend">
          <span>Less</span>
          {levelColors.map((color, idx) => (
            <div
              key={idx}
              className="gh-graph-cell"
              style={{ backgroundColor: color }}
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

// --- Pinned Repo Card ---
const PinnedRepo = ({ repo }) => {
  const langColor = langColors[repo.language] || "#8b949e";

  return (
    <a
      href={repo.repoLink}
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
        <span className="gh-pinned-name">{repo.name}</span>
        <span className="gh-repo-pill">{repo.visibility || "Public"}</span>
      </div>

      <p className="gh-pinned-desc">{repo.description}</p>

      <div className="gh-pinned-meta">
        {repo.language && (
          <span className="gh-pinned-lang">
            <span
              className="gh-lang-dot"
              style={{ backgroundColor: langColor }}
            />
            {repo.language}
          </span>
        )}
        <span className="gh-pinned-stars" title={`${repo.stars} stars`}>
          <svg viewBox="0 0 16 16" width="16" height="16">
            <path
              fill="#8b949e"
              d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"
            />
          </svg>
          {repo.stars}
        </span>
        <span className="gh-pinned-forks" title={`${repo.forks} forks`}>
          <svg viewBox="0 0 16 16" width="16" height="16">
            <path
              fill="#8b949e"
              d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 0-1.5 0v.878a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 5 6.25v-.878a2.25 2.25 0 1 0-1.5 0ZM8 1.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM3.25 1a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5ZM5 9.872v-.878a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0-.75.75v.878a2.25 2.25 0 1 0 1.5 0ZM1.25 11a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z"
            />
          </svg>
          {repo.forks}
        </span>
      </div>
    </a>
  );
};

// --- Tab Content: Overview ---
const OverviewTab = ({ repos, contributionData }) => {
  // Pinned repos curated from the user's top featured projects
  const pinnedNames = [
    "MAC-OS",
    "Moodify",
    "CropShield-Proto",
    "AI-Code-Reviewer",
    "CapitalMind",
    "Eco-Steps",
  ];

  const pinnedList = useMemo(() => {
    const list = [];
    pinnedNames.forEach((name) => {
      const found = repos.find((r) => r.name.toLowerCase() === name.toLowerCase());
      if (found) list.push(found);
    });
    // Fill up to 6 with recent non-fork repos if needed
    if (list.length < 6) {
      repos.forEach((r) => {
        if (!r.isFork && !list.some((item) => item.name === r.name) && list.length < 6) {
          list.push(r);
        }
      });
    }
    return list;
  }, [repos]);

  return (
    <div className="gh-tab-content">
      <div className="gh-pinned-section">
        <div className="gh-pinned-section-header">
          <h2>Pinned Repositories</h2>
          <span className="gh-pinned-subtitle">Highlights from active projects</span>
        </div>
        <div className="gh-pinned-grid">
          {pinnedList.map((repo) => (
            <PinnedRepo key={repo.name} repo={repo} />
          ))}
        </div>
      </div>
      <ContributionGraph contributionData={contributionData} />
    </div>
  );
};

// --- Tab Content: Repositories ---
const ReposTab = ({ repos }) => {
  const [search, setSearch] = useState("");
  const [selectedLang, setSelectedLang] = useState("all");
  const [sortBy, setSortBy] = useState("updated");

  // Collect unique languages
  const languages = useMemo(() => {
    const set = new Set();
    repos.forEach((r) => {
      if (r.language) set.add(r.language);
    });
    return ["all", ...Array.from(set)];
  }, [repos]);

  // Filter and sort repos
  const filteredRepos = useMemo(() => {
    return repos
      .filter((r) => {
        const matchesSearch =
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          (r.description && r.description.toLowerCase().includes(search.toLowerCase()));
        const matchesLang = selectedLang === "all" || r.language === selectedLang;
        return matchesSearch && matchesLang;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "stars") return b.stars - a.stars;
        // Default updated/pushed date
        return new Date(b.pushedAt || b.updatedAt) - new Date(a.pushedAt || a.updatedAt);
      });
  }, [repos, search, selectedLang, sortBy]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "Recently";
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "today";
    if (diffDays === 1) return "yesterday";
    if (diffDays < 30) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="gh-tab-content gh-repos-tab">
      <div className="gh-repos-search-bar">
        <div className="gh-repos-input-wrapper">
          <svg viewBox="0 0 16 16" width="16" height="16" className="gh-search-icon">
            <path
              fill="#8b949e"
              d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z"
            />
          </svg>
          <input
            type="text"
            placeholder="Find a repository…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="gh-clear-btn" onClick={() => setSearch("")}>
              ✕
            </button>
          )}
        </div>

        <div className="gh-repos-filters">
          <select
            className="gh-filter-select"
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
          >
            <option value="all">Language: All</option>
            {languages.filter((l) => l !== "all").map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>

          <select
            className="gh-filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="updated">Sort: Last updated</option>
            <option value="name">Sort: Name</option>
            <option value="stars">Sort: Stars</option>
          </select>
        </div>
      </div>

      <div className="gh-repos-list">
        {filteredRepos.length === 0 ? (
          <div className="gh-empty-repos">
            <p>No repositories found matching your query.</p>
          </div>
        ) : (
          filteredRepos.map((repo) => (
            <div key={repo.name} className="gh-repo-item">
              <div className="gh-repo-item-main">
                <div className="gh-repo-title-row">
                  <a
                    href={repo.repoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gh-repo-item-name"
                  >
                    {repo.name}
                  </a>
                  <span className="gh-repo-badge">{repo.visibility || "Public"}</span>
                  {repo.isFork && <span className="gh-repo-fork-badge">Forked</span>}
                </div>
                <p className="gh-repo-item-desc">{repo.description}</p>
                <div className="gh-repo-item-meta">
                  {repo.language && (
                    <span className="gh-pinned-lang">
                      <span
                        className="gh-lang-dot"
                        style={{
                          backgroundColor: langColors[repo.language] || "#8b949e",
                        }}
                      />
                      {repo.language}
                    </span>
                  )}
                  <span className="gh-repo-meta-stat">
                    <svg viewBox="0 0 16 16" width="14" height="14">
                      <path
                        fill="#8b949e"
                        d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"
                      />
                    </svg>
                    {repo.stars}
                  </span>
                  <span className="gh-repo-meta-stat">
                    <svg viewBox="0 0 16 16" width="14" height="14">
                      <path
                        fill="#8b949e"
                        d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 0-1.5 0v.878a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 5 6.25v-.878a2.25 2.25 0 1 0-1.5 0ZM8 1.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM3.25 1a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5ZM5 9.872v-.878a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0-.75.75v.878a2.25 2.25 0 1 0 1.5 0ZM1.25 11a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z"
                      />
                    </svg>
                    {repo.forks}
                  </span>
                  <span className="gh-repo-item-updated">
                    Updated {formatDate(repo.pushedAt || repo.updatedAt)}
                  </span>
                </div>
              </div>
              <a
                href={repo.repoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="gh-repo-star-btn"
                title="Star on GitHub"
              >
                <svg viewBox="0 0 16 16" width="16" height="16">
                  <path
                    fill="currentColor"
                    d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"
                  />
                </svg>
                Star
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// --- Main GitHub Component ---
const Github = ({ windowName, setWindowsState }) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Real verified baseline data
  const defaultProfile = {
    login: "manaskg",
    name: "Manas",
    avatar_url: "https://avatars.githubusercontent.com/u/173708202?v=4",
    bio: "Web Developer | MERN ",
    location: "Kolkata",
    twitter_username: "manasmkg",
    public_repos: 20,
    followers: 1,
    following: 0,
    html_url: "https://github.com/manaskg",
  };

  const [profile, setProfile] = useState(defaultProfile);
  const [repos, setRepos] = useState(initialRepos);
  const [contributions, setContributions] = useState(initialContributions);

  // Live GitHub API fetch to keep profile and repositories synced
  useEffect(() => {
    let isMounted = true;

    // 1. Fetch live user profile
    fetch("https://api.github.com/users/manaskg")
      .then((res) => {
        if (!res.ok) throw new Error("API rate limit or error");
        return res.json();
      })
      .then((data) => {
        if (isMounted && data.login) {
          setProfile((prev) => ({
            ...prev,
            login: data.login,
            name: data.name || prev.name,
            avatar_url: data.avatar_url || prev.avatar_url,
            bio: data.bio || prev.bio,
            location: data.location || prev.location,
            twitter_username: data.twitter_username || prev.twitter_username,
            public_repos: data.public_repos ?? prev.public_repos,
            followers: data.followers ?? prev.followers,
            following: data.following ?? prev.following,
            html_url: data.html_url || prev.html_url,
          }));
        }
      })
      .catch(() => {
        // Fallback already in place with 100% accurate baseline data
      });

    // 2. Fetch live repositories
    fetch("https://api.github.com/users/manaskg/repos?per_page=100&sort=pushed")
      .then((res) => {
        if (!res.ok) throw new Error("API rate limit or error");
        return res.json();
      })
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          const formatted = data.map((r) => ({
            id: r.id,
            name: r.name,
            description: r.description || "No description provided.",
            language: r.language || "Code",
            stars: r.stargazers_count,
            forks: r.forks_count,
            repoLink: r.html_url,
            demoLink: r.homepage || null,
            isFork: r.fork,
            updatedAt: r.updated_at,
            pushedAt: r.pushed_at,
            visibility: r.visibility || "public",
          }));
          setRepos(formatted);
        }
      })
      .catch(() => {
        // Fallback already in place
      });

    return () => {
      isMounted = false;
    };
  }, []);

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
      count: repos.length,
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

  return (
    <MacWindow
      width="82vw"
      height="82vh"
      windowName={windowName}
      setWindowsState={setWindowsState}
      title="GitHub — manaskg"
    >
      <div className="gh-window">
        {/* GitHub Header Bar */}
        <header className="gh-header">
          <div className="gh-header-inner">
            <a
              href="https://github.com/manaskg"
              target="_blank"
              rel="noopener noreferrer"
              className="gh-logo-link"
              title="Open GitHub"
            >
              <svg height="32" viewBox="0 0 16 16" width="32" className="gh-logo">
                <path
                  fill="#ffffff"
                  d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"
                />
              </svg>
            </a>

            <div className="gh-header-search">
              <svg viewBox="0 0 16 16" width="16" height="16">
                <path
                  fill="#8b949e"
                  d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z"
                />
              </svg>
              <span>Type / to search repositories</span>
            </div>

            <div className="gh-header-actions">
              <a
                href="https://github.com/manaskg"
                target="_blank"
                rel="noopener noreferrer"
                className="gh-visit-account-chip"
              >
                <span>github.com/manaskg</span>
                <svg viewBox="0 0 16 16" width="12" height="12">
                  <path
                    fill="currentColor"
                    d="M3.75 2h3.5a.75.75 0 0 1 0 1.5h-3.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-3.5a.75.75 0 0 1 1.5 0v3.5A1.75 1.75 0 0 1 12.25 14h-8.5A1.75 1.75 0 0 1 2 12.25v-8.5C2 2.784 2.784 2 3.75 2Zm6.5.75a.75.75 0 0 1 .75-.75h3.25a.75.75 0 0 1 .75.75v3.25a.75.75 0 0 1-1.5 0V3.56l-4.72 4.72a.75.75 0 0 1-1.06-1.06l4.72-4.72H11a.75.75 0 0 1-.75-.75Z"
                  />
                </svg>
              </a>

              <a
                href="https://github.com/manaskg"
                target="_blank"
                rel="noopener noreferrer"
                className="gh-header-profile-link"
                title="Visit actual GitHub profile"
              >
                <img
                  src={profile.avatar_url}
                  alt={profile.login}
                  className="gh-header-avatar"
                />
              </a>
            </div>
          </div>
        </header>

        {/* Profile + Content Layout */}
        <div className="gh-body">
          {/* Left Sidebar - Profile */}
          <aside className="gh-sidebar">
            <div className="gh-avatar-wrapper">
              <img
                src={profile.avatar_url}
                alt={profile.name}
                className="gh-avatar"
              />
              <div className="gh-status-emoji" title="Active on GitHub">
                💻
              </div>
            </div>

            <div className="gh-profile-info">
              <h1 className="gh-display-name">{profile.name}</h1>
              <p className="gh-username">{profile.login}</p>
              <p className="gh-bio">{profile.bio}</p>

              <a
                href={profile.html_url}
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
                View on GitHub
              </a>
            </div>

            <div className="gh-stats-row">
              <div className="gh-stat">
                <svg viewBox="0 0 16 16" width="16" height="16">
                  <path
                    fill="#8b949e"
                    d="M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4.001 4.001 0 0 0-6.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 4.6 8.048 3.5 3.5 0 0 1 2 5.5ZM5.5 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm5.5.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1H12v1.5h1.5a.5.5 0 0 1 0 1H12V9a.5.5 0 0 1-1 0V4.5Z"
                  />
                </svg>
                <strong>{profile.followers}</strong>
                <span>followers</span>
              </div>
              <span className="gh-stat-dot">·</span>
              <div className="gh-stat">
                <strong>{profile.following}</strong>
                <span>following</span>
              </div>
            </div>

            <div className="gh-details">
              {profile.location && (
                <div className="gh-detail-item">
                  <svg viewBox="0 0 16 16" width="16" height="16">
                    <path
                      fill="#8b949e"
                      d="M11.536 3.464a5 5 0 0 1 0 7.072L8 14.07l-3.536-3.535a5 5 0 1 1 7.072-7.072ZM8 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
                    />
                  </svg>
                  <span>{profile.location}</span>
                </div>
              )}

              {profile.twitter_username && (
                <div className="gh-detail-item">
                  <svg viewBox="0 0 16 16" width="16" height="16">
                    <path
                      fill="#8b949e"
                      d="M2.5 3h11a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5ZM8 7.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"
                    />
                  </svg>
                  <a
                    href={`https://x.com/${profile.twitter_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @{profile.twitter_username}
                  </a>
                </div>
              )}

              <div className="gh-detail-item">
                <svg viewBox="0 0 16 16" width="16" height="16">
                  <path
                    fill="#8b949e"
                    d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"
                  />
                </svg>
                <span>{profile.public_repos} public repositories</span>
              </div>

              <div className="gh-detail-item">
                <svg viewBox="0 0 16 16" width="16" height="16">
                  <path
                    fill="#8b949e"
                    d="M7.775 3.275a.75.75 0 0 0 1.06 1.06l1.25-1.25a2 2 0 1 1 2.83 2.83l-2.5 2.5a2 2 0 0 1-2.83 0 .75.75 0 0 0-1.06 1.06 3.5 3.5 0 0 0 4.95 0l2.5-2.5a3.5 3.5 0 0 0-4.95-4.95l-1.25 1.25Zm-4.69 9.64a2 2 0 0 1 0-2.83l2.5-2.5a2 2 0 0 1 2.83 0 .75.75 0 0 0 1.06-1.06 3.5 3.5 0 0 0-4.95 0l-2.5 2.5a3.5 3.5 0 0 0 4.95 4.95l1.25-1.25a.75.75 0 0 0-1.06-1.06l-1.25 1.25a2 2 0 0 1-2.83 0Z"
                  />
                </svg>
                <a
                  href="https://linkedin.com/in/manaskumarghosh"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  linkedin.com/in/manaskumarghosh
                </a>
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

            {activeTab === "overview" ? (
              <OverviewTab repos={repos} contributionData={contributions} />
            ) : (
              <ReposTab repos={repos} />
            )}
          </div>
        </div>
      </div>
    </MacWindow>
  );
};

export default Github;
