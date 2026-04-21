import { useState, useCallback } from "react";
import { api } from "../api/client";
import type {
  Algorithm,
  BackendTraverseResponse,
  DOMNode,
  TraversalData,
  LogEntry,
} from "../types/api";

export interface TraversalParams {
  url: string;
  rawHtml: string;
  algorithm: Algorithm;
  selector: string;
  topN: number;
}


function buildParentMap(
  node: DOMNode,
  parentId: string | null,
  map: Map<string, string>
) {
  if (parentId) map.set(node.id, parentId);
  for (const child of node.children ?? []) {
    buildParentMap(child, node.id, map);
  }
}

function computePathIds(tree: DOMNode, matchedIds: string[]): string[] {
  if (matchedIds.length === 0) return [];

  const parentMap = new Map<string, string>();
  buildParentMap(tree, null, parentMap);

  const pathSet = new Set<string>();
  for (const id of matchedIds) {
    let current: string | undefined = id;
    while (current) {
      if (pathSet.has(current)) break; // already traced this path
      pathSet.add(current);
      current = parentMap.get(current);
    }
  }
  return Array.from(pathSet);
}


function transformResponse(raw: BackendTraverseResponse): TraversalData {
  const matches = raw.matches ?? [];
  const matchedIds = matches.map((m) => m.id);
  const visitedIds = raw.log.map((l) => l.node_id);
  const pathIds = computePathIds(raw.tree, matchedIds);

  const log: LogEntry[] = raw.log.map((l) => ({
    step: l.step,
    nodeId: l.node_id,
    tag: l.tag,
    status: l.status,
  }));

  return {
    tree: raw.tree,
    maxDepth: raw.max_depth,
    matches,
    matchedIds,
    visitedIds,
    pathIds,
    nodesVisited: raw.visited_count,
    elapsedMs: raw.duration_ms,
    log,
  };
}


export function useTraversal() {
  const [data, setData] = useState<TraversalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (params: TraversalParams) => {
    setLoading(true);
    setError(null);
    try {
      const raw = await api.traverse({
        url: params.url || undefined,
        rawHtml: params.rawHtml || undefined,
        algorithm: params.algorithm,
        selector: params.selector,
        topN: params.topN,
      });
      const transformed = transformResponse(raw);
      setData(transformed);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, run };
}
