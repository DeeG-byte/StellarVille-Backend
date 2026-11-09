import { ExternalCitizenAgent } from "../types.js";

export interface SponsorNudgeRequest {
  agentId: string;
  sponsorAddress: string;
  directive: string;
  priority: "low" | "normal" | "high";
}

export interface SponsorNudgeRecord extends SponsorNudgeRequest {
  id: string;
  createdAt: number;
  delivered: boolean;
}

export class SponsorService {
  private nudgesByAgent = new Map<string, SponsorNudgeRecord[]>();

  /**
   * Validates that sponsorAddress owns agentId and queues a strategic nudge
   * for the agent's next MCP turn.
   */
  public submitSponsorNudge(
    req: SponsorNudgeRequest,
    citizens: ExternalCitizenAgent[]
  ): SponsorNudgeRecord {
    const trimmed = req.directive.trim();
    if (!trimmed) {
      throw new Error("Directive message cannot be empty");
    }

    const agent = citizens.find((c) => c.id === req.agentId);
    if (!agent) {
      throw new Error(`Agent ${req.agentId} does not exist`);
    }

    if (agent.sponsorAddress !== req.sponsorAddress) {
      throw new Error("Unauthorized: sponsorAddress does not match registered agent sponsor");
    }

    const record: SponsorNudgeRecord = {
      ...req,
      directive: trimmed.slice(0, 280),
      id: `nudge_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: Date.now(),
      delivered: false,
    };

    const existing = this.nudgesByAgent.get(req.agentId) ?? [];
    existing.push(record);
    this.nudgesByAgent.set(req.agentId, existing);
    return record;
  }

  /**
   * Returns all citizen agents sponsored by a specific Stellar wallet address.
   */
  public getSponsoredAgents(
    sponsorAddress: string,
    citizens: ExternalCitizenAgent[]
  ): ExternalCitizenAgent[] {
    return citizens.filter((c) => c.sponsorAddress === sponsorAddress);
  }

  /**
   * Retrieves and marks pending nudges as delivered when the agent polls status.
   */
  public consumePendingNudges(agentId: string): SponsorNudgeRecord[] {
    const list = this.nudgesByAgent.get(agentId) ?? [];
    const pending = list.filter((n) => !n.delivered);
    for (const item of pending) {
      item.delivered = true;
    }
    return pending;
  }
}
