import { useState, useCallback } from "react";
import { api } from "../api/client";
import type { TraverseResponse, Algorithm } from "../types/api";

interface TraversalParams {
  url: string;
  rawHtml: string;
  algorithm: Algorithm;
  selector: string;
  topN: number;
}

export function useTraversal() {
  const [data, setData] = useState<TraverseResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (params: TraversalParams) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.traverse({
        url: params.url || undefined,
        rawHtml: params.rawHtml || undefined,
        algorithm: params.algorithm,
        selector: params.selector,
        topN: params.topN,
      });
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, run };
}
