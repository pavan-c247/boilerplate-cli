import { AES_GCM_SECRET_KEY } from "@/config/crypto";
import { ALGORITHM } from "@/constants/crypto";
import { base64UrlToUint8Array, importKeyFromHex } from "@/utils/crypto";

/**
 * Decrypts an AES-256-GCM encrypted string produced by `encryptStringId`.
 *
 *  Expected input format:
 * enc_<base64(iv + authTag + cipherText)>
 *
 *  Decryption steps:
 * 1. Remove `enc_` prefix
 * 2. Base64 decode into raw bytes
 * 3. Extract IV (12 bytes), Auth Tag (16 bytes), Cipher Text
 * 4. Reconstruct cipherText + authTag (Web Crypto requirement)
 * 5. Decrypt using AES-GCM
 *
 *  Notes:
 * - Fully compatible with Backend (Node.js AES-256-GCM)
 * - Throws if data is tampered or key is invalid
 * - Intended for ID / payload de-obfuscation, NOT secrets
 */
export async function decryptString(encryptedData: string): Promise<string> {
  if (!encryptedData.startsWith("enc_")) {
    throw new Error("Invalid encrypted ID");
  }

  const buffer = base64UrlToUint8Array(encryptedData.replace("enc_", ""));

  const iv = buffer.slice(0, 12);
  const tag = buffer.slice(12, 28);
  const cipherText = buffer.slice(28);

  const combined = new Uint8Array([...cipherText, ...tag]);

  const key = await importKeyFromHex(AES_GCM_SECRET_KEY);

  const decrypted = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv },
    key,
    combined
  );

  return new TextDecoder().decode(decrypted);
}
