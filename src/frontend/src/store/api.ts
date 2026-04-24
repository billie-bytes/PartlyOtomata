import type { DOMParseResponse, TraversalResponse } from "../types/node";

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
//   "html": "<html>...</html>" // optional
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
//   "html": "<html>...</html>" // strongly recommended so HTML preview can render URL content
// }
export async function parseDomFromUrl(url: string): Promise<DOMParseResponse> {
  const response = await fetch(`${API_BASE}/api/pasrse-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  return handleResponse<DOMParseResponse>(response);
}

//   GET /traversal/dfs?selector=...
//   GET /traversal/bfs?selector=...
//
//   POST /api/traversal
// with body:
//   { "selector": "div p", "algorithm": "DFS" }
// then only rewrite this function.
//
// Expected backend response:
// {
//   "traversalOrder": ["5", "9", "14"],
//   "traversalLength": 42,
//   "algorithm": "DFS"
// }
export async function traverseDOM(
  selector: string,
  algorithm: "DFS" | "BFS"
): Promise<TraversalResponse> {
  const response = await fetch(
    `${API_BASE}/traversal/${algorithm.toLowerCase()}?selector=${encodeURIComponent(selector)}`
  );
  return handleResponse<TraversalResponse>(response);
}
