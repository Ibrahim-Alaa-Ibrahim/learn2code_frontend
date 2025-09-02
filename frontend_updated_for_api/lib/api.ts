// src/lib/api.ts
export const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080";

export type ApiOptions = {
  method?: string;
  body?: any;
  token?: string | null | undefined;
  headers?: Record<string, string>;
  /** attach X-User-Id automatically if provided */
  userId?: number;
};

export function getAuth(): any | null {
  if (typeof window === "undefined") return null;
  const raw =
      window.localStorage.getItem("auth") ||
      window.sessionStorage.getItem("auth");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * JSON fetch with sane defaults + optional X-User-Id header.
 * If you later switch to JWT-only, just stop passing userId and rely on token.
 */
export async function apiFetch<T = any>(
    path: string,
    opts: ApiOptions = {}
): Promise<T> {
  const { method = "GET", body, token, headers = {}, userId } = opts;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(userId ? { "X-User-Id": String(userId) } : {}),
      ...headers,
    },
    ...(body !== undefined ? { body: typeof body === "string" ? body : JSON.stringify(body) } : {}),
    cache: "no-store",
  });

  if (!res.ok) {
    let err: any = {};
    try {
      err = await res.json();
    } catch {}
    const msg = err?.message || `Request failed (${res.status} ${res.statusText})`;
    throw new Error(msg);
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return (await res.json()) as T;
  }
  // @ts-ignore
  return (await res.text()) as T;
}
