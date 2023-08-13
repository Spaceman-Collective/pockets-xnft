import { Item, SUPPORTED_COLLECTION_ADDRESSES } from ".";

export interface Character {
  name: string;
  mint: string;
  collection: string;
  image: string;
  experience: {
    current: number;
    threshold: number;
  };
  points: number;
  faction: string; // PDA Address of the Faction
  skills: {
    [skill in SkillType]: number;
  };
  equipped: {
    [item in WornAreaType]: undefined | string | Item;
  };
  vitals: {
    [vital in VitalsType]: number;
  };
  attributes: any; // NFT Attributes
}

export const SKILLS = [
  "Strength",
  "Fighting",
  "Shooting",
  "Heavy Weapons",
  "Athlethics",
  "Prayer",
  "Psionics",
  "Spellcasting",
  "Vigor",
  "Academics",
  "Electronics",
  "Forestry",
  "Farming",
  "Healing",
  "Cooking",
  "Smithing",
  "Mining",
] as const;
export type SkillType = (typeof SKILLS)[number];

// export const getZeroSkillObj = (): Character["skills"] => {
//   let skillObj = {};
//   for (let skill of SKILLS) {
//     //@ts-ignore
//     skillObj[skill] = 0;
//   }

//   return skillObj as Character["skills"];
// };

export const WORN_AREA = [
  "head",
  "torso",
  "legs",
  "mainhand",
  "offhand",
  "trinket",
] as const;
export type WornAreaType = (typeof WORN_AREA)[number];
// export const getZeroEquipped = (): Character["equipped"] => {
//   let equipped = {};
//   for (let area of WORN_AREA) {
//     equipped[area] = undefined;
//   }
//   return equipped as Character["equipped"];
// };

export const VITALS = [
  "health",
  "maxHealth", // 10 + (Vigor*2)
  "spirit",
  "maxSpirit", // 5 + 2(Prayer + Psionics + Spellcasting)
  "weight",
  "maxWeight", // 20 + (Strength * 5)
  "dodge", // 2 + 1/2 Athletics
  "parry", // 2 + 1/2 Fighting
  "magicResistance",
  "armor",
] as const;
export type VitalsType = (typeof VITALS)[number];
