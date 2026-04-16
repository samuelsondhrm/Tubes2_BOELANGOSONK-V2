import type { ScrapeResponse, TraverseResponse } from "../types/api";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? "Request failed");
  }
  return res.json();
}

export const api = {
  scrape: (url: string) =>
    post<ScrapeResponse>("/scrape", { url }),

  traverse: (params: {
    url?: string;
    rawHtml?: string;
    algorithm: string;
    selector: string;
    topN: number;
  }) => post<TraverseResponse>("/traverse", params),
};
