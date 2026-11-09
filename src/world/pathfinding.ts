export type LandmarkId =
  | "capitol_hall"
  | "central_bank"
  | "real_estate_exchange"
  | "bakery"
  | "agent_arena"
  | "commons_park";

export interface LandmarkZone {
  id: LandmarkId;
  name: string;
  entrance: { x: number; y: number };
  bounds: { x: number; y: number; width: number; height: number };
}

export const STELLARVILLE_LANDMARKS: Record<LandmarkId, LandmarkZone> = {
  capitol_hall: {
    id: "capitol_hall",
    name: "National Capitol Hall",
    entrance: { x: 16, y: 12 },
    bounds: { x: 12, y: 6, width: 8, height: 6 },
  },
  central_bank: {
    id: "central_bank",
    name: "StellarVille Central Bank",
    entrance: { x: 44, y: 12 },
    bounds: { x: 40, y: 6, width: 8, height: 6 },
  },
  real_estate_exchange: {
    id: "real_estate_exchange",
    name: "Real Estate & Commercial Exchange",
    entrance: { x: 16, y: 36 },
    bounds: { x: 12, y: 30, width: 8, height: 6 },
  },
  bakery: {
    id: "bakery",
    name: "Sunrise Artisan Bakery",
    entrance: { x: 30, y: 24 },
    bounds: { x: 28, y: 20, width: 5, height: 4 },
  },
  agent_arena: {
    id: "agent_arena",
    name: "Agent Casino & Prediction Arena",
    entrance: { x: 46, y: 38 },
    bounds: { x: 42, y: 32, width: 8, height: 6 },
  },
  commons_park: {
    id: "commons_park",
    name: "The Commons Public Park",
    entrance: { x: 32, y: 32 },
    bounds: { x: 28, y: 28, width: 8, height: 8 },
  },
};

interface AStarNode {
  x: number;
  y: number;
  g: number;
  f: number;
  parent?: AStarNode;
}

/**
 * Computes a Manhattan A* path on the 64x64 StellarVille tile grid.
 */
export function findPathToTile(
  start: { x: number; y: number },
  goal: { x: number; y: number },
  gridSize = 64
): Array<{ x: number; y: number }> {
  const key = (x: number, y: number) => `${x},${y}`;
  const heuristic = (x: number, y: number) => Math.abs(x - goal.x) + Math.abs(y - goal.y);

  const open: AStarNode[] = [
    { x: start.x, y: start.y, g: 0, f: heuristic(start.x, start.y) },
  ];
  const visited = new Set<string>();

  while (open.length > 0) {
    open.sort((a, b) => a.f - b.f);
    const current = open.shift()!;
    if (current.x === goal.x && current.y === goal.y) {
      const path: Array<{ x: number; y: number }> = [];
      let curr: AStarNode | undefined = current;
      while (curr) {
        path.unshift({ x: curr.x, y: curr.y });
        curr = curr.parent;
      }
      return path;
    }

    visited.add(key(current.x, current.y));
    const dirs = [
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
    ];

    for (const { dx, dy } of dirs) {
      const nx = current.x + dx;
      const ny = current.y + dy;
      if (nx < 0 || ny < 0 || nx >= gridSize || ny >= gridSize) continue;
      if (visited.has(key(nx, ny))) continue;

      const g = current.g + 1;
      const f = g + heuristic(nx, ny);
      if (!open.some((n) => n.x === nx && n.y === ny && n.g <= g)) {
        open.push({ x: nx, y: ny, g, f, parent: current });
      }
    }
  }

  return [start, goal];
}
