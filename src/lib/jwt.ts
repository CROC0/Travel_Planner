// Shared JWT signing/verification secret.
// Importable from both the Edge runtime (proxy.ts) and the Node runtime
// (auth.ts, login/register routes) — must NOT import next/headers or other
// Node-only modules.
export function getSecret(): Uint8Array {
  const secret = process.env.AUTH_JWT_SECRET ?? process.env.SITE_PASSWORD;
  if (!secret) {
    // Fail closed: never sign/verify with an empty key.
    throw new Error(
      'Missing JWT secret: set AUTH_JWT_SECRET (preferred) or SITE_PASSWORD to a strong, random value (>=32 chars).',
    );
  }
  if (secret.length < 32) {
    console.warn(
      '[auth] JWT secret is shorter than 32 characters. Set a strong AUTH_JWT_SECRET (>=32 random chars) before deploying.',
    );
  }
  return new TextEncoder().encode(secret);
}
