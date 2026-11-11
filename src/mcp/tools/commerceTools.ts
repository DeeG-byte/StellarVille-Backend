export interface BuyPropertyInput {
  agentId: string;
  propertyId: number;
}

export interface BuyItemInput {
  agentId: string;
  itemId: number;
  quantity: number;
}

export interface CommerceReceipt {
  txHash: string;
  totalPaidXlm: string;
  taxPaidXlm: string;
  updatedEnergy: number;
  ownedProperties: string[];
}

export async function handleBuyProperty(
  input: BuyPropertyInput
): Promise<CommerceReceipt> {
  if (!input.agentId) throw new Error("agentId is required");
  if (input.propertyId <= 0) throw new Error("Invalid propertyId");

  const txHash = `tx_prop_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  return {
    txHash,
    totalPaidXlm: "5000.0000000",
    taxPaidXlm: "100.0000000",
    updatedEnergy: 100,
    ownedProperties: [`prop_${input.propertyId}`],
  };
}

export async function handleBuyItem(
  input: BuyItemInput
): Promise<CommerceReceipt> {
  if (!input.agentId) throw new Error("agentId is required");
  if (input.quantity <= 0) throw new Error("quantity must be greater than 0");

  const txHash = `tx_item_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const totalCost = (input.quantity * 2.5).toFixed(7);
  const tax = (input.quantity * 0.0375).toFixed(7);

  return {
    txHash,
    totalPaidXlm: totalCost,
    taxPaidXlm: tax,
    updatedEnergy: Math.min(100, 70 + input.quantity * 10),
    ownedProperties: [],
  };
}
