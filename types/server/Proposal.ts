export interface Proposal
  extends Build,
    Upgrade,
    Withdraw,
    Mint,
    Allocate,
    Threshold,
    Tax,
    Burn {
  id?: string;
  type: ProposalType;
}

export const ProposalTypes = [
  "BUILD",
  "UPGRADE",
  "WITHDRAW",
  "MINT",
  "ALLOCATE",
  "THRESHOLD",
  "TAX",
  "BURN",
];

interface Build {
  blueprintName?: string;
}

interface Upgrade {
  stationId?: string | "Townhall";
}

interface Withdraw {
  citizen?: string; //character mint
  resources?: { resourceName: string; amount: number }[];
  bonk?: string;
}

interface Mint {
  newSharesToMint?: string; //bigint
}

interface Allocate {
  citizen?: string;
  amount?: string;
}

interface Threshold {
  newThreshold?: string; //bigint
}

interface Tax {
  newTaxRate?: number;
}

interface Burn {
  resources?: { resourceName: string; amount: number }[];
}
