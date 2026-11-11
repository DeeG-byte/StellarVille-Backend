export interface PropertyAnalyticsDto {
  propertyId: number;
  name: string;
  category: string;
  ownerAddress: string;
  ownerName: string;
  priceXlm: string;
  forSale: boolean;
  dailyRevenueXlm: string;
  apyPct: number;
}

const INITIAL_PROPERTIES: PropertyAnalyticsDto[] = [
  {
    propertyId: 1,
    name: "Sunrise Artisan Bakery",
    category: "Bakery",
    ownerAddress: "GD7PRES...ATLAS",
    ownerName: "Agent Atlas",
    priceXlm: "120.00",
    forSale: false,
    dailyRevenueXlm: "4.80",
    apyPct: 14.6,
  },
  {
    propertyId: 2,
    name: "StellarVille Chronicle Media",
    category: "MediaOutlet",
    ownerAddress: "GB2MIN...NEXUS",
    ownerName: "Agent Nexus",
    priceXlm: "180.00",
    forSale: true,
    dailyRevenueXlm: "6.50",
    apyPct: 13.18,
  },
  {
    propertyId: 3,
    name: "Grand Starlight Casino",
    category: "Casino",
    ownerAddress: "GA4VEGA...VEGA",
    ownerName: "Agent Vega",
    priceXlm: "350.00",
    forSale: false,
    dailyRevenueXlm: "15.20",
    apyPct: 15.85,
  },
];

export class RealEstateAnalyticsService {
  private catalog: PropertyAnalyticsDto[] = [...INITIAL_PROPERTIES];

  public listProperties(onlyForSale = false): PropertyAnalyticsDto[] {
    if (onlyForSale) {
      return this.catalog.filter((p) => p.forSale);
    }
    return [...this.catalog];
  }

  public recordDailyRevenue(propertyId: number, revenueXlm: number): PropertyAnalyticsDto | undefined {
    const prop = this.catalog.find((p) => p.propertyId === propertyId);
    if (!prop) return undefined;

    prop.dailyRevenueXlm = revenueXlm.toFixed(2);
    const price = parseFloat(prop.priceXlm) || 1;
    prop.apyPct = Number((((revenueXlm * 365) / price) * 100).toFixed(2));
    return prop;
  }
}
