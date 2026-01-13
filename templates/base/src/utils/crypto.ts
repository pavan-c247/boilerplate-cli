import { ALGORITHM, CRYPTO_KEY_USAGES } from "@/constants/crypto";
/**
 * Import an AES-256-GCM secret key from a HEX string for Web Crypto API usage.
 *
 *  Key requirements:
 * - HEX encoded string
 * - Exactly 32 bytes (64 hex characters)
 * - Must be the SAME key used on Backend (Node.js crypto)
 *
 *  Why HEX?
 * - Backend stores and transmits the key as HEX
 * - Browser Web Crypto requires raw Uint8Array bytes
 *
 *  Security notes:
 * - Key is marked as non-extractable
 * - Only encryption & decryption operations are allowed
 * - Never expose or log this key
 */

export async function importKeyFromHex(hexKey: string): Promise<CryptoKey> {
  if (hexKey.length !== 64) {
    throw new Error("Key must be 32 bytes (64 hex chars)");
  }

  const rawKey = Uint8Array.from(
    hexKey.match(/.{2}/g)!.map((b) => parseInt(b, 16))
  );

  return crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: ALGORITHM },
    false,
    CRYPTO_KEY_USAGES
  );
}
/**
 * Converts a Base64URL-encoded string into a Uint8Array.
 * Restores URL-safe characters and padding before decoding,
 * making it suitable for cryptographic and binary operations.
 */
export function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

export function uint8ArrayToBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes));
}

export function uint8ArrayToBase64Url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function base64UrlToUint8Array(base64Url: string): Uint8Array {
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) base64 += "=";

  const binary = atob(base64);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}
