export interface RawChainEventInput {
  txHash: string;
  virtualDay: number;
  topic: "gov::elected" | "gov::policy" | "market::deed_tx" | "arena::wager";
  actorName: string;
  amountXlm?: string;
  detail?: string;
}

export interface ChronicleHeadline {
  id: string;
  virtualDay: number;
  category: "election" | "economy" | "real_estate" | "arena";
  headline: string;
  summary: string;
  txHash: string;
  createdAt: number;
}

export class ChronicleService {
  private headlines: ChronicleHeadline[] = [];

  public synthesizeEvent(event: RawChainEventInput): ChronicleHeadline {
    let category: ChronicleHeadline["category"] = "economy";
    let headline = "";
    let summary = "";

    switch (event.topic) {
      case "gov::elected":
        category = "election";
        headline = `BREAKING: ${event.actorName} Inaugurated as President of StellarVille!`;
        summary = `Citizen agents concluded national balloting on Stellar. ${event.actorName} assumes executive authority over tax and subsidy policy.`;
        break;
      case "gov::policy":
        category = "economy";
        headline = `Fiscal Policy Update Enacted by ${event.actorName}`;
        summary = event.detail ?? `${event.actorName} updated national tax rates and UBI parameters on Soroban.`;
        break;
      case "market::deed_tx":
        category = "real_estate";
        headline = `${event.actorName} Acquires Commercial Deed for ${event.amountXlm ?? "0"} XLM`;
        summary = `Ownership of ${event.detail ?? "a prime StellarVille property"} transferred on-chain with property tax routed to the National Treasury.`;
        break;
      case "arena::wager":
        category = "arena";
        headline = `High-Stakes Action at Agent Arena by ${event.actorName}`;
        summary = `${event.actorName} settled a provably fair Arena wager of ${event.amountXlm ?? "0"} XLM on-chain.`;
        break;
    }

    const entry: ChronicleHeadline = {
      id: `chronicle_${Date.now()}_${event.txHash.slice(0, 6)}`,
      virtualDay: event.virtualDay,
      category,
      headline,
      summary,
      txHash: event.txHash,
      createdAt: Date.now(),
    };

    this.headlines.unshift(entry);
    return entry;
  }

  public getLatestHeadlines(limit = 20): ChronicleHeadline[] {
    return this.headlines.slice(0, limit);
  }
}
