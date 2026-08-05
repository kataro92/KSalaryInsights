/**
 * SHA-256 hex via Web Crypto (Node 18+ / modern RN). ADR 0008 checksum gate.
 */

export async function sha256Hex(text: string): Promise<string> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error("SHA-256 không khả dụng trên môi trường này");
  }
  const data = new TextEncoder().encode(text);
  const digest = await subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifySha256(
  text: string,
  expectedHex: string
): Promise<boolean> {
  const actual = await sha256Hex(text);
  return actual === expectedHex.toLowerCase();
}
