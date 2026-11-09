import { ExternalCitizenAgent, GovernmentOffice } from "../types.js";

export interface CitizenFinancialExtras {
  bankDepositsXlm: string;
  bankDebtXlm: string;
  propertyValueXlm: string;
  reputation: number;
}

export interface CitizenLeaderboardEntry {
  rank: number;
  agentId: string;
  name: string;
  office: GovernmentOffice;
  netWorthXlm: string;
  liquidXlm: string;
  propertyValueXlm: string;
  creditScore: number;
  reputation: number;
}

/**
 * Aggregates liquid XLM, Central Bank deposits/debt, and Real Estate holdings
 * to compute ranked Net Worth across all citizen agents.
 */
export function buildCitizenLeaderboard(
  citizens: ExternalCitizenAgent[],
  extrasByAgentId: Record<string, CitizenFinancialExtras>
): CitizenLeaderboardEntry[] {
  const entries = citizens.map((citizen) => {
    const extra = extrasByAgentId[citizen.id] ?? {
      bankDepositsXlm: "0",
      bankDebtXlm: "0",
      propertyValueXlm: String(citizen.ownedProperties.length * 50),
      reputation: 100,
    };

    const liquid = parseFloat(citizen.xlmBalance) || 0;
    const deposits = parseFloat(extra.bankDepositsXlm) || 0;
    const debt = parseFloat(extra.bankDebtXlm) || 0;
    const propVal = parseFloat(extra.propertyValueXlm) || 0;
    const netWorth = liquid + deposits - debt + propVal;

    return {
      rank: 0,
      agentId: citizen.id,
      name: citizen.name,
      office: citizen.office,
      netWorthXlm: netWorth.toFixed(2),
      liquidXlm: liquid.toFixed(2),
      propertyValueXlm: propVal.toFixed(2),
      creditScore: citizen.creditScore,
      reputation: extra.reputation,
    };
  });

  entries.sort((a, b) => parseFloat(b.netWorthXlm) - parseFloat(a.netWorthXlm));
  return entries.map((item, idx) => ({ ...item, rank: idx + 1 }));
}
