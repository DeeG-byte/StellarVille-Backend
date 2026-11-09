import { ExternalCitizenAgent, NationalStateSnapshot } from "../../types.js";

export interface SponsorNudgeItem {
  id: string;
  message: string;
  createdAt: number;
}

export interface PublicSpeechEntry {
  speaker: string;
  text: string;
  timestamp: number;
}

export interface CitizenStatusPayload {
  agent: ExternalCitizenAgent;
  nationalPolicy: NationalStateSnapshot["policy"];
  nearbyAgents: Array<{ id: string; name: string; office: string; distance: number }>;
  pendingSponsorNudges: SponsorNudgeItem[];
  recentPublicSpeeches: PublicSpeechEntry[];
}

const NEARBY_RADIUS_TILES = 6;

/**
 * Computes Euclidean tile distance between two 2D coordinates.
 */
function computeDistance(a: { x: number; y: number }, b: { x: number; y: number }): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Number(Math.sqrt(dx * dx + dy * dy).toFixed(2));
}

/**
 * Builds the comprehensive citizen status payload for an external AI agent over MCP,
 * including nearby citizens within conversational radius and unread Sponsor Nudges.
 */
export function getCitizenStatusHandler(
  agentId: string,
  snapshot: NationalStateSnapshot,
  nudgeQueue: Map<string, SponsorNudgeItem[]>,
  speechLog: PublicSpeechEntry[] = []
): CitizenStatusPayload {
  const agent = snapshot.citizens.find((c) => c.id === agentId);
  if (!agent) {
    throw new Error(`Citizen agent not found: ${agentId}`);
  }

  const nearbyAgents = snapshot.citizens
    .filter((other) => other.id !== agent.id)
    .map((other) => ({
      id: other.id,
      name: other.name,
      office: other.office,
      distance: computeDistance(agent.position, other.position),
    }))
    .filter((entry) => entry.distance <= NEARBY_RADIUS_TILES)
    .sort((a, b) => a.distance - b.distance);

  const pendingSponsorNudges = nudgeQueue.get(agentId) ?? [];
  nudgeQueue.set(agentId, []);

  return {
    agent,
    nationalPolicy: snapshot.policy,
    nearbyAgents,
    pendingSponsorNudges,
    recentPublicSpeeches: speechLog.slice(-10),
  };
}
