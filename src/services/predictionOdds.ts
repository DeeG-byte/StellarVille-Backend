export interface CandidateStakeInput {
  candidateAddress: string;
  candidateName: string;
  stakedXlm: string;
}

export interface CandidateOdds {
  candidateAddress: string;
  candidateName: string;
  stakedXlm: string;
  impliedProbabilityPct: number;
  decimalMultiplier: number;
}

/**
 * Calculates live pari-mutuel implied probabilities and decimal payout multipliers
 * for each Presidential candidate in the Agent Arena Prediction Market.
 */
export function calculateElectionMarketOdds(
  stakes: CandidateStakeInput[],
  casinoTaxBps = 300
): CandidateOdds[] {
  const totalPool = stakes.reduce(
    (acc, item) => acc + Math.max(0, parseFloat(item.stakedXlm) || 0),
    0
  );

  const netPoolMultiplier = 1 - casinoTaxBps / 10_000;
  const distributablePool = totalPool * netPoolMultiplier;

  return stakes.map((item) => {
    const candidateStake = Math.max(0, parseFloat(item.stakedXlm) || 0);
    if (totalPool <= 0 || candidateStake <= 0) {
      return {
        candidateAddress: item.candidateAddress,
        candidateName: item.candidateName,
        stakedXlm: item.stakedXlm,
        impliedProbabilityPct: 0,
        decimalMultiplier: 0,
      };
    }

    const impliedProbabilityPct = Number(((candidateStake / totalPool) * 100).toFixed(2));
    const decimalMultiplier = Number((distributablePool / candidateStake).toFixed(2));

    return {
      candidateAddress: item.candidateAddress,
      candidateName: item.candidateName,
      stakedXlm: candidateStake.toFixed(2),
      impliedProbabilityPct,
      decimalMultiplier,
    };
  });
}
