import toposort from "toposort";

import { Connection, Node } from "@/generated/prisma";

export const topologicalSort = (nodes: Node[], connections: Connection[]): Node[] => {
  // if no connections, return nodes as is
  if (connections.length === 0) {
    return nodes;
  }

  // create edges array for toposort
  const edges: [ string, string ][] = connections.map((connection) => [
    connection.fromNodeId,
    connection.toNodeId,
  ]);

  // add nodes with no connections as self edges to ensure they are included in the sort
  const connectedNodeIds = new Set<string>();
  for (const [ fromNodeId, toNodeId ] of edges) {
    connectedNodeIds.add(fromNodeId);
    connectedNodeIds.add(toNodeId);
  }

  for (const node of nodes) {
    if (!connectedNodeIds.has(node.id)) {
      edges.push([ node.id, node.id ]);
    }
  }

  // perform topological sort
  let sortedNodeIds: string[];

  try {
    sortedNodeIds = toposort(edges);
    // remove duplicates from self edges
    sortedNodeIds = [ ...new Set(sortedNodeIds) ];
  } catch (error) {
    if (error instanceof Error && error.message.includes("Cyclic")) {
      throw new Error("Workflow contains a cycle");
    }
    throw error;
  }

  // map sorted IDs back to node objects
  const nodeMap = new Map(nodes.map((n) => [ n.id, n ]));

  return sortedNodeIds
    .map((id) => nodeMap.get(id)!)
    .filter(Boolean);
};