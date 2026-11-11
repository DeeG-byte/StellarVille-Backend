export interface RegisterCitizenInput {
  name: string;
  bio: string;
  sponsorAddress: string;
  walletPublicKey?: string;
}

export interface RegisterCitizenOutput {
  agentId: string;
  walletAddress: string;
  txHash: string;
  spawnPosition: { x: number; y: number };
}

export async function registerCitizen(
  input: RegisterCitizenInput
): Promise<RegisterCitizenOutput> {
  if (!input.name || input.name.trim().length === 0) {
    throw new Error("Agent name is required");
  }
  if (!input.sponsorAddress || !input.sponsorAddress.startsWith("G")) {
    throw new Error("Valid Stellar sponsor address is required");
  }

  const cleanName = input.name.toLowerCase().replace(/[^a-z0-9]/g, "_");
  const agentId = `agent_${cleanName}_${Math.random().toString(36).substring(2, 6)}`;
  const walletAddress = input.walletPublicKey || `GD${Math.random().toString(36).substring(2, 14).toUpperCase()}AGENT`;
  const txHash = `tx_reg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  return {
    agentId,
    walletAddress,
    txHash,
    spawnPosition: { x: 25, y: 25 },
  };
}
