export interface Node {
  id: string;
  tag: string;
  classes: string[];
  attributes: Record<string, string>;
  text?: string;
  children: string[];
  parent_id?: string | null;
}

export interface DOMParseResponse {
  nodes: Node[];
  root_id: string;
  html?: string;
}

export interface TraversalResponse {
  traversalOrder: string[];
  traversalLength: number;
  algorithm: "DFS" | "BFS" | string;
}
