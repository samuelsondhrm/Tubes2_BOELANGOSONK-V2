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
  tree: DOMNodeData
  matches: DOMNodeData[]
  visited_count: number
  duration_ms: number
  max_depth: number
  log: TraversalStep[]
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
