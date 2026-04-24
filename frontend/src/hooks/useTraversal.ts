import { useState, useCallback, useEffect, useMemo } from "react";
import { SPEED_PRESETS } from "../components/PlaybackControls";
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
      if (pathSet.has(current)) break;
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
  const [fullData, setFullData] = useState<TraversalData | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(SPEED_PRESETS[1].ms);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (params: TraversalParams) => {
    setLoading(true);
    setError(null);
    setIsPlaying(false);
    try {
      const raw = await api.traverse({
        url: params.url || undefined,
        rawHtml: params.rawHtml || undefined,
        algorithm: params.algorithm,
        selector: params.selector,
        topN: params.topN,
      });
      const transformed = transformResponse(raw);
      setFullData(transformed);
      setCurrentStep(transformed.log.length);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan koneksi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let interval: number | undefined;
    if (isPlaying && fullData && currentStep < fullData.log.length) {
      const preset = SPEED_PRESETS.find((p) => p.ms === playbackSpeed) ?? SPEED_PRESETS[1];
      const batchSize = preset.batch;

      interval = window.setInterval(() => {
        setCurrentStep((prev) => {
          const next = prev + batchSize;
          return next >= (fullData?.log.length ?? 0) ? (fullData?.log.length ?? 0) : next;
        });
      }, playbackSpeed);
    } else if (isPlaying) {
      setIsPlaying(false);
    }
    return () => {
      if (interval !== undefined) clearInterval(interval);
    };
  }, [isPlaying, currentStep, fullData, playbackSpeed]);

  const animatedData = useMemo(() => {
    if (!fullData) return null;

    const slicedLog = fullData.log.slice(0, currentStep);
    const visitedIds = slicedLog.map((l) => l.nodeId);
    const visitedSet = new Set(visitedIds);
    const currentMatchedIds = fullData.matchedIds.filter((id) => visitedSet.has(id));
    const currentPathIds = computePathIds(fullData.tree, currentMatchedIds);

    return {
      ...fullData,
      visitedIds,
      matchedIds: currentMatchedIds,
      pathIds: currentPathIds,
    };
  }, [fullData, currentStep]);

  return {
    data: animatedData,
    fullData,
    loading,
    error,
    run,
    currentStep,
    totalSteps: fullData?.log.length ?? 0,
    isPlaying,
    setIsPlaying,
    setCurrentStep,
    playbackSpeed,
    setPlaybackSpeed,
    replay: () => {
      setCurrentStep(0);
      setIsPlaying(true);
    },
  };
}