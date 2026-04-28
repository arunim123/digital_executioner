const SALT_SIZE = 16;
const IV_SIZE = 12;
const ITERATIONS = 100000;

export async function generateKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey("raw", enc.encode(passphrase), { name: "PBKDF2" }, false, ["deriveBits", "deriveKey"]);
  return window.crypto.subtle.deriveKey({ name: "PBKDF2", salt: salt as unknown as BufferSource, iterations: ITERATIONS, hash: "SHA-256" }, keyMaterial, { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
}

export async function encryptVaultData(passphrase: string, plainText: string): Promise<string> {
  const salt = window.crypto.getRandomValues(new Uint8Array(SALT_SIZE));
  const iv = window.crypto.getRandomValues(new Uint8Array(IV_SIZE));
  const key = await generateKey(passphrase, salt);
  const enc = new TextEncoder();
  const encryptedBuf = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv: iv as unknown as BufferSource }, key, enc.encode(plainText) as unknown as BufferSource);
  return JSON.stringify({
    ciphertext: btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(encryptedBuf)))),
    salt: btoa(String.fromCharCode.apply(null, Array.from(salt))),
    iv: btoa(String.fromCharCode.apply(null, Array.from(iv))),
  });
}

export async function decryptVaultData(passphrase: string, encryptedPayload: string): Promise<string> {
  const payload = JSON.parse(encryptedPayload);
  const salt = new Uint8Array(atob(payload.salt).split('').map(c => c.charCodeAt(0)));
  const iv = new Uint8Array(atob(payload.iv).split('').map(c => c.charCodeAt(0)));
  const ciphertextBytes = atob(payload.ciphertext).split('').map(c => c.charCodeAt(0));
  const key = await generateKey(passphrase, salt);
  const decryptedBuf = await window.crypto.subtle.decrypt({ name: "AES-GCM", iv: iv as unknown as BufferSource }, key, new Uint8Array(ciphertextBytes) as unknown as BufferSource);
  return new TextDecoder().decode(decryptedBuf);
}
