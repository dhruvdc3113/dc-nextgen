"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

export default function Navbar({ lightMode = false, onToggleTheme }: { lightMode?: boolean; onToggleTheme?: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: session } = useSession();
  const [userClass, setUserClass] = useState<string>("");

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setUserClass(localStorage.getItem("userClass") ?? "11");
  }, []);

  const user = session?.user;
  const initials = (user?.name ?? "DC")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: `/class/class-${userClass}`, label: "My Class" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/profile", label: "Profile" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur-xl border-b" : "border-b border-transparent"
      }`}
      style={{
        background: scrolled
          ? lightMode ? "rgba(240,244,255,0.9)" : "rgba(5,5,15,0.85)"
          : "transparent",
        borderColor: scrolled ? "var(--card-border)" : "transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm glow-primary"
              style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)" }}
            >
              DC
            </div>
            <div>
              <span className="font-black text-base tracking-tight gradient-text">DC NextGen</span>
              <div className="text-xs opacity-50 leading-none" style={{ color: "var(--foreground)" }}>
                AI Learning Platform
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.background = "rgba(124,58,237,0.1)";
                  (e.target as HTMLElement).style.color = "#A78BFA";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.background = "transparent";
                  (e.target as HTMLElement).style.color = "var(--text-secondary)";
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Streak */}
            <div
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
              style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", color: "#F59E0B" }}
            >
              <span>🔥</span>
              <span>0</span>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen(!notifOpen); setUserMenuOpen(false); }}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", color: "var(--foreground)" }}
              >
                🔔
                <span className="notification-dot" />
              </button>
              {notifOpen && (
                <div
                  className="absolute right-0 top-12 w-72 rounded-2xl p-4 z-50 animate-fade-in"
                  style={{ background: lightMode ? "rgba(255,255,255,0.98)" : "rgba(15,15,30,0.98)", border: "1px solid var(--card-border)", backdropFilter: "blur(20px)" }}
                >
                  <div className="font-bold text-sm mb-3" style={{ color: "var(--foreground)" }}>Notifications</div>
                  {[
                    { icon: "🤖", msg: "New AI questions ready for your class", time: "Just now" },
                    { icon: "🔥", msg: "Start studying to build your streak!", time: "1h ago" },
                    { icon: "🏆", msg: "Leaderboard updated — check your rank", time: "3h ago" },
                  ].map((n, i) => (
                    <div key={i} className="flex gap-3 py-2 border-b" style={{ borderColor: "var(--card-border)" }}>
                      <span className="text-lg">{n.icon}</span>
                      <div>
                        <p className="text-xs" style={{ color: "var(--foreground)" }}>{n.msg}</p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
              style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", color: "var(--foreground)" }}
              title="Toggle theme"
            >
              {lightMode ? "🌙" : "☀️"}
            </button>

            {/* User avatar / menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => { setUserMenuOpen(!userMenuOpen); setNotifOpen(false); }}
                  className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center font-black text-sm text-white glow-primary"
                  style={{ background: "linear-gradient(135deg, #7C3AED, #5B21B6)" }}
                >
                  {user.image ? (
                    <Image src={user.image} alt={user.name ?? ""} width={36} height={36} className="rounded-full" />
                  ) : (
                    initials
                  )}
                </button>
                {userMenuOpen && (
                  <div
                    className="absolute right-0 top-12 w-56 rounded-2xl p-3 z-50 animate-fade-in"
                    style={{ background: lightMode ? "rgba(255,255,255,0.98)" : "rgba(15,15,30,0.98)", border: "1px solid var(--card-border)", backdropFilter: "blur(20px)" }}
                  >
                    <div className="px-2 py-2 border-b mb-2" style={{ borderColor: "var(--card-border)" }}>
                      <div className="font-bold text-sm" style={{ color: "var(--foreground)" }}>{user.name}</div>
                      <div className="text-xs mt-0.5 truncate" style={{ color: "var(--text-muted)" }}>{user.email}</div>
                      <div className="text-xs mt-1 font-bold" style={{ color: "#A78BFA" }}>Class {userClass}</div>
                    </div>
                    <Link
                      href="/setup"
                      onClick={() => { setUserMenuOpen(false); localStorage.removeItem("userClass"); }}
                      className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-all w-full text-left"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <span>📚</span> Change Class
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-all w-full text-left"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <span>👤</span> View Profile
                    </Link>
                    <button
                      onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: "/login" }); }}
                      className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-all w-full text-left"
                      style={{ color: "#EF4444" }}
                    >
                      <span>🚪</span> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex items-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                style={{ background: "linear-gradient(135deg,#7C3AED,#5B21B6)", color: "white", textDecoration: "none" }}
              >
                Login
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", color: "var(--foreground)" }}
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden border-t p-4 space-y-1 animate-slide-up"
          style={{ background: lightMode ? "rgba(240,244,255,0.98)" : "rgba(5,5,15,0.98)", borderColor: "var(--card-border)", backdropFilter: "blur(20px)" }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-xl text-sm font-medium"
              style={{ color: "var(--foreground)", background: "rgba(124,58,237,0.08)" }}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium"
              style={{ color: "#EF4444", background: "rgba(239,68,68,0.08)" }}
            >
              🚪 Sign Out
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
