import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DC NextGen — AI-Powered K-12 Learning Platform",
  description:
    "Premium AI-powered educational platform for Class 1–12 students. Personalized learning, adaptive assessments, gamification and more.",
  keywords: "education, K-12, AI learning, online school, DC NextGen",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
