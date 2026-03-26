import { getSession } from "./session";

// Thin wrapper kept so existing imports (e.g. dashboard) still work
export const auth0 = { getSession };
