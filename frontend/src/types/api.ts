export type Algorithm = "BFS" | "DFS";

export interface DOMNode {
  id: string;
  tag: string;
  classes: string[];
  idAttr: string;
  attributes: Record<string, string>;
  children: DOMNode[];
  depth: number;
  parent_id?: string;
}

export interface BackendTraverseResponse {
  tree: DOMNode;
  matches: DOMNode[];
  visited_count: number;
  duration_ms: number;
  max_depth: number;
  log: BackendLogEntry[];
}

export interface BackendLogEntry {
  step: number;
  node_id: string;
  tag: string;
  status: "visiting" | "matched" | "skipped";
}

export interface ScrapeResponse {
  rawHtml: string;
  tree: DOMNode;
  maxDepth: number;
}

export interface LCARequest {
  node_id_a: string;
  node_id_b: string;
}

export interface LCAResponse {
  lca_node: DOMNode;
  depth_a: number;
  depth_b: number;
}

export interface TraversalData {
  tree: DOMNode;
  maxDepth: number;
  matches: DOMNode[];
  matchedIds: string[];
  visitedIds: string[];
  pathIds: string[];
  nodesVisited: number;
  elapsedMs: number;
  log: LogEntry[];
}

export interface LogEntry {
  step: number;
  nodeId: string;
  tag: string;
  status: "visiting" | "matched" | "skipped";
}

export interface TraversalStep {
  step: number;
  node_id: string;
  tag: string;
  status: "visiting" | "matched" | "skipped";
}
