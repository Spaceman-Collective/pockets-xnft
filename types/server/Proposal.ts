export interface Proposal
  extends Build,
    Upgrade,
    ATK_City,
    ATK_RF,
    Withdraw,
    Mint,
    Allocate,
    Threshold,
    Warband,
    Tax,
    Burn {
  id?: string;
  type: ProposalType;
}

export type ProposalType =
  | "BUILD"
  | "UPGRADE"
  | "ATK_CITY"
  | "ATK_RF"
  | "WITHDRAW"
  | "MINT"
  | "ALLOCATE"
  | "THRESHOLD"
  | "WARBAND"
  | "TAX"
  | "BURN";

interface Build {
  blueprintName?: string;
}

interface Upgrade {
  stationId?: string | "Townhall";
}

interface ATK_City {
  factionId?: string;
}

interface ATK_RF {
  rfId?: string;
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

interface Warband {
  warband?: string[];
}

interface Tax {
  newTaxRate?: number;
}

interface Burn {
  resources?: { resourceName: string; amount: number }[];
}