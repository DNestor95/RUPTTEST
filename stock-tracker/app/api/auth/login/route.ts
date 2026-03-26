import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "bp_session";
const USERNAME = process.env.AUTH_USERNAME ?? "admin";
const PASSWORD = process.env.AUTH_PASSWORD ?? "password";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { username, password } = body as Record<string, string>;

  if (username !== USERNAME || password !== PASSWORD) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const user = { name: username, email: `${username}@local` };
  const value = Buffer.from(JSON.stringify({ user })).toString("base64");

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, value, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });
  return res;
}
