const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: "*" }));
app.use(express.json());

// --- Data ---

const subjectsByClass = (classId) => {
  const id = parseInt(classId);
  const base = [
    { id: "maths", name: "Mathematics", description: "Algebra, Geometry, Statistics & more", color: "#3B82F6", icon: "📐", totalChapters: id <= 5 ? 10 : id <= 8 ? 14 : 18, progress: 72, avgScore: 81 },
    { id: "english", name: "English", description: "Grammar, Literature & Writing skills", color: "#A78BFA", icon: "📚", totalChapters: id <= 5 ? 8 : 12, progress: 85, avgScore: 88 },
    { id: "science", name: "Science", description: "Physics, Chemistry & Biology concepts", color: "#06B6D4", icon: "🔬", totalChapters: id <= 5 ? 10 : id <= 8 ? 15 : 20, progress: 60, avgScore: 74 },
    { id: "sst", name: "Social Science", description: "History, Geography, Civics & Economics", color: "#F97316", icon: "🌍", totalChapters: id <= 5 ? 8 : id <= 8 ? 12 : 16, progress: 45, avgScore: 68 },
    { id: "hindi", name: "Hindi", description: "Grammar, Literature & Comprehension", color: "#EC4899", icon: "🗣️", totalChapters: id <= 5 ? 8 : 10, progress: 78, avgScore: 82 },
  ];
  if (id >= 4) base.push({ id: "computer", name: "Computer Science", description: "Programming, Algorithms & Digital Literacy", color: "#6366F1", icon: "💻", totalChapters: id <= 8 ? 10 : 14, progress: 90, avgScore: 94 });
  if (id >= 9) {
    base.push({ id: "physics", name: "Physics", description: "Mechanics, Thermodynamics & Electrostatics", color: "#EF4444", icon: "⚛️", totalChapters: 15, progress: 55, avgScore: 71 });
    base.push({ id: "chemistry", name: "Chemistry", description: "Organic, Inorganic & Physical Chemistry", color: "#F59E0B", icon: "🧪", totalChapters: 16, progress: 48, avgScore: 65 });
    base.push({ id: "biology", name: "Biology", description: "Cell Biology, Genetics & Human Physiology", color: "#10B981", icon: "🧬", totalChapters: 14, progress: 62, avgScore: 77 });
  }
  return base.map((s) => ({ ...s, totalTests: s.totalChapters * 4 }));
};

const userProfile = {
  name: "Dhruv Chaudhary",
  email: "dhruvchaudhary296@gmail.com",
  class: 11,
  avatar: "DC",
  xp: 11750,
  level: 7,
  levelName: "Brain Forge",
  streak: 12,
  rank: 3,
  testsCompleted: 142,
  hoursStudied: 284,
  accuracy: 84,
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
  const { classId } = req.params;
  const id = parseInt(classId);
  if (isNaN(id) || id < 1 || id > 12) {
    return res.status(400).json({ success: false, error: "Invalid class ID (1-12)" });
  }
  res.json({ success: true, data: subjectsByClass(id) });
});

app.get("/api/user/profile", (_req, res) => {
  res.json({ success: true, data: userProfile });
});

app.get("/api/leaderboard", (_req, res) => {
  const leaders = [
    { rank: 1, name: "Priya Sharma", xp: 15200, streak: 28, avatar: "PS", badge: "Diamond" },
    { rank: 2, name: "Arjun Mehta", xp: 13800, streak: 21, avatar: "AM", badge: "Platinum" },
    { rank: 3, name: "Dhruv Chaudhary", xp: 11750, streak: 12, avatar: "DC", badge: "Gold" },
    { rank: 4, name: "Sneha Patel", xp: 10200, streak: 9, avatar: "SP", badge: "Gold" },
    { rank: 5, name: "Rahul Kumar", xp: 9600, streak: 7, avatar: "RK", badge: "Silver" },
  ];
  res.json({ success: true, data: leaders });
});

app.listen(PORT, () => console.log(`DC NextGen API running on port ${PORT}`));
