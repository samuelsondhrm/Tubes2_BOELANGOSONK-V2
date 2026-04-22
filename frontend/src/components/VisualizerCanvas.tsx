import { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { DOMNode } from "../types/api";

const H_GAP = 180;
const V_GAP = 120;

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
  startX: number
): number {
  let currentX = startX;
  let subtreeWidth = 0;

  for (const child of node.children ?? []) {
    const w = computeLayout(
      child, visitedSet, matchedSet, pathSet,
      result, edges, node.id, depth + 1, currentX
    );
    subtreeWidth += w;
    currentX += w;
  }

  const width = Math.max(1, subtreeWidth);
  const x = (startX + width / 2) * H_GAP;
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
      type: "smoothstep",
      animated: isActive,
      style: {
        stroke: isActive ? "#ff5a1f" : "rgba(255, 255, 255, 0.15)",
        strokeWidth: isActive ? 2 : 1,
        filter: isActive ? "drop-shadow(0 0 5px rgba(255, 90, 31, 0.5))" : "none",
      },
    });
  }

  return width;
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
    computeLayout(
      tree, visitedSet, matchedSet, pathSet,
      layoutNodes, layoutEdges, null, 0, 0
    );

    const rfNodes: Node[] = layoutNodes.map((n) => ({
      id: n.id,
      position: { x: n.x, y: n.y },
      data: { 
        label: (
          <div className="flex flex-col items-center">
            <span style={{ fontSize: '9px', opacity: 0.6, marginBottom: '2px', fontFamily: 'monospace' }}>
              ID: {n.id}
            </span>
            <span>{buildLabel(n)}</span>
          </div>
        )
      },
      className: `rf-node rf-node-${n.status}`,
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
      </ReactFlow>
    </div>
  );
}
