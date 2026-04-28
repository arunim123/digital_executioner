/**
 * Zero-Knowledge Pipeline - Client-Side Encryption Utility
 * Relies exclusively on Web Crypto API built into modern browsers.
 * Server only ever sees AES-256-GCM encrypted ciphertext and the IV/Salt.
 * The Master Passphrase is NEVER transmitted.
 */

const SALT_SIZE = 16; // 128 bit
const IV_SIZE = 12; // 96 bit (recommended for GCM)
const ITERATIONS = 100000;

export async function generateKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(passphrase),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypts data using AES-256-GCM
 * Returns a JSON string containing the base64 encoded ciphertext, iv, and salt.
 */
export async function encryptVaultData(passphrase: string, plainText: string): Promise<string> {
  const salt = window.crypto.getRandomValues(new Uint8Array(SALT_SIZE));
  const iv = window.crypto.getRandomValues(new Uint8Array(IV_SIZE));
  const key = await generateKey(passphrase, salt);

  const enc = new TextEncoder();
  const encryptedBuf = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    enc.encode(plainText)
  );

  const encryptedArray = Array.from(new Uint8Array(encryptedBuf));
  const saltArray = Array.from(salt);
  const ivArray = Array.from(iv);

  return JSON.stringify({
    ciphertext: btoa(String.fromCharCode.apply(null, encryptedArray)),
    salt: btoa(String.fromCharCode.apply(null, saltArray)),
    iv: btoa(String.fromCharCode.apply(null, ivArray)),
  });
}

/**
 * Decrypts data using AES-256-GCM
 */
export async function decryptVaultData(passphrase: string, encryptedPayload: string): Promise<string> {
  const payload = JSON.parse(encryptedPayload);
  const salt = new Uint8Array(atob(payload.salt).split('').map(c => c.charCodeAt(0)));
  const iv = new Uint8Array(atob(payload.iv).split('').map(c => c.charCodeAt(0)));
  
  const ciphertextBytes = atob(payload.ciphertext).split('').map(c => c.charCodeAt(0));
  const ciphertext = new Uint8Array(ciphertextBytes);

  const key = await generateKey(passphrase, salt);

  const decryptedBuf = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    ciphertext
  );

  const dec = new TextDecoder();
  return dec.decode(decryptedBuf);
}
