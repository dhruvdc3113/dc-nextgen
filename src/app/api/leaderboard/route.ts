import { NextResponse } from "next/server";
import { auth } from "@/auth";

const BASE_LEADERBOARD = [
  { rank: 1,  name: "Aryan Sharma",  class: "12", score: 15420, streak: 45, avatar: "AS", badge: "Legend"  },
  { rank: 2,  name: "Priya Patel",   class: "11", score: 14830, streak: 38, avatar: "PP", badge: "Titan"   },
  { rank: 3,  name: "Karan Singh",   class: "12", score: 14215, streak: 32, avatar: "KS", badge: "Master"  },
  { rank: 4,  name: "Ananya Verma",  class: "10", score: 13980, streak: 28, avatar: "AV", badge: "Master"  },
  { rank: 5,  name: "Rohan Gupta",   class: "11", score: 13540, streak: 25, avatar: "RG", badge: "Scholar" },
  { rank: 6,  name: "Shreya Nair",   class: "12", score: 12890, streak: 20, avatar: "SN", badge: "Scholar" },
  { rank: 7,  name: "Vikram Mehta",  class: "10", score: 12340, streak: 18, avatar: "VM", badge: "Brain"   },
  { rank: 8,  name: "You",           class: "11", score: 11750, streak: 12, avatar: "YO", badge: "Brain"   },
  { rank: 9,  name: "Neha Kapoor",   class: "9",  score: 11200, streak: 10, avatar: "NK", badge: "Scholar" },
  { rank: 10, name: "Rahul Jain",    class: "10", score: 10890, streak: 8,  avatar: "RJ", badge: "Explorer"},
  { rank: 11, name: "Pooja Sharma",  class: "11", score: 10540, streak: 7,  avatar: "PS", badge: "Explorer"},
  { rank: 12, name: "Aditya Kumar",  class: "12", score: 10120, streak: 6,  avatar: "AK", badge: "Explorer"},
];

export async function GET() {
  const session = await auth();
  const data = BASE_LEADERBOARD.map((entry) => {
    if (entry.name === "You" && session?.user) {
      const name = session.user.name ?? "You";
      const initials = name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
      return { ...entry, name, avatar: initials };
    }
    return entry;
  });
  return NextResponse.json({ success: true, data });
}
