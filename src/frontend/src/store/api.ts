import type { DOMParseResponse, MultiTraversalResponse } from "../types/node";

const API_BASE = "http://localhost:8080";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const msg = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status} ${response.statusText} ${msg}`.trim());
  }
  return response.json() as Promise<T>;
}

// Expected backend response:
// {
//   "nodes": [...],
//   "root_id": "1",
//   "html": "<html>...</html>" 
// }
export async function parseDOMFromHTML(html: string): Promise<DOMParseResponse> {
  const response = await fetch(`${API_BASE}/api/parse-dom`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ html }),
  });
  return handleResponse<DOMParseResponse>(response);
}

// Expected backend response:
// {
//   "nodes": [...],
//   "root_id": "1",
//   "html": "<html>...</html>" 
// }
export async function parseDomFromUrl(url: string): Promise<DOMParseResponse> {
  // Fixed typo: pasrse-url -> parse-url
  const response = await fetch(`${API_BASE}/api/parse-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  return handleResponse<DOMParseResponse>(response);
}

// Expected backend response (Concurrent Map):
// {
//   "div": { "traversalOrder": ["5", "9"], "traversalLength": 10, "algorithm": "DFS" },
//   "p": { "traversalOrder": ["14"], "traversalLength": 5, "algorithm": "DFS" }
// }
export async function traverseDOM(
  url: string,
  html: string,
  selector: string,
  algorithm: "DFS" | "BFS",
  resultLimit: number
): Promise<MultiTraversalResponse> {
  const response = await fetch(`${API_BASE}/api/traverse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: url,
      html: html,
      algorithm: algorithm,
      css_selector: selector,
      result_limit: resultLimit,
    }),
  });
  return handleResponse<MultiTraversalResponse>(response);
}
