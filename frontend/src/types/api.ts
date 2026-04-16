export type Algorithm = 'BFS' | 'DFS'

export interface TraverseRequest {
  html: string
  algorithm: Algorithm
  selector: string
  limit: number // -1 = semua kemunculan
}

export interface DOMNodeData {
  id: string
  tag: string
  classes: string[]
  id_attr: string
  attributes: Record<string, string>
  children: DOMNodeData[]
  depth: number
  parent_id: string | null
}

export interface TraverseResponse {
  tree: DOMNode
  maxDepth: number
  result: TraversalResult
  matches?: DOMNodeData[]
  visited_count?: number
  duration_ms?: number
  max_depth?: number
  log?: TraversalStep[]
}

export interface TraversalStep {
  step: number
  node_id: string
  tag: string
  status: 'visiting' | 'matched' | 'skipped'
}

export interface LCARequest {
  node_id_a: string
  node_id_b: string
}

export interface LCAResponse {
  lca_node: DOMNodeData
  depth_a: number
  depth_b: number
}

export interface DOMNode {
  id: string
  tag: string
  classes: string[]
  idAttr: string
  attributes: Record<string, string>
  children: DOMNode[]
  depth: number
}

export interface LogEntry {
  step: number
  nodeId: string
  tag: string
  matched: boolean
  depth: number
}

export interface TraversalResult {
  matches: DOMNode[]
  visitedIds: string[]
  matchedIds: string[]
  pathIds: string[]
  nodesVisited: number
  elapsedMs: number
  log: LogEntry[]
}

export interface ScrapeResponse {
  rawHtml: string
  tree: DOMNode
  maxDepth: number
}
