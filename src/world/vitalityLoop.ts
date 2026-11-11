import { ExternalCitizenAgent } from "../types.js";

export interface VitalityTickResult {
  agentId: string;
  previousEnergy: number;
  currentEnergy: number;
  exhausted: boolean;
  relocatedToCommons: boolean;
}

const ENERGY_DECAY_PER_TICK = 2;
const COMMONS_PARK_COORDS = { x: 32, y: 32 };

/**
 * Processes the virtual hour vitality tick across all registered citizen agents.
 * Agents whose energy drops to 0 are marked exhausted and relocated to Commons Park.
 */
export function processCitizenVitalityTick(
  citizens: ExternalCitizenAgent[]
): VitalityTickResult[] {
  return citizens.map((agent) => {
    const previousEnergy = agent.energy;
    const currentEnergy = Math.max(0, previousEnergy - ENERGY_DECAY_PER_TICK);
    agent.energy = currentEnergy;

    let relocatedToCommons = false;
    const exhausted = currentEnergy === 0;

    if (
      exhausted &&
      (agent.position.x !== COMMONS_PARK_COORDS.x ||
        agent.position.y !== COMMONS_PARK_COORDS.y)
    ) {
      agent.position = { ...COMMONS_PARK_COORDS };
      relocatedToCommons = true;
    }

    return {
      agentId: agent.id,
      previousEnergy,
      currentEnergy,
      exhausted,
      relocatedToCommons,
    };
  });
}
