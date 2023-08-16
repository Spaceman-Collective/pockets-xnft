import { Station } from "./Station";

export interface Faction {
  id: string;
  creator: string;
  name: string;
  image: string;
  external_link: string;
  description: string;
  townhallLevel: number;
  stations: Station[];
}