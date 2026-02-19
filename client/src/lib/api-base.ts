const DEFAULT_API_BASE_URL = "https://knowledge-vault-wjz0831.replit.app";
const rawApiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL).trim();
const normalizedApiBaseUrl = rawApiBaseUrl.replace(/\/+$/, "");

export function apiUrl(path: string): string {
  return `${normalizedApiBaseUrl}${path}`;
}
