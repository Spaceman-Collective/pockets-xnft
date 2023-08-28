export interface Proposal
  extends Build,
    Upgrade,
    Withdraw,
    Mint,
    Allocate,
    Threshold,
    Tax,
    Burn {
  created: string | number | Date;
  id?: string;
  type: string;
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