import { Faction, Unit } from ".";
export interface Character {
  name: string;
  mint: string;
  collection: string;
  image: string;
  experience: {
    [skill in SkillType]: {
      current: number;
      threshold: number;
    };
  };
  skills: {
    [skill in SkillType]: number;
  };
  army: Unit[];
  attributes: any; // NFT Attributes
  faction?: Faction;
}

export const COMBAT_SKILLS = [
  "Strength",
  "Fighting",
  "Shooting",
  "Athlethics",
  "Psionics",
  "Magic",
];
export const NONCOMBAT_SKILLS = [
  "Electronics",
  "Forestry",
  "Farming",
  "Healing",
  "Manufacturing",
  "Mining",
];

export const SKILLS = [...COMBAT_SKILLS, ...NONCOMBAT_SKILLS] as const;
export type SkillType = (typeof SKILLS)[number];
export const SKILL_THRESHOLD_MULTIPLIER = 1000;