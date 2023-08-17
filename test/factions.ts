import { Faction } from "@/types/server";

export const dummyFactions: Faction[] = [
  {
    id: "1",
    pubkey: "1111111111111111111111111111111111",
    creator: "1111111111111111111111111111111111",
    name: "Faction 1",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png",
    external_link: "link1",
    description: "Description for Faction 1",
    townhallLevel: 5,
    stations: [],
    lastLooted: "",
    construction: {
      finishedAt: "",
      station: {
        id: "station1",
        faction: "Faction 1",
        blueprint: "blueprint1",
        level: "1",
      },
    },
  },
  {
    id: "2",
    pubkey: "1111111111111111111111111111111111",
    creator: "1111111111111111111111111111111111",
    name: "Faction 2",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png",
    external_link: "link2",
    description: "Description for Faction 2",
    townhallLevel: 5,
    stations: [],
    lastLooted: "",
    construction: {
      finishedAt: "",
      station: {
        id: "station2",
        faction: "Faction 2",
        blueprint: "blueprint1",
        level: "1",
      },
    },
  },
  {
    id: "3",
    pubkey: "1111111111111111111111111111111111",
    creator: "1111111111111111111111111111111111",
    name: "Faction 3",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png",
    external_link: "link3",
    description: "Description for Faction 3",
    townhallLevel: 5,
    stations: [],
    lastLooted: "",
    construction: {
      finishedAt: "",
      station: {
        id: "station3",
        faction: "Faction 3",
        blueprint: "blueprint3",
        level: "1",
      },
    },
  },
]