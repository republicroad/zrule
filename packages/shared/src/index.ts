export type DecisionGraphData = {
  nodes: unknown[];
  edges: unknown[];
};

export type Decision = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  graph: DecisionGraphData;
  version: number;
  organizationId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};
