// HMAC-SHA256 based stateless session — works in both Node.js and Edge runtime

async function computeHmac(secret: string, data: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionToken(): Promise<string> {
  const secret = process.env.ADMIN_SECRET ?? "change-me-in-production";
  const username = process.env.ADMIN_USERNAME ?? "admin";
  const password = process.env.ADMIN_PASSWORD ?? "password";
  return computeHmac(secret, `${username}:${password}`);
}

export async function verifySessionToken(token: string): Promise<boolean> {
  const expected = await createSessionToken();
  return token === expected;
}

export function checkCredentials(username: string, password: string): boolean {
  const validUser = process.env.ADMIN_USERNAME ?? "admin";
  const validPass = process.env.ADMIN_PASSWORD ?? "password";
  return username === validUser && password === validPass;
}

export const SESSION_COOKIE = "admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
