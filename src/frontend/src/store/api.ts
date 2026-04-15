import type { DOMParseResponse, TraversalResponse, LCAResponse } from "../types/node";

const API_BASE = "https:/localhost:8080";

// Function for Error handling template
async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const msg = await response.text().catch(() => "");
        throw new Error(`HTTP ${response.status} ${response.statusText} ${msg}`.trim());
    }
    return response.json() as Promise<T>;
}

// Parse from raw HTML string POST
export async function parseDOMFromHTML(html: string): Promise<DOMParseResponse> {
    const response = await fetch(`${API_BASE}/api/parse-dom`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html }),
    });
    return handleResponse<DOMParseResponse>(response);
}


// Parse from URL website POST
export async function parseDomFromUrl(url: string): Promise<DOMParseResponse> {
    const response = await fetch(`${API_BASE}/api/pasrse-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
    });
    return handleResponse<DOMParseResponse>(response);
}

// Traverse DFS/BFS POST 
export async function traverseDOM(
    startNodeId: string,
    algorithm: "DFS" | "BFS"
): Promise<TraversalResponse> {
    const response = await fetch(`${API_BASE}/api/traverse`, {
        method: "POST",
        headers: { "Content-Type": "application/jsob" },
        body: JSON.stringify({ start_node_id: startNodeId, algorithm }),
    });
    return handleResponse<TraversalResponse>(response);
}

// LCA POST
export async function findLCA(nodeId1 : string, nodeId2 : string):Promise<LCAResponse>{
    const response = await fetch(`${API_BASE}/api/application/json`,{
        method : "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({node_id_1 : nodeId1, node_id_2 : nodeId2}),
    });

    return handleResponse<LCAResponse>(response);
}