import { cookies } from "next/headers";

const COOKIE_NAME = "bp_session";

export interface SessionUser {
  name: string;
  email: string;
}

export async function getSession(): Promise<{ user: SessionUser } | null> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(Buffer.from(raw, "base64").toString()) as {
      user: SessionUser;
    };
  } catch {
    return null;
  }
}
