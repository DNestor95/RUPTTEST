import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "bp_session";

export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/", req.url));
  res.cookies.delete(COOKIE_NAME);
  return res;
}
