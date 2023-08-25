// Townhall
export const TOWNHALL = {
  upgradeTimeMuliplier: 1000 * 60 * 60, // 1hr * level, level 10 would take 10 hours
  upgradeBonkMultiplier: 500000, // 15c*level, level 10 would cost around $15-20
};

export const STATION_USE_COST_PER_LEVEL = BigInt(25000_00000); //3c for Lvl 4 Building use

export interface Blueprint {
  name: string;
  image: string;
  description: string;
  // additional TIME each upgrade takes (ms)
  upgradeConstructionMultiplier: number;
  upgradeResources: { resource: string; amount: number }[][];
  inputs: { resource: string; amount: number }[];
  timeRequired: number;
  unitOutput?: string[]; // if combat station // multiplied by level
  resourceOutput?: string[]; // if non combat station // multiplied by level
  //the resource that's dropped 15% on lvl 1 outputs, 30% on lvl 2 outputs and 45% on lvl 3 outputs
  // only on resource buildings
  rareDrop?: string;
}

export const BLUEPRINTS: Blueprint[] = [
  {
    name: "Tavern",
    image:
      "https://shdw-drive.genesysgo.net/7DeMHXZa3cXfzft3pmCVtGbiPHKQfXEQLb8cJxWHEP1Q/tavern.png",
    description: "A boisterous place to train Brawlers",
    upgradeConstructionMultiplier: 1000 * 60 * 60, //1hr per level
    upgradeResources: [
      [{ resource: "Bandages", amount: 6 }],
      [{ resource: "Flowers", amount: 6 }],
      [
        { resource: "Bandages", amount: 8 },
        { resource: "Flowers", amount: 8 },
        { resource: "Poison", amount: 4 }, // rare
      ],
      [
        { resource: "Bandages", amount: 16 },
        { resource: "Flowers", amount: 16 },
        { resource: "Poison", amount: 8 },
        { resource: "Golden Apples", amount: 2 }, //legendary
      ],
    ],
    inputs: [
      { resource: "Bandages", amount: 6 },
      { resource: "Flowers", amount: 6 },
    ],
    timeRequired: 1000 * 60 * 20, // 20 min
    unitOutput: ["Brawler"],
  },
  {
    name: "Barracks",
    image:
      "https://shdw-drive.genesysgo.net/7DeMHXZa3cXfzft3pmCVtGbiPHKQfXEQLb8cJxWHEP1Q/barracks.png",
    description: "A place of discipline and swordsmanship",
    upgradeConstructionMultiplier: 1000 * 60 * 60, //1hr per level
    upgradeResources: [
      [{ resource: "Bandages", amount: 6 }],
      [{ resource: "Ingots", amount: 6 }],
      [
        { resource: "Bandages", amount: 8 },
        { resource: "Ingots", amount: 8 },
        { resource: "Wood", amount: 4 }, // rare
      ],
      [
        { resource: "Bandages", amount: 16 },
        { resource: "Flowers", amount: 16 },
        { resource: "Wood", amount: 8 },
        { resource: "Golden Apples", amount: 2 }, //legendary
      ],
    ],
    inputs: [
      { resource: "Bandages", amount: 6 },
      { resource: "Ingots", amount: 6 },
    ],
    timeRequired: 1000 * 60 * 20, // 20 min
    unitOutput: ["Blademaster"],
  },
];
