// Townhall
export const TOWNHALL = {
    upgradeTimeMuliplier: 1000 * 60 * 60, // 1hr * level, level 10 would take 10 hours
    upgradeBonkMultiplier: 500000, // 15c*level, level 10 would cost around $15-20
  };
  
  export interface Station {
    id: string;
    faction: string;
    blueprint: string;
    level: string;
  }
  
  export interface Blueprint {
    name: string;
    image: string;
    description: string;
    upgradeTimeMultiplier: number;
    maxLevel: number;
    upgradeResource: { resource: string; amount: number }[][];
    inputs: { resource: string; amount: number }[];
    timeRequired: number;
    unitOutput?: string[]; // if combat station
    resourceOutput?: string[]; // if non combat station
  }
  
  export const BLUEPRINTS: Blueprint[] = [];