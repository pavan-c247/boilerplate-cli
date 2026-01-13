import { AES_GCM_SECRET_KEY } from "@/config/crypto";
import { ALGORITHM } from "@/constants/crypto";
import { importKeyFromHex, uint8ArrayToBase64Url } from "@/utils/crypto";
/**
 * Encrypts a string using AES-256-GCM (Browser Web Crypto).
 *
 *  Encryption format:
 * enc_<base64(iv + authTag + cipherText)>
 *
 * - IV: 12 bytes (recommended for AES-GCM)
 * - Auth tag: 16 bytes (integrity & authenticity)
 * - Cipher text: encrypted payload
 *
 *  Compatibility:
 * - Fully compatible with Backend (Node.js crypto AES-256-GCM)
 * - Uses the SAME secret key and byte layout
 *
 *  Notes:
 * - This is for ID / payload obfuscation, NOT password encryption
 * - Secret key is injected from environment variables
 */

export async function encryptString(plainText: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await importKeyFromHex(AES_GCM_SECRET_KEY);

  const encrypted = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    new TextEncoder().encode(plainText)
  );

  const encryptedArray = new Uint8Array(encrypted);

  const tag = encryptedArray.slice(encryptedArray.length - 16);
  const cipherText = encryptedArray.slice(0, encryptedArray.length - 16);

  const combined = new Uint8Array([...iv, ...tag, ...cipherText]);

  return `enc_${uint8ArrayToBase64Url(combined)}`;
}

/**
 * Helper function for to encrypt the payload
 * @param payload
 * @returns
 */
export async function encryptPayload(payload: unknown) {
  const data = typeof payload === "string" ? payload : JSON.stringify(payload);
  const response = await encryptString(data);
  return response;
}
