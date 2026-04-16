import { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { DOMNode } from "../types/api";

const H_GAP = 220;
const V_GAP = 80;

type NodeStatus = "default" | "visited" | "matched" | "path";

interface LayoutNode {
  id: string;
  tag: string;
  idAttr: string;
  classes: string[];
  depth: number;
  status: NodeStatus;
  x: number;
  y: number;
}

function computeLayout(
  node: DOMNode,
  visitedSet: Set<string>,
  matchedSet: Set<string>,
  pathSet: Set<string>,
  counterRef: { val: number },
  result: LayoutNode[],
  edges: Edge[],
  parentId: string | null,
  depth: number,
  siblingIndex: { val: number }
): number {
  const myIndex = siblingIndex.val;
  let subtreeWidth = 0;
  let childSibIdx = { val: 0 };
  const childWidths: number[] = [];

  for (const child of node.children) {
    const w = computeLayout(
      child, visitedSet, matchedSet, pathSet,
      counterRef, result, edges, node.id, depth + 1, childSibIdx
    );
    childWidths.push(w);
    subtreeWidth += w;
    childSibIdx.val++;
  }

  const width = Math.max(1, subtreeWidth);

  const x = (myIndex + width / 2 - 0.5) * H_GAP;
  const y = depth * V_GAP;

  let status: NodeStatus = "default";
  if (matchedSet.has(node.id)) status = "matched";
  else if (pathSet.has(node.id)) status = "path";
  else if (visitedSet.has(node.id)) status = "visited";

  result.push({
    id: node.id,
    tag: node.tag,
    idAttr: node.idAttr,
    classes: node.classes,
    depth: node.depth,
    status,
    x,
    y,
  });

  if (parentId) {
    edges.push({
      id: `e-${parentId}-${node.id}`,
      source: parentId,
      target: node.id,
      style: { stroke: "#334155", strokeWidth: 1.5 },
    });
  }

  return width;
}

function getNodeColors(status: NodeStatus) {
  switch (status) {
    case "matched":
      return { bg: "#22c55e", border: "#16a34a", text: "#fff" };
    case "path":
      return { bg: "#f59e0b", border: "#d97706", text: "#fff" };
    case "visited":
      return { bg: "#6366f1", border: "#4338ca", text: "#fff" };
    default:
      return { bg: "#1e293b", border: "#334155", text: "#94a3b8" };
  }
}

function buildLabel(n: LayoutNode): string {
  let label = `<${n.tag}>`;
  if (n.idAttr) label += ` #${n.idAttr}`;
  if (n.classes.length) label += ` .${n.classes.join(".")}`;
  return label;
}

interface Props {
  tree: DOMNode;
  maxDepth: number;
  visitedIds?: string[];
  matchedIds?: string[];
  pathIds?: string[];
}

export function DOMTreeVisualizer({
  tree,
  maxDepth,
  visitedIds = [],
  matchedIds = [],
  pathIds = [],
}: Props) {
  const visitedSet = useMemo(() => new Set(visitedIds), [visitedIds]);
  const matchedSet = useMemo(() => new Set(matchedIds), [matchedIds]);
  const pathSet = useMemo(() => new Set(pathIds), [pathIds]);

  const { nodes, edges } = useMemo(() => {
    const layoutNodes: LayoutNode[] = [];
    const layoutEdges: Edge[] = [];
    const counter = { val: 0 };
    const sibIdx = { val: 0 };
    computeLayout(
      tree, visitedSet, matchedSet, pathSet,
      counter, layoutNodes, layoutEdges, null, 0, sibIdx
    );

    const rfNodes: Node[] = layoutNodes.map((n) => {
      const colors = getNodeColors(n.status);
      return {
        id: n.id,
        position: { x: n.x, y: n.y },
        data: { label: buildLabel(n) },
        style: {
          background: colors.bg,
          border: `2px solid ${colors.border}`,
          color: colors.text,
          borderRadius: 6,
          padding: "4px 10px",
          fontSize: 12,
          fontFamily: "monospace",
          minWidth: 80,
          textAlign: "center" as const,
          boxShadow: n.status !== "default" ? "0 0 8px rgba(255,255,255,0.15)" : "none",
        },
      };
    });

    return { nodes: rfNodes, edges: layoutEdges };
  }, [tree, visitedSet, matchedSet, pathSet]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          zIndex: 10,
          background: "rgba(15,23,42,0.85)",
          border: "1px solid #334155",
          borderRadius: 8,
          padding: "8px 14px",
          fontSize: 12,
          color: "#94a3b8",
          backdropFilter: "blur(4px)",
        }}
      >
        <span style={{ color: "#e2e8f0", fontWeight: 600 }}>Max Depth:</span>{" "}
        {maxDepth}
        <Legend />
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        minZoom={0.05}
        maxZoom={2}
        style={{ background: "#0f172a" }}
      >
        <Background color="#1e293b" gap={20} />
        <Controls style={{ background: "#1e293b", border: "1px solid #334155" }} />
        <MiniMap
          nodeColor={(n) => {
            const bg = (n.style?.background as string) ?? "#1e293b";
            return bg;
          }}
          style={{ background: "#0f172a", border: "1px solid #334155" }}
          maskColor="rgba(0,0,0,0.4)"
        />
      </ReactFlow>
    </div>
  );
}

function Legend() {
  const items = [
    { color: "#22c55e", label: "Matched" },
    { color: "#f59e0b", label: "Path" },
    { color: "#6366f1", label: "Visited" },
    { color: "#1e293b", label: "Unvisited" },
  ];
  return (
    <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
      {items.map((i) => (
        <div key={i.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              background: i.color,
              border: "1px solid rgba(255,255,255,0.2)",
              flexShrink: 0,
            }}
          />
          <span>{i.label}</span>
        </div>
      ))}
    </div>
  );
}
