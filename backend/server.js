const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: "*" }));
app.use(express.json());

// --- Helpers ---

const bgClassMap = {
  maths: "subject-maths", english: "subject-english", science: "subject-science",
  sst: "subject-sst", hindi: "subject-hindi", computer: "subject-computer",
  physics: "subject-physics", chemistry: "subject-chemistry", biology: "subject-biology",
  economics: "subject-economics", evs: "subject-biology", gk: "subject-chemistry",
  accounts: "subject-english",
};

function makeSubject(id, name, icon, color, description, totalChapters, progress, score) {
  return {
    id, name, icon, color, description, totalChapters,
    bgClass: bgClassMap[id] || "subject-maths",
    progress,
    chaptersCompleted: Math.round((progress / 100) * totalChapters),
    score,
    totalTests: totalChapters * 4,
  };
}

function subjectsByClass(classId) {
  const id = parseInt(classId);
  if (id <= 3) {
    return [
      makeSubject("english", "English", "📚", "#A78BFA", "Language & Literature", 12, 72, 84),
      makeSubject("maths",   "Maths",   "🔢", "#3B82F6", "Numbers & Operations",  10, 60, 78),
      makeSubject("evs",     "EVS",     "🌱", "#10B981", "Environmental Studies", 13, 85, 91),
      makeSubject("hindi",   "Hindi",   "🗣️", "#EC4899", "Hindi Language",        10, 50, 70),
      makeSubject("gk",      "GK",      "🌍", "#F59E0B", "General Knowledge",     10, 90, 95),
    ];
  } else if (id <= 8) {
    return [
      makeSubject("maths",    "Maths",          "🔢",  "#3B82F6", "Mathematics",                    15, 65, 80),
      makeSubject("english",  "English",         "📖",  "#A78BFA", "English Language",               12, 78, 85),
      makeSubject("science",  "Science",         "🔬",  "#06B6D4", "General Science",                14, 55, 75),
      makeSubject("sst",      "Social Science",  "🗺️",  "#F97316", "History, Geography & Civics",    10, 70, 82),
      makeSubject("hindi",    "Hindi",           "🗣️",  "#EC4899", "Hindi Language",                 10, 60, 73),
      makeSubject("computer", "Computer",        "💻",  "#6366F1", "Computer Science",               8,  88, 92),
    ];
  } else {
    return [
      makeSubject("physics",   "Physics",         "⚡",  "#EF4444", "Mechanics, Waves & Electricity",      12, 58, 72),
      makeSubject("chemistry", "Chemistry",       "🧪",  "#F59E0B", "Organic, Inorganic & Physical",       14, 45, 68),
      makeSubject("biology",   "Biology",         "🧬",  "#10B981", "Life Sciences",                       13, 70, 81),
      makeSubject("maths",     "Maths",           "∑",   "#3B82F6", "Advanced Mathematics",                13, 62, 77),
      makeSubject("english",   "English",         "📝",  "#A78BFA", "Literature & Writing",                9,  80, 88),
      makeSubject("economics", "Economics",       "📊",  "#14B8A6", "Micro & Macroeconomics",              9,  55, 74),
      makeSubject("computer",  "Computer Science","💻",  "#6366F1", "Programming & Theory",                9,  90, 94),
      makeSubject("accounts",  "Accounts",        "🏦",  "#8B5CF6", "Financial Accounting",                11, 48, 65),
    ];
  }
}

const LEADERBOARD = [
  { rank: 1,  name: "Aryan Sharma",   class: "12", score: 15420, streak: 45, avatar: "AS", badge: "Legend"  },
  { rank: 2,  name: "Priya Patel",    class: "11", score: 14830, streak: 38, avatar: "PP", badge: "Titan"   },
  { rank: 3,  name: "Karan Singh",    class: "12", score: 14215, streak: 32, avatar: "KS", badge: "Master"  },
  { rank: 4,  name: "Ananya Verma",   class: "10", score: 13980, streak: 28, avatar: "AV", badge: "Master"  },
  { rank: 5,  name: "Rohan Gupta",    class: "11", score: 13540, streak: 25, avatar: "RG", badge: "Scholar" },
  { rank: 6,  name: "Shreya Nair",    class: "12", score: 12890, streak: 20, avatar: "SN", badge: "Scholar" },
  { rank: 7,  name: "Vikram Mehta",   class: "10", score: 12340, streak: 18, avatar: "VM", badge: "Brain"   },
  { rank: 8,  name: "You",            class: "11", score: 11750, streak: 12, avatar: "YO", badge: "Brain"   },
  { rank: 9,  name: "Neha Kapoor",    class: "9",  score: 11200, streak: 10, avatar: "NK", badge: "Scholar" },
  { rank: 10, name: "Rahul Jain",     class: "10", score: 10890, streak: 8,  avatar: "RJ", badge: "Explorer"},
  { rank: 11, name: "Pooja Sharma",   class: "11", score: 10540, streak: 7,  avatar: "PS", badge: "Explorer"},
  { rank: 12, name: "Aditya Kumar",   class: "12", score: 10120, streak: 6,  avatar: "AK", badge: "Explorer"},
];

const USER_PROFILE = {
  name: "Dhruv Chaudhary",
  email: "dhruvchaudhary296@gmail.com",
  class: 11, avatar: "DC",
  xp: 11750, level: 7, levelName: "Brain Forge",
  streak: 12, rank: 8,
  testsCompleted: 142, hoursStudied: 284, accuracy: 84,
  chaptersCompleted: 47,
};

// --- Routes ---

app.get("/health", (_req, res) => res.json({ status: "ok", service: "dc-nextgen-api" }));

app.get("/api/classes", (_req, res) => {
  const classes = Array.from({ length: 12 }, (_, i) => {
    const id = i + 1;
    const subjects = subjectsByClass(id);
    return {
      id,
      label: `Class ${id}`,
      subjects: subjects.length,
      chapters: subjects.reduce((a, s) => a + s.totalChapters, 0),
      tests: subjects.reduce((a, s) => a + s.totalTests, 0),
    };
  });
  res.json({ success: true, data: classes });
});

app.get("/api/class/:classId/subjects", (req, res) => {
  const id = parseInt(req.params.classId);
  if (isNaN(id) || id < 1 || id > 12)
    return res.status(400).json({ success: false, error: "Invalid class ID (1-12)" });
  res.json({ success: true, data: subjectsByClass(id) });
});

app.get("/api/user/profile", (_req, res) => {
  res.json({ success: true, data: USER_PROFILE });
});

app.get("/api/leaderboard", (_req, res) => {
  res.json({ success: true, data: LEADERBOARD });
});

app.listen(PORT, () => console.log(`DC NextGen API running on port ${PORT}`));
