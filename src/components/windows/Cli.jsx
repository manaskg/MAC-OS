import MacWindow from "./MacWindow";
import terminalModule from "react-console-emulator";
import "./cli.scss";

const Terminal = terminalModule.default;

const Cli = ({ windowName, setWindowsState }) => {
  const commands = {
    about: {
      description: "Learn about Manas",
      usage: "about",
      fn: () =>
        `Hi! I'm Manas Kumar Ghosh 👋

I'm a Computer Science & Engineering student at Brainware University,
passionate about software development, AI, and building practical
web applications.

I enjoy working with React, Node.js, Python, JavaScript and AI APIs,
while continuously improving my problem-solving and development skills.`,
    },

    whoami: {
      description: "Display my developer profile",
      usage: "whoami",
      fn: () =>
        `Manas Kumar Ghosh

Role      : CSE Student & Developer
University: Brainware University, Kolkata
CGPA      : 9.4 / 10
Focus     : Web Development • AI • Software Engineering`,
    },

    education: {
      description: "View my education",
      usage: "education",
      fn: () =>
        `🎓 B.Tech in Computer Science & Engineering
Brainware University, Kolkata
Aug 2023 - Aug 2027 (Expected)
CGPA: 9.4 / 10

📚 Higher Secondary
Nebadhai High School, Duttapukur
WBCHSE
Percentage: 92%

📚 Secondary
Nebadhai High School, Duttapukur
WBBSE
Percentage: 94%`,
    },

    skills: {
      description: "List my technical skills",
      usage: "skills",
      fn: () =>
        `Languages:
  C • Java • Python • JavaScript

Frontend:
  HTML • CSS • SCSS • Tailwind CSS • React.js

Backend & Databases:
  Node.js • Express.js • REST APIs
  Mongoose • MongoDB • PostgreSQL • Redis

Tools:
  Git • GitHub • Postman`,
    },

    internship: {
      description: "View my IIT Bombay experience",
      usage: "internship",
      fn: () =>
        `💼 Project Research Intern
Indian Institute of Technology Bombay (IIT Bombay)
Jan 2026 - Jun 2026 | Mumbai, India

• Worked on transportation and mobility analytics.
• Processed large-scale survey datasets using Python, R,
  Pandas, NumPy and Excel.
• Worked with econometric and causal inference models including
  Difference-in-Differences and logistic regression.
• Built automated Python web-scraping pipelines.
• Collaborated with research mentors on data analysis,
  model validation and interpretation.`,
    },

    projects: {
      description: "View my featured projects",
      usage: "projects",
      fn: () =>
        `🚜 1. CropShield AI
   AI-powered agronomy platform
   React • Google Gemini API

   • Pest detection
   • Crop guidance
   • Yield-related insights
   • Multilingual support
   • Kisan Mitra voice assistant

🤖 2. AI-Powered Code Reviewer
   AI-based code review platform
   React • Node.js • Express.js

   • Code submission & analysis
   • AI-generated review feedback
   • REST APIs
   • Syntax highlighting
   • Interactive review interface`,
    },

    achievements: {
      description: "View my achievements",
      usage: "achievements",
      fn: () =>
        `🏆 Theme Award — Sustainability
   SBI College Youth Ideathon at IIT Delhi (2025)
   Top 100 teams from 15,000+ ideas

🏆 Top 30 Finalist
   STPI x Techniche Entrepreneurship Hackathon
   IIT Guwahati (2025)

📜 NPTEL Certified
   Problem Solving Through Programming in C (2024)
   Prof. Anupam Basu`,
    },

    experience: {
      description: "View my professional experience",
      usage: "experience",
      fn: () =>
        `2026
│
├── Project Research Intern
│   IIT Bombay
│   Jan 2026 - Jun 2026
│
│   Research • Data Analytics • Python
│   Econometrics • Causal Inference
│
└── Currently
    Building projects, learning,
    and preparing for the next opportunity 🚀`,
    },

    contact: {
      description: "Get my contact information",
      usage: "contact",
      fn: () =>
        `📧 Email
   manaskumarghosh91@gmail.com

📱 Phone
   +91 6289034249

📍 Location
   Kolkata, India

Feel free to reach out!`,
    },

    github: {
      description: "Open my GitHub profile",
      usage: "github",
      fn: () => {
        window.open("https://github.com/manaskg", "_blank");
        return "Opening GitHub... 🚀";
      },
    },

    linkedin: {
      description: "Open my LinkedIn profile",
      usage: "linkedin",
      fn: () => {
        window.open("https://www.linkedin.com/in/manaskumarghosh", "_blank");
        return "Opening LinkedIn... 🔗";
      },
    },

    resume: {
      description: "View or download my resume",
      usage: "resume",
      fn: () => {
        return "Resume section coming soon 📄";
      },
    },

    social: {
      description: "Show my online profiles",
      usage: "social",
      fn: () =>
        `🌐 Online Profiles

GitHub   : github.com/manaskg
LinkedIn : Search for "Manas Kumar Ghosh"

Use:
  github
  linkedin`,
    },

    echo: {
      description: "Print a message",
      usage: "echo <message>",
      fn: (...args) => args.join(" "),
    },
  };

  const welcomeMessage = `
╔════════════════════════════════════════════════════╗
║                                                    ║
║       Welcome to Manas Kumar Ghosh's CLI           ║
║                                                    ║
╚════════════════════════════════════════════════════╝
Welcome to my interactive portfolio terminal.
Try these commands:

  about        → Learn about me
  skills       → View my tech stack
  projects     → Explore my projects
  internship   → View my IIT Bombay experience
  achievements → See my achievements
  education    → View my education
  contact      → Get in touch
  github       → Open GitHub
  linkedin     → Open LinkedIn

Type 'help' to see all available commands.

Happy exploring! 🚀
`;

  return (
    <MacWindow width="60vw" height="60vh" windowName={windowName} setWindowsState={setWindowsState}>
      <div className="cli-window">
        <Terminal
          commands={commands}
          welcomeMessage={welcomeMessage}
          promptLabel={"manas@portfolio:~$"}
          promptLabelStyle={{ color: "#00ff88" }}
        />
      </div>
    </MacWindow>
  );
};

export default Cli;
