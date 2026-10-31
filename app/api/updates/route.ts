import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { addUpdate, getUpdates } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const updates = await getUpdates();
  return NextResponse.json(updates);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body.note !== "string" || !body.note.trim()) {
    return NextResponse.json({ error: "A note is required." }, { status: 400 });
  }
  if (!["skill-1", "skill-2", "skill-3"].includes(body.skillId)) {
    return NextResponse.json({ error: "Unknown skill." }, { status: 400 });
  }
  if (!["not_started", "in_progress", "done"].includes(body.status)) {
    return NextResponse.json({ error: "Unknown status." }, { status: 400 });
  }

  await addUpdate({
    skillId: body.skillId,
    status: body.status,
    note: body.note.trim().slice(0, 2000),
    authorEmail: session.user.email,
  });

  return NextResponse.json({ ok: true });
}
