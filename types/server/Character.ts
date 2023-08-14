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
  army: any[];
  attributes: any; // NFT Attributes
  faction?: any;
}

export const SKILLS = [
  "Strength",
  "Fighting",
  "Shooting",
  "Athlethics",
  "Psionics",
  "Spellcasting",
  "Electronics",
  "Forestry",
  "Farming",
  "Healing",
  "Manufacturing",
  "Mining",
] as const;
export type SkillType = (typeof SKILLS)[number];
