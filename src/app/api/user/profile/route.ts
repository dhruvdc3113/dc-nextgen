import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
  }

  const { name, email, image } = session.user;
  const initials = (name ?? "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return NextResponse.json({
    success: true,
    data: {
      name: name ?? "Student",
      email: email ?? "",
      avatar: image ?? initials,
      avatarInitials: initials,
      xp: 0,
      level: 1,
      levelName: "Explorer",
      streak: 0,
      rank: 0,
      testsCompleted: 0,
      hoursStudied: 0,
      accuracy: 0,
      chaptersCompleted: 0,
    },
  });
}
