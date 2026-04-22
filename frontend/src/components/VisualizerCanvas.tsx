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
const V_GAP = 90;

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
  result: LayoutNode[],
  edges: Edge[],
  parentId: string | null,
  depth: number,
  siblingIndex: { val: number }
): number {
  let subtreeWidth = 0;
  const childSibIdx = { val: 0 };

  for (const child of node.children ?? []) {
    const w = computeLayout(
      child, visitedSet, matchedSet, pathSet,
      result, edges, node.id, depth + 1, childSibIdx
    );
    subtreeWidth += w;
    childSibIdx.val++;
  }

  const width = Math.max(1, subtreeWidth);
  const myIndex = siblingIndex.val;
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
    classes: node.classes ?? [],
    depth: node.depth,
    status,
    x,
    y,
  });

  if (parentId) {
    const isActive = status === "matched" || status === "path";
    edges.push({
      id: `e-${parentId}-${node.id}`,
      source: parentId,
      target: node.id,
      style: {
        stroke: isActive ? "#ff5a1f" : "rgba(255, 90, 31, 0.2)",
        strokeWidth: isActive ? 2.5 : 1.5,
        filter: isActive ? "drop-shadow(0 0 8px rgba(255, 90, 31, 0.8))" : "none",
      },
    });
  }

  return width;
}

function getNodeStyle(status: NodeStatus): React.CSSProperties {
  switch (status) {
    case "matched":
      return {
        background: "rgba(10, 10, 11, 0.8)",
        border: "1px solid rgba(255, 90, 31, 0.5)",
        color: "rgba(255, 255, 255, 0.9)",
        boxShadow: "0 0 12px rgba(255, 90, 31, 0.3)",
        borderRadius: 6,
        padding: "4px 10px",
        fontSize: 11,
        fontFamily: "'Space Grotesk', monospace",
        fontWeight: 700,
        minWidth: 70,
        textAlign: "center",
      };
    case "path":
      return {
        background: "rgba(10, 10, 11, 0.7)",
        border: "1px solid rgba(255, 90, 31, 0.3)",
        color: "rgba(255, 255, 255, 0.8)",
        boxShadow: "0 0 8px rgba(255, 90, 31, 0.15)",
        borderRadius: 6,
        padding: "4px 10px",
        fontSize: 11,
        fontFamily: "'Space Grotesk', monospace",
        fontWeight: 600,
        minWidth: 70,
        textAlign: "center",
      };
    case "visited":
      return {
        background: "rgba(10, 10, 11, 0.6)",
        border: "1px solid rgba(255, 90, 31, 0.15)",
        color: "rgba(255, 255, 255, 0.6)",
        borderRadius: 6,
        padding: "4px 10px",
        fontSize: 11,
        fontFamily: "'Space Grotesk', monospace",
        minWidth: 70,
        textAlign: "center",
      };
    default:
      return {
        background: "rgba(10, 10, 11, 0.6)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        color: "rgba(255, 255, 255, 0.5)",
        borderRadius: 6,
        padding: "4px 10px",
        fontSize: 11,
        fontFamily: "'Space Grotesk', monospace",
        minWidth: 70,
        textAlign: "center",
      };
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
  visitedIds?: string[];
  matchedIds?: string[];
  pathIds?: string[];
}

export function VisualizerCanvas({
  tree,
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
    const sibIdx = { val: 0 };
    computeLayout(
      tree, visitedSet, matchedSet, pathSet,
      layoutNodes, layoutEdges, null, 0, sibIdx
    );

    const rfNodes: Node[] = layoutNodes.map((n) => ({
      id: n.id,
      position: { x: n.x, y: n.y },
      data: { label: buildLabel(n) },
      style: getNodeStyle(n.status),
    }));

    return { nodes: rfNodes, edges: layoutEdges };
  }, [tree, visitedSet, matchedSet, pathSet]);

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        minZoom={0.03}
        maxZoom={2}
        style={{ background: "transparent" }}
      >
        <Background color="rgba(255, 90, 31, 0.03)" gap={30} />
        <Controls />
        <MiniMap
          nodeColor={() => "rgba(255, 90, 31, 0.5)"}
          maskColor="rgba(0,0,0,0.5)"
        />
      </ReactFlow>
    </div>
  );
}
