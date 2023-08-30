export const getBlueprint = (stationName: string) =>
  BLUEPRINTS.find(
    (print) => print.name.toLowerCase() === stationName.toLowerCase(),
  );

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

export const COMBAT_BLUEPRINTS: Blueprint[] = [
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
  {
    name: "Armory",
    image:
      "https://shdw-drive.genesysgo.net/7DeMHXZa3cXfzft3pmCVtGbiPHKQfXEQLb8cJxWHEP1Q/armory.png",
    description: "Don't let a stray spark loose",
    upgradeConstructionMultiplier: 1000 * 60 * 60, //1hr per level
    upgradeResources: [
      [{ resource: "Stone", amount: 6 }],
      [{ resource: "Cables", amount: 6 }],
      [
        { resource: "Stone", amount: 8 },
        { resource: "Cables", amount: 8 },
        { resource: "Batteries", amount: 4 }, // rare
      ],
      [
        { resource: "Stone", amount: 16 },
        { resource: "Cables", amount: 16 },
        { resource: "Batteries", amount: 8 },
        { resource: "Runic Circuits", amount: 2 }, //legendary
      ],
    ],
    inputs: [
      { resource: "Stone", amount: 6 },
      { resource: "Cables", amount: 6 },
    ],
    timeRequired: 1000 * 60 * 20, // 20 min
    unitOutput: ["Gunner"],
  },
  {
    name: "Archery Range",
    image:
      "https://shdw-drive.genesysgo.net/7DeMHXZa3cXfzft3pmCVtGbiPHKQfXEQLb8cJxWHEP1Q/archery_range.png",
    description: "Stay on target!",
    upgradeConstructionMultiplier: 1000 * 60 * 60, //1hr per level
    upgradeResources: [
      [{ resource: "Soil", amount: 6 }],
      [{ resource: "Stone", amount: 6 }],
      [
        { resource: "Soil", amount: 8 },
        { resource: "Stone", amount: 8 },
        { resource: "Gemstones", amount: 4 }, // rare
      ],
      [
        { resource: "Soil", amount: 16 },
        { resource: "Stone", amount: 16 },
        { resource: "Gemstones", amount: 8 },
        { resource: "Runic Circuits", amount: 2 }, //legendary
      ],
    ],
    inputs: [
      { resource: "Soil", amount: 6 },
      { resource: "Stone", amount: 6 },
    ],
    timeRequired: 1000 * 60 * 20, // 20 min
    unitOutput: ["Gunner"],
  },
  {
    name: "Asylum",
    image:
      "https://shdw-drive.genesysgo.net/7DeMHXZa3cXfzft3pmCVtGbiPHKQfXEQLb8cJxWHEP1Q/asylum.png",
    description: "You don't want to go in there",
    upgradeConstructionMultiplier: 1000 * 60 * 60, //1hr per level
    upgradeResources: [
      [{ resource: "Ingots", amount: 6 }],
      [{ resource: "Flowers", amount: 6 }],
      [
        { resource: "Ingots", amount: 8 },
        { resource: "Flowers", amount: 8 },
        { resource: "Tobacco", amount: 4 }, // rare
      ],
      [
        { resource: "Ingots", amount: 16 },
        { resource: "Flowers", amount: 16 },
        { resource: "Tobacco", amount: 8 },
        { resource: "Psychedelics", amount: 2 }, //legendary
      ],
    ],
    inputs: [
      { resource: "Ingots", amount: 6 },
      { resource: "Flowers", amount: 6 },
    ],
    timeRequired: 1000 * 60 * 20, // 20 min
    unitOutput: ["Mindbreakers"],
  },
  {
    name: "Sanctum",
    image:
      "https://shdw-drive.genesysgo.net/7DeMHXZa3cXfzft3pmCVtGbiPHKQfXEQLb8cJxWHEP1Q/sanctum.png",
    description: "The floor is lava. No, literally, the floor is lava!",
    upgradeConstructionMultiplier: 1000 * 60 * 60, //1hr per level
    upgradeResources: [
      [{ resource: "Cables", amount: 6 }],
      [{ resource: "Soil", amount: 6 }],
      [
        { resource: "Cables", amount: 8 },
        { resource: "Soil", amount: 8 },
        { resource: "Magic Runes", amount: 4 }, // rare
      ],
      [
        { resource: "Cables", amount: 16 },
        { resource: "Soil", amount: 16 },
        { resource: "Magic Runes", amount: 8 },
        { resource: "Psychedelics", amount: 2 }, //legendary
      ],
    ],
    inputs: [
      { resource: "Ingots", amount: 6 },
      { resource: "Flowers", amount: 6 },
    ],
    timeRequired: 1000 * 60 * 20, // 20 min
    unitOutput: ["Mindbreakers"],
  },
];

export const RESOURCE_BLUEPRINTS: Blueprint[] = [
  {
    name: "Silicon Hub",
    image:
      "https://shdw-drive.genesysgo.net/7DeMHXZa3cXfzft3pmCVtGbiPHKQfXEQLb8cJxWHEP1Q/silicon_hub.png",
    description: "A place of fine machinery",
    upgradeConstructionMultiplier: 1000 * 60 * 60, //1hr per level
    upgradeResources: [
      [{ resource: "Cables", amount: 6 }],
      [
        { resource: "Cables", amount: 8 },
        { resource: "Circuits", amount: 8 },
      ],
      [
        { resource: "Cables", amount: 16 },
        { resource: "Circuits", amount: 16 },
        { resource: "Batteries", amount: 8 },
      ],
    ],
    inputs: [{ resource: "Cables", amount: 2 }],
    timeRequired: 1000 * 60 * 10, // 10 min
    resourceOutput: ["Circuits"],
    rareDrop: "Batteries",
  },
  {
    name: "Wild Grove",
    image:
      "https://shdw-drive.genesysgo.net/7DeMHXZa3cXfzft3pmCVtGbiPHKQfXEQLb8cJxWHEP1Q/wild_grove.png",
    description: "A place of quiet reflection",
    upgradeConstructionMultiplier: 1000 * 60 * 60, //1hr per level
    upgradeResources: [
      [{ resource: "Soil", amount: 6 }],
      [
        { resource: "Soil", amount: 8 },
        { resource: "Mushrooms", amount: 8 },
      ],
      [
        { resource: "Soil", amount: 16 },
        { resource: "Mushrooms", amount: 16 },
        { resource: "Wood", amount: 8 },
      ],
    ],
    inputs: [{ resource: "Soil", amount: 2 }],
    timeRequired: 1000 * 60 * 10, // 10 min
    resourceOutput: ["Mushrooms"],
    rareDrop: "Wood",
  },
  {
    name: "Farm",
    image:
      "https://shdw-drive.genesysgo.net/7DeMHXZa3cXfzft3pmCVtGbiPHKQfXEQLb8cJxWHEP1Q/farm.png",
    description: "Where pigs go to die.",
    upgradeConstructionMultiplier: 1000 * 60 * 60, //1hr per level
    upgradeResources: [
      [{ resource: "Seeds", amount: 6 }],
      [
        { resource: "Seeds", amount: 8 },
        { resource: "Fruits", amount: 8 },
      ],
      [
        { resource: "Seeds", amount: 16 },
        { resource: "Fruits", amount: 16 },
        { resource: "Tobacco", amount: 8 },
      ],
    ],
    inputs: [{ resource: "Seeds", amount: 2 }],
    timeRequired: 1000 * 60 * 10, // 10 min
    resourceOutput: ["Tobacco"],
    rareDrop: "Wood",
  },
  {
    name: "Hospital",
    image:
      "https://shdw-drive.genesysgo.net/7DeMHXZa3cXfzft3pmCVtGbiPHKQfXEQLb8cJxWHEP1Q/hospital.png",
    description: "Where people go to live.",
    upgradeConstructionMultiplier: 1000 * 60 * 60, //1hr per level
    upgradeResources: [
      [{ resource: "Bandages", amount: 6 }],
      [
        { resource: "Bandages", amount: 8 },
        { resource: "Medicines", amount: 8 },
      ],
      [
        { resource: "Bandages", amount: 16 },
        { resource: "Medicines", amount: 16 },
        { resource: "Poison", amount: 8 },
      ],
    ],
    inputs: [{ resource: "Bandages", amount: 2 }],
    timeRequired: 1000 * 60 * 10, // 10 min
    resourceOutput: ["Medicines"],
    rareDrop: "Poison",
  },
  {
    name: "Foundry",
    image:
      "https://shdw-drive.genesysgo.net/7DeMHXZa3cXfzft3pmCVtGbiPHKQfXEQLb8cJxWHEP1Q/foundry.png",
    description: "Cling clang the clingity clank.",
    upgradeConstructionMultiplier: 1000 * 60 * 60, //1hr per level
    upgradeResources: [
      [{ resource: "Ingots", amount: 6 }],
      [
        { resource: "Ingots", amount: 8 },
        { resource: "Trade Goods", amount: 8 },
      ],
      [
        { resource: "Ingots", amount: 16 },
        { resource: "Trade Goods", amount: 16 },
        { resource: "Magic Runes", amount: 8 },
      ],
    ],
    inputs: [{ resource: "Ingots", amount: 2 }],
    timeRequired: 1000 * 60 * 10, // 10 min
    resourceOutput: ["Trade Goods"],
    rareDrop: "Magic Runes",
  },
  {
    name: "Quarry",
    image:
      "https://shdw-drive.genesysgo.net/7DeMHXZa3cXfzft3pmCVtGbiPHKQfXEQLb8cJxWHEP1Q/quarry.png",
    description: "Pick your pickaxe, not your nose!",
    upgradeConstructionMultiplier: 1000 * 60 * 60, //1hr per level
    upgradeResources: [
      [{ resource: "Stone", amount: 6 }],
      [
        { resource: "Stone", amount: 8 },
        { resource: "Marble", amount: 8 },
      ],
      [
        { resource: "Stone", amount: 16 },
        { resource: "Marble", amount: 16 },
        { resource: "Gemstones", amount: 8 },
      ],
    ],
    inputs: [{ resource: "Stone", amount: 2 }],
    timeRequired: 1000 * 60 * 10, // 10 min
    resourceOutput: ["Marble"],
    rareDrop: "Gemstones",
  },
  {
    name: "Factory",
    image:
      "https://shdw-drive.genesysgo.net/7DeMHXZa3cXfzft3pmCVtGbiPHKQfXEQLb8cJxWHEP1Q/factory.png",
    description: "A mix match of magic and electronics.",
    upgradeConstructionMultiplier: 1000 * 60 * 60, //1hr per level
    upgradeResources: [
      [
        { resource: "Circuits", amount: 6 },
        { resource: "Marble", amount: 6 },
      ],
      [
        { resource: "Circuits", amount: 8 },
        { resource: "Marble", amount: 8 },
        { resource: "Batteries", amount: 4 },
        { resource: "Gemstones", amount: 4 },
      ],
      [
        { resource: "Circuits", amount: 12 },
        { resource: "Marble", amount: 12 },
        { resource: "Batteries", amount: 8 },
        { resource: "Gemstones", amount: 8 },
      ],
    ],
    inputs: [
      { resource: "Circuits", amount: 4 },
      { resource: "Marble", amount: 4 },
    ],
    timeRequired: 1000 * 60 * 20, // 20 min
    resourceOutput: ["Runic Circuits"],
  },
  {
    name: "Shaman Hut",
    image:
      "https://shdw-drive.genesysgo.net/7DeMHXZa3cXfzft3pmCVtGbiPHKQfXEQLb8cJxWHEP1Q/shaman_hut.png",
    description: "Heal the mind, heal the body.",
    upgradeConstructionMultiplier: 1000 * 60 * 60, //1hr per level
    upgradeResources: [
      [
        { resource: "Mushrooms", amount: 6 },
        { resource: "Medicines", amount: 6 },
      ],
      [
        { resource: "Circuits", amount: 8 },
        { resource: "Marble", amount: 8 },
        { resource: "Wood", amount: 4 },
        { resource: "Poison", amount: 4 },
      ],
      [
        { resource: "Circuits", amount: 12 },
        { resource: "Marble", amount: 12 },
        { resource: "Wood", amount: 8 },
        { resource: "Poison", amount: 8 },
      ],
    ],
    inputs: [
      { resource: "Mushrooms", amount: 4 },
      { resource: "Medicines", amount: 4 },
    ],
    timeRequired: 1000 * 60 * 20, // 20 min
    resourceOutput: ["Psychedelics"],
  },
  {
    name: "Market",
    image:
      "https://shdw-drive.genesysgo.net/7DeMHXZa3cXfzft3pmCVtGbiPHKQfXEQLb8cJxWHEP1Q/market.png",
    description: "Even the gods come to barter here.",
    upgradeConstructionMultiplier: 1000 * 60 * 60, //1hr per level
    upgradeResources: [
      [
        { resource: "Fruits", amount: 6 },
        { resource: "Trade Goods", amount: 6 },
      ],
      [
        { resource: "Fruits", amount: 8 },
        { resource: "Trade Goods", amount: 8 },
        { resource: "Tobacco", amount: 4 },
        { resource: "Magic Runes", amount: 4 },
      ],
      [
        { resource: "Fruits", amount: 12 },
        { resource: "Trade Goods", amount: 12 },
        { resource: "Tobacco", amount: 8 },
        { resource: "Magic Runes", amount: 8 },
      ],
    ],
    inputs: [
      { resource: "Fruits", amount: 4 },
      { resource: "Trade Goods", amount: 4 },
    ],
    timeRequired: 1000 * 60 * 20, // 20 min
    resourceOutput: ["Golden Apples"],
  },
];

export const BLUEPRINTS: Blueprint[] = [
  ...COMBAT_BLUEPRINTS,
  ...RESOURCE_BLUEPRINTS,
];
