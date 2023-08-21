import { Station } from "./Station";

export interface Faction {
  id: string;
  pubkey: string;
  creator: string;
  name: string;
  image: string;
  external_link: string;
  description: string;
  townhallLevel: number;
  lastLooted: string;
  construction: {
    finishedAt: string | undefined;
    stationId?: string;
    blueprint: string | undefined;
    stationNewLevel: number | undefined;
  };
  taxRate: number;
}