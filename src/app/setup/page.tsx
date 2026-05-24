"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const CLASS_GROUPS = [
  {
    label: "Primary", range: "Class 1–5", icon: "🌱",
    classes: [1, 2, 3, 4, 5],
    desc: "Foundation & Core Subjects",
    color: "#10B981",
  },
  {
    label: "Middle School", range: "Class 6–8", icon: "📚",
    classes: [6, 7, 8],
    desc: "Science, Maths & Languages",
    color: "#3B82F6",
  },
  {
    label: "Secondary", range: "Class 9–10", icon: "🔬",
    classes: [9, 10],
    desc: "Board Exam Preparation",
    color: "#F59E0B",
  },
  {
    label: "Senior Secondary", range: "Class 11–12", icon: "🚀",
    classes: [11, 12],
    desc: "JEE / NEET / Boards",
    color: "#A78BFA",
  },
];

export default function SetupPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [selected, setSelected] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }
    const saved = localStorage.getItem("userClass");
    if (saved) {
      router.replace("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#080C14" }}>
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleConfirm = () => {
    if (!selected) return;
    setSaving(true);
    localStorage.setItem("userClass", String(selected));
    setTimeout(() => router.push("/dashboard"), 400);
  };

  const user = session?.user;
  const initials = (user?.name ?? "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(145deg, #080C14 0%, #0D0B1E 60%, #0A1020 100%)" }}
    >
      {/* Background orbs */}
      <div style={{ position: "fixed", top: -100, left: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.12), transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.08), transparent 70%)", pointerEvents: "none" }} />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl text-white mx-auto mb-5"
            style={{
              background: user?.image
                ? "transparent"
                : "linear-gradient(135deg,#7C3AED,#06B6D4)",
              boxShadow: "0 0 32px rgba(124,58,237,0.4)",
            }}
          >
            {user?.image ? (
              <img src={user.image} alt="" className="w-16 h-16 rounded-2xl object-cover" />
            ) : (
              initials
            )}
          </div>
          <h1 className="text-3xl font-black text-white mb-2">
            Welcome, {user?.name?.split(" ")[0] ?? "Student"}! 👋
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15 }}>
            Choose your class to personalize your learning journey
          </p>
        </div>

        {/* Class groups */}
        <div className="space-y-4 mb-8">
          {CLASS_GROUPS.map((group) => (
            <div
              key={group.label}
              className="rounded-2xl overflow-hidden"
              style={{
                border: `1px solid ${
                  group.classes.includes(selected ?? -1)
                    ? group.color + "60"
                    : "rgba(255,255,255,0.07)"
                }`,
                background: group.classes.includes(selected ?? -1)
                  ? `${group.color}0D`
                  : "rgba(255,255,255,0.03)",
                transition: "all 0.2s",
              }}
            >
              <div className="p-4 flex items-center gap-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: `${group.color}20`, border: `1px solid ${group.color}40` }}
                >
                  {group.icon}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-white text-sm">{group.range}</div>
                  <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {group.desc}
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap justify-end">
                  {group.classes.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelected(c)}
                      className="w-10 h-10 rounded-xl font-black text-sm transition-all"
                      style={{
                        background:
                          selected === c
                            ? `linear-gradient(135deg, ${group.color}, ${group.color}BB)`
                            : "rgba(255,255,255,0.06)",
                        color: selected === c ? "white" : "rgba(255,255,255,0.6)",
                        border: `1px solid ${
                          selected === c ? group.color : "rgba(255,255,255,0.1)"
                        }`,
                        transform: selected === c ? "scale(1.1)" : "scale(1)",
                        boxShadow:
                          selected === c ? `0 4px 16px ${group.color}40` : "none",
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Confirm button */}
        <button
          onClick={handleConfirm}
          disabled={!selected || saving}
          className="w-full py-4 rounded-2xl font-bold text-lg transition-all"
          style={{
            background:
              selected && !saving
                ? "linear-gradient(135deg,#7C3AED,#5B21B6)"
                : "rgba(255,255,255,0.06)",
            color: selected ? "white" : "rgba(255,255,255,0.3)",
            border: `1px solid ${selected ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.1)"}`,
            boxShadow: selected ? "0 8px 32px rgba(124,58,237,0.4)" : "none",
            cursor: selected ? "pointer" : "not-allowed",
          }}
        >
          {saving
            ? "Setting up your dashboard..."
            : selected
            ? `Continue with Class ${selected} →`
            : "Select your class to continue"}
        </button>

        <p className="text-center mt-5 text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
          You can change your class later from the Profile page
        </p>
      </div>
    </div>
  );
}
