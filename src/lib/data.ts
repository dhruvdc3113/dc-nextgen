export type DifficultyLevel =
  | "Explorer Mode"
  | "Scholar Quest"
  | "Master Journey"
  | "Brain Forge"
  | "Titan Challenge"
  | "Legend Arena";

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgClass: string;
  progress: number;
  chaptersCompleted: number;
  totalChapters: number;
  score: number;
  description: string;
}

export interface Chapter {
  id: string;
  subjectId: string;
  name: string;
  difficulty: DifficultyLevel;
  estimatedTime: string;
  completed: boolean;
  score: number;
  topics: string[];
  aiRecommendation?: string;
}

export interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  type: "conceptual" | "logical" | "hots" | "application";
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  xp: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export const CLASS_LIST = Array.from({ length: 12 }, (_, i) => ({
  id: `class-${i + 1}`,
  name: `Class ${i + 1}`,
  label: `${i + 1}`,
}));

export function getSubjectsForClass(classId: number): Subject[] {
  if (classId <= 3) {
    return [
      { id: "english", name: "English", icon: "📚", color: "#A78BFA", bgClass: "subject-english", progress: 72, chaptersCompleted: 8, totalChapters: 12, score: 84, description: "Language & Literature" },
      { id: "maths", name: "Maths", icon: "🔢", color: "#3B82F6", bgClass: "subject-maths", progress: 60, chaptersCompleted: 6, totalChapters: 10, score: 78, description: "Numbers & Operations" },
      { id: "evs", name: "EVS", icon: "🌱", color: "#10B981", bgClass: "subject-biology", progress: 85, chaptersCompleted: 11, totalChapters: 13, score: 91, description: "Environmental Studies" },
      { id: "hindi", name: "Hindi", icon: "🗣️", color: "#EC4899", bgClass: "subject-hindi", progress: 50, chaptersCompleted: 5, totalChapters: 10, score: 70, description: "Hindi Language" },
      { id: "gk", name: "GK", icon: "🌍", color: "#F59E0B", bgClass: "subject-chemistry", progress: 90, chaptersCompleted: 9, totalChapters: 10, score: 95, description: "General Knowledge" },
    ];
  } else if (classId <= 8) {
    return [
      { id: "maths", name: "Maths", icon: "🔢", color: "#3B82F6", bgClass: "subject-maths", progress: 65, chaptersCompleted: 10, totalChapters: 15, score: 80, description: "Mathematics" },
      { id: "english", name: "English", icon: "📖", color: "#A78BFA", bgClass: "subject-english", progress: 78, chaptersCompleted: 9, totalChapters: 12, score: 85, description: "English Language" },
      { id: "science", name: "Science", icon: "🔬", color: "#06B6D4", bgClass: "subject-science", progress: 55, chaptersCompleted: 8, totalChapters: 14, score: 75, description: "General Science" },
      { id: "sst", name: "Social Science", icon: "🗺️", color: "#F97316", bgClass: "subject-sst", progress: 70, chaptersCompleted: 7, totalChapters: 10, score: 82, description: "History, Geography & Civics" },
      { id: "hindi", name: "Hindi", icon: "🗣️", color: "#EC4899", bgClass: "subject-hindi", progress: 60, chaptersCompleted: 6, totalChapters: 10, score: 73, description: "Hindi Language" },
      { id: "computer", name: "Computer", icon: "💻", color: "#6366F1", bgClass: "subject-computer", progress: 88, chaptersCompleted: 7, totalChapters: 8, score: 92, description: "Computer Science" },
    ];
  } else {
    return [
      { id: "physics", name: "Physics", icon: "⚡", color: "#EF4444", bgClass: "subject-physics", progress: 58, chaptersCompleted: 7, totalChapters: 12, score: 72, description: "Mechanics, Waves & Electricity" },
      { id: "chemistry", name: "Chemistry", icon: "🧪", color: "#F59E0B", bgClass: "subject-chemistry", progress: 45, chaptersCompleted: 6, totalChapters: 14, score: 68, description: "Organic, Inorganic & Physical" },
      { id: "biology", name: "Biology", icon: "🧬", color: "#10B981", bgClass: "subject-biology", progress: 70, chaptersCompleted: 9, totalChapters: 13, score: 81, description: "Life Sciences" },
      { id: "maths", name: "Maths", icon: "∑", color: "#3B82F6", bgClass: "subject-maths", progress: 62, chaptersCompleted: 8, totalChapters: 13, score: 77, description: "Advanced Mathematics" },
      { id: "english", name: "English", icon: "📝", color: "#A78BFA", bgClass: "subject-english", progress: 80, chaptersCompleted: 7, totalChapters: 9, score: 88, description: "Literature & Writing" },
      { id: "economics", name: "Economics", icon: "📊", color: "#14B8A6", bgClass: "subject-economics", progress: 55, chaptersCompleted: 5, totalChapters: 9, score: 74, description: "Micro & Macroeconomics" },
      { id: "computer", name: "Computer Science", icon: "💻", color: "#6366F1", bgClass: "subject-computer", progress: 90, chaptersCompleted: 8, totalChapters: 9, score: 94, description: "Programming & Theory" },
      { id: "accounts", name: "Accounts", icon: "🏦", color: "#8B5CF6", bgClass: "subject-english", progress: 48, chaptersCompleted: 5, totalChapters: 11, score: 65, description: "Financial Accounting" },
    ];
  }
}

export function getChaptersForSubject(subjectId: string, classId: number): Chapter[] {
  const chaptersMap: Record<string, Chapter[]> = {
    physics: [
      { id: "ch1", subjectId: "physics", name: "Physical World & Measurement", difficulty: "Explorer Mode", estimatedTime: "3h", completed: true, score: 88, topics: ["Physical Quantities", "SI Units", "Errors in Measurement", "Significant Figures"], aiRecommendation: "Revise significant figures — 2 errors in last quiz" },
      { id: "ch2", subjectId: "physics", name: "Kinematics", difficulty: "Scholar Quest", estimatedTime: "5h", completed: true, score: 75, topics: ["Motion in a Straight Line", "Equations of Motion", "Projectile Motion", "Relative Motion"], aiRecommendation: "Strong performance — ready for Dynamics" },
      { id: "ch3", subjectId: "physics", name: "Laws of Motion", difficulty: "Master Journey", estimatedTime: "6h", completed: false, score: 0, topics: ["Newton's Laws", "Friction", "Circular Motion", "Applications"], aiRecommendation: "Start with Newton's 1st Law — it's the foundation" },
      { id: "ch4", subjectId: "physics", name: "Work, Energy & Power", difficulty: "Master Journey", estimatedTime: "5h", completed: false, score: 0, topics: ["Work-Energy Theorem", "Kinetic & Potential Energy", "Conservation of Energy", "Power"], aiRecommendation: "Linked to Laws of Motion — study together" },
      { id: "ch5", subjectId: "physics", name: "Rotational Motion", difficulty: "Brain Forge", estimatedTime: "7h", completed: false, score: 0, topics: ["Torque", "Angular Momentum", "Moment of Inertia", "Rolling Motion"], aiRecommendation: "Requires mastery of Ch3 & Ch4 first" },
      { id: "ch6", subjectId: "physics", name: "Gravitation", difficulty: "Scholar Quest", estimatedTime: "4h", completed: false, score: 0, topics: ["Newton's Law of Gravitation", "Kepler's Laws", "Satellites", "Escape Velocity"], aiRecommendation: "High-yield chapter for board exams" },
      { id: "ch7", subjectId: "physics", name: "Properties of Matter", difficulty: "Master Journey", estimatedTime: "5h", completed: false, score: 0, topics: ["Elasticity", "Fluid Mechanics", "Viscosity", "Surface Tension"], aiRecommendation: "Many formula-based questions — use formula cards" },
      { id: "ch8", subjectId: "physics", name: "Thermodynamics", difficulty: "Titan Challenge", estimatedTime: "8h", completed: false, score: 0, topics: ["Laws of Thermodynamics", "Heat Transfer", "Carnot Engine", "Entropy"], aiRecommendation: "Most challenging chapter — allocate extra time" },
    ],
    chemistry: [
      { id: "ch1", subjectId: "chemistry", name: "Some Basic Concepts", difficulty: "Explorer Mode", estimatedTime: "3h", completed: true, score: 92, topics: ["Mole Concept", "Stoichiometry", "Empirical Formula", "Molarity"], aiRecommendation: "Excellent! Perfect score territory" },
      { id: "ch2", subjectId: "chemistry", name: "Atomic Structure", difficulty: "Scholar Quest", estimatedTime: "4h", completed: true, score: 80, topics: ["Bohr's Model", "Quantum Numbers", "Electronic Configuration", "Orbitals"], aiRecommendation: "Revise quantum numbers — frequent in JEE" },
      { id: "ch3", subjectId: "chemistry", name: "Chemical Bonding", difficulty: "Master Journey", estimatedTime: "6h", completed: false, score: 0, topics: ["Ionic Bond", "Covalent Bond", "VSEPR Theory", "Hybridization", "Molecular Orbital Theory"], aiRecommendation: "Hybridization is key — master it first" },
      { id: "ch4", subjectId: "chemistry", name: "States of Matter", difficulty: "Scholar Quest", estimatedTime: "4h", completed: false, score: 0, topics: ["Gas Laws", "Kinetic Theory", "Real Gases", "Liquids"], aiRecommendation: "Gas laws have direct formula application" },
      { id: "ch5", subjectId: "chemistry", name: "Thermochemistry", difficulty: "Brain Forge", estimatedTime: "5h", completed: false, score: 0, topics: ["Enthalpy", "Hess's Law", "Bond Enthalpy", "Entropy & Gibbs Energy"], aiRecommendation: "Connects to Physics thermodynamics" },
      { id: "ch6", subjectId: "chemistry", name: "Equilibrium", difficulty: "Titan Challenge", estimatedTime: "7h", completed: false, score: 0, topics: ["Law of Mass Action", "Le Chatelier's Principle", "Acids & Bases", "Buffer Solutions"], aiRecommendation: "Heavy weight in board exams — prioritize" },
    ],
    maths: [
      { id: "ch1", subjectId: "maths", name: "Sets & Relations", difficulty: "Explorer Mode", estimatedTime: "3h", completed: true, score: 95, topics: ["Types of Sets", "Set Operations", "Venn Diagrams", "Relations & Functions"], aiRecommendation: "Mastered! Perfect foundation" },
      { id: "ch2", subjectId: "maths", name: "Functions", difficulty: "Scholar Quest", estimatedTime: "4h", completed: true, score: 82, topics: ["Types of Functions", "Composition", "Inverse Functions", "Even & Odd"], aiRecommendation: "Good understanding, revise composite functions" },
      { id: "ch3", subjectId: "maths", name: "Trigonometry", difficulty: "Master Journey", estimatedTime: "7h", completed: false, score: 0, topics: ["Trigonometric Identities", "Inverse Trig", "Heights & Distances", "Properties of Triangles"], aiRecommendation: "Most formula-heavy chapter — use flashcards" },
      { id: "ch4", subjectId: "maths", name: "Complex Numbers", difficulty: "Brain Forge", estimatedTime: "5h", completed: false, score: 0, topics: ["Argand Plane", "Modulus & Argument", "Polar Form", "De Moivre's Theorem"], aiRecommendation: "Abstract concepts — use visual aids" },
      { id: "ch5", subjectId: "maths", name: "Quadratic Equations", difficulty: "Scholar Quest", estimatedTime: "4h", completed: false, score: 0, topics: ["Nature of Roots", "Discriminant", "Sum & Product of Roots", "Symmetric Functions"], aiRecommendation: "High-yield topic in every competitive exam" },
      { id: "ch6", subjectId: "maths", name: "Permutations & Combinations", difficulty: "Master Journey", estimatedTime: "5h", completed: false, score: 0, topics: ["Fundamental Principle", "Permutations", "Combinations", "Circular Arrangements"], aiRecommendation: "Practice is key — attempt 50+ problems" },
      { id: "ch7", subjectId: "maths", name: "Binomial Theorem", difficulty: "Scholar Quest", estimatedTime: "4h", completed: false, score: 0, topics: ["Binomial Expansion", "General Term", "Middle Term", "Pascal's Triangle"], aiRecommendation: "3-4 questions guaranteed in JEE" },
      { id: "ch8", subjectId: "maths", name: "Coordinate Geometry", difficulty: "Titan Challenge", estimatedTime: "8h", completed: false, score: 0, topics: ["Straight Lines", "Circles", "Parabola", "Ellipse", "Hyperbola"], aiRecommendation: "Largest chapter — break into 3 study sessions" },
    ],
    english: [
      { id: "ch1", subjectId: "english", name: "The Last Lesson", difficulty: "Explorer Mode", estimatedTime: "2h", completed: true, score: 90, topics: ["Summary", "Character Analysis", "Themes", "Important Lines", "Vocabulary"], aiRecommendation: "Excellent comprehension! Ready for Flamingo Ch2" },
      { id: "ch2", subjectId: "english", name: "Lost Spring", difficulty: "Scholar Quest", estimatedTime: "2h", completed: true, score: 78, topics: ["Saheb & Mukesh", "Child Labour Theme", "Symbolism", "Author's Perspective"], aiRecommendation: "Re-read the Mukesh segment for deeper analysis" },
      { id: "ch3", subjectId: "english", name: "Deep Water", difficulty: "Explorer Mode", estimatedTime: "1.5h", completed: false, score: 0, topics: ["Fear & Courage", "Author's Experience", "Symbolism of Water", "Life Lessons"], aiRecommendation: "Short chapter — complete in one sitting" },
      { id: "ch4", subjectId: "english", name: "The Rattrap", difficulty: "Scholar Quest", estimatedTime: "2h", completed: false, score: 0, topics: ["Plot Summary", "Elsa's Character", "Rattrap Metaphor", "Redemption Theme"], aiRecommendation: "Focus on the metaphor — frequently asked" },
      { id: "ch5", subjectId: "english", name: "Indigo", difficulty: "Master Journey", estimatedTime: "2.5h", completed: false, score: 0, topics: ["Gandhi's Methods", "Satyagraha", "Champaran Movement", "Historical Context"], aiRecommendation: "Connects with History — study together" },
      { id: "ch6", subjectId: "english", name: "Poets & Pancakes", difficulty: "Scholar Quest", estimatedTime: "2h", completed: false, score: 0, topics: ["Gemini Studios", "Film Industry Satire", "Humor & Irony", "Character Sketches"], aiRecommendation: "Understand the satirical tone for essay questions" },
    ],
    biology: [
      { id: "ch1", subjectId: "biology", name: "Reproduction in Organisms", difficulty: "Explorer Mode", estimatedTime: "3h", completed: true, score: 88, topics: ["Asexual Reproduction", "Sexual Reproduction", "Life Span", "Vegetative Propagation"], aiRecommendation: "Strong base — proceed to Plant Reproduction" },
      { id: "ch2", subjectId: "biology", name: "Sexual Reproduction in Plants", difficulty: "Scholar Quest", estimatedTime: "4h", completed: true, score: 79, topics: ["Flower Structure", "Pollination", "Fertilization", "Fruits & Seeds"], aiRecommendation: "Double fertilization is frequently asked" },
      { id: "ch3", subjectId: "biology", name: "Human Reproduction", difficulty: "Master Journey", estimatedTime: "5h", completed: false, score: 0, topics: ["Male Reproductive System", "Female System", "Gametogenesis", "Pregnancy & Development"], aiRecommendation: "Diagram-heavy chapter — draw while studying" },
      { id: "ch4", subjectId: "biology", name: "Genetics & Heredity", difficulty: "Brain Forge", estimatedTime: "6h", completed: false, score: 0, topics: ["Mendel's Laws", "Dihybrid Cross", "Linkage", "Sex Determination"], aiRecommendation: "Punnett squares are essential — practice daily" },
      { id: "ch5", subjectId: "biology", name: "Molecular Basis of Inheritance", difficulty: "Titan Challenge", estimatedTime: "7h", completed: false, score: 0, topics: ["DNA Structure", "Replication", "Transcription", "Translation", "Gene Expression"], aiRecommendation: "Most important chapter for NEET — master it" },
    ],
    science: [
      { id: "ch1", subjectId: "science", name: "Chemical Reactions & Equations", difficulty: "Explorer Mode", estimatedTime: "3h", completed: true, score: 86, topics: ["Types of Reactions", "Balancing Equations", "Redox Reactions", "Corrosion"], aiRecommendation: "Good understanding! Practice balancing more" },
      { id: "ch2", subjectId: "science", name: "Acids, Bases & Salts", difficulty: "Scholar Quest", estimatedTime: "4h", completed: true, score: 80, topics: ["pH Scale", "Neutralization", "Salts", "Everyday Applications"], aiRecommendation: "pH calculations need more practice" },
      { id: "ch3", subjectId: "science", name: "Metals & Non-Metals", difficulty: "Master Journey", estimatedTime: "4h", completed: false, score: 0, topics: ["Physical Properties", "Reactivity Series", "Extraction", "Ionic Bonds"], aiRecommendation: "Reactivity series is memory work — use mnemonics" },
      { id: "ch4", subjectId: "science", name: "Life Processes", difficulty: "Scholar Quest", estimatedTime: "5h", completed: false, score: 0, topics: ["Nutrition", "Respiration", "Transportation", "Excretion"], aiRecommendation: "Diagram of heart and kidney must be practiced" },
      { id: "ch5", subjectId: "science", name: "Control & Coordination", difficulty: "Brain Forge", estimatedTime: "4h", completed: false, score: 0, topics: ["Nervous System", "Hormones", "Reflex Action", "Sense Organs"], aiRecommendation: "Nervous system diagram is board-exam favourite" },
    ],
    sst: [
      { id: "ch1", subjectId: "sst", name: "Resources & Development", difficulty: "Explorer Mode", estimatedTime: "3h", completed: true, score: 84, topics: ["Types of Resources", "Resource Planning", "Land Degradation", "Conservation"], aiRecommendation: "Revise map work for resources" },
      { id: "ch2", subjectId: "sst", name: "Forest & Wildlife Resources", difficulty: "Scholar Quest", estimatedTime: "2.5h", completed: false, score: 0, topics: ["Flora & Fauna", "Conservation Projects", "Sacred Groves", "Biosphere Reserves"], aiRecommendation: "Learn national parks locations on map" },
      { id: "ch3", subjectId: "sst", name: "Power Sharing", difficulty: "Explorer Mode", estimatedTime: "2h", completed: true, score: 90, topics: ["Belgium & Sri Lanka", "Majoritarianism", "Accommodation", "Democracy"], aiRecommendation: "Excellent! Strong concept clarity" },
      { id: "ch4", subjectId: "sst", name: "Federalism", difficulty: "Scholar Quest", estimatedTime: "3h", completed: false, score: 0, topics: ["Types of Federalism", "Indian Federation", "Decentralization", "Local Government"], aiRecommendation: "Indian federalism is most important section" },
      { id: "ch5", subjectId: "sst", name: "Rise of Nationalism in Europe", difficulty: "Master Journey", estimatedTime: "4h", completed: false, score: 0, topics: ["French Revolution", "Industrial Revolution Impact", "Unification of Germany", "Unification of Italy"], aiRecommendation: "Timeline memorization is essential here" },
    ],
  };

  return chaptersMap[subjectId] || chaptersMap["physics"];
}

export const SAMPLE_MCQ_QUESTIONS: MCQQuestion[] = [
  {
    id: "q1",
    question: "Which of Newton's laws states that 'For every action, there is an equal and opposite reaction'?",
    options: ["First Law", "Second Law", "Third Law", "Law of Gravitation"],
    correctAnswer: 2,
    explanation: "Newton's Third Law of Motion states that for every action there is an equal and opposite reaction. This means forces always come in pairs — when object A exerts a force on object B, object B simultaneously exerts a force equal in magnitude and opposite in direction on object A.",
    topic: "Laws of Motion",
    difficulty: "easy",
    type: "conceptual",
  },
  {
    id: "q2",
    question: "A body of mass 5 kg is acted upon by a force of 20 N. The acceleration produced is:",
    options: ["2 m/s²", "4 m/s²", "10 m/s²", "100 m/s²"],
    correctAnswer: 1,
    explanation: "Using Newton's Second Law: F = ma → a = F/m = 20/5 = 4 m/s². The acceleration produced is 4 m/s² in the direction of the applied force.",
    topic: "Laws of Motion",
    difficulty: "easy",
    type: "application",
  },
  {
    id: "q3",
    question: "The escape velocity from Earth's surface is approximately:",
    options: ["7.9 km/s", "11.2 km/s", "15.0 km/s", "3.0 km/s"],
    correctAnswer: 1,
    explanation: "Escape velocity = √(2gR) = √(2 × 9.8 × 6.4×10⁶) ≈ 11.2 km/s. This is the minimum velocity needed to escape Earth's gravitational pull without further propulsion.",
    topic: "Gravitation",
    difficulty: "medium",
    type: "conceptual",
  },
  {
    id: "q4",
    question: "Which of the following quantities is a scalar?",
    options: ["Force", "Velocity", "Acceleration", "Speed"],
    correctAnswer: 3,
    explanation: "Speed is a scalar quantity — it has only magnitude (e.g., 60 km/h) but no direction. Force, velocity, and acceleration are all vector quantities with both magnitude and direction.",
    topic: "Physical World & Measurement",
    difficulty: "easy",
    type: "conceptual",
  },
  {
    id: "q5",
    question: "A ball thrown horizontally from a height of 80 m takes (g = 10 m/s²) to reach the ground:",
    options: ["2 s", "4 s", "6 s", "8 s"],
    correctAnswer: 1,
    explanation: "Using h = ½gt²: 80 = ½ × 10 × t² → t² = 16 → t = 4 seconds. The horizontal velocity does not affect the time of fall — only the vertical component of gravity matters.",
    topic: "Kinematics",
    difficulty: "medium",
    type: "application",
  },
  {
    id: "q6",
    question: "Which conservation law is violated when a radioactive nucleus emits radiation?",
    options: ["Conservation of Charge", "Conservation of Energy", "Conservation of Mass-Energy", "None — all are conserved"],
    correctAnswer: 3,
    explanation: "In radioactive decay, mass, charge, energy, momentum and baryon number are all conserved. The combined mass-energy is conserved through Einstein's E=mc² relation. No conservation law is violated.",
    topic: "Nuclear Physics",
    difficulty: "hard",
    type: "hots",
  },
  {
    id: "q7",
    question: "The dimensional formula of work is:",
    options: ["[ML²T⁻²]", "[MLT⁻²]", "[ML²T⁻¹]", "[ML⁻¹T⁻²]"],
    correctAnswer: 0,
    explanation: "Work = Force × Displacement = [MLT⁻²] × [L] = [ML²T⁻²]. This is the same dimensional formula as energy, which makes sense since work done equals energy transferred.",
    topic: "Physical World & Measurement",
    difficulty: "medium",
    type: "logical",
  },
  {
    id: "q8",
    question: "A particle moves in a circle of radius r with uniform speed v. Its centripetal acceleration is:",
    options: ["v²/r", "v/r²", "vr", "r/v²"],
    correctAnswer: 0,
    explanation: "Centripetal acceleration a = v²/r. This acceleration is directed towards the centre of the circle. It can also be written as ω²r where ω is the angular velocity. This acceleration changes the direction of velocity, not its magnitude.",
    topic: "Kinematics",
    difficulty: "medium",
    type: "application",
  },
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: "a1", title: "First Steps", description: "Complete your first chapter", icon: "👣", unlocked: true, xp: 50, rarity: "common" },
  { id: "a2", title: "Quiz Warrior", description: "Score 90%+ in an MCQ test", icon: "⚔️", unlocked: true, xp: 100, rarity: "rare" },
  { id: "a3", title: "7-Day Streak", description: "Study 7 days in a row", icon: "🔥", unlocked: true, xp: 150, rarity: "rare" },
  { id: "a4", title: "Speed Reader", description: "Complete 5 chapters in one week", icon: "⚡", unlocked: false, xp: 200, rarity: "epic" },
  { id: "a5", title: "Perfect Score", description: "Get 100% in any assessment", icon: "💎", unlocked: false, xp: 300, rarity: "legendary" },
  { id: "a6", title: "Chapter Master", description: "Complete all chapters in a subject", icon: "🏆", unlocked: false, xp: 500, rarity: "legendary" },
  { id: "a7", title: "Streak Legend", description: "30 day study streak", icon: "🌟", unlocked: false, xp: 750, rarity: "legendary" },
  { id: "a8", title: "Night Owl", description: "Study after 10 PM for 5 days", icon: "🦉", unlocked: true, xp: 75, rarity: "common" },
  { id: "a9", title: "Early Bird", description: "Study before 7 AM for 5 days", icon: "🌅", unlocked: false, xp: 75, rarity: "common" },
  { id: "a10", title: "Brain Titan", description: "Complete Titan Challenge difficulty", icon: "🧠", unlocked: false, xp: 400, rarity: "epic" },
];

export const LEADERBOARD_DATA = [
  { rank: 1, name: "Aryan Sharma", class: "12", score: 15420, streak: 45, avatar: "AS", badge: "Legend" },
  { rank: 2, name: "Priya Patel", class: "11", score: 14830, streak: 38, avatar: "PP", badge: "Titan" },
  { rank: 3, name: "Karan Singh", class: "12", score: 14215, streak: 32, avatar: "KS", badge: "Master" },
  { rank: 4, name: "Ananya Verma", class: "10", score: 13980, streak: 28, avatar: "AV", badge: "Master" },
  { rank: 5, name: "Rohan Gupta", class: "11", score: 13540, streak: 25, avatar: "RG", badge: "Scholar" },
  { rank: 6, name: "Shreya Nair", class: "12", score: 12890, streak: 20, avatar: "SN", badge: "Scholar" },
  { rank: 7, name: "Vikram Mehta", class: "10", score: 12340, streak: 18, avatar: "VM", badge: "Brain" },
  { rank: 8, name: "You", class: "11", score: 11750, streak: 12, avatar: "YO", badge: "Brain" },
];

export const HEATMAP_DATA = Array.from({ length: 52 * 7 }, (_, i) => ({
  date: new Date(Date.now() - (52 * 7 - i) * 86400000).toISOString().split("T")[0],
  level: Math.random() > 0.3 ? Math.floor(Math.random() * 5) : 0,
}));

export const MOTIVATIONAL_QUOTES = [
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { quote: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { quote: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { quote: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { quote: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
];
