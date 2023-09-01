// import { FactionStats } from '@/pages/leaderboard';
import { Faction } from "@/types/server/Faction"

export const generateFactionStats = (factions: Faction[]) => {
	return factions.map((faction) => ({
		name: faction.name,
		id: faction.id,
		favor: getRandomNumber(100, 1000),
		domWins: getRandomNumber(10, 200),
		wealth: getRandomNumber(500, 5000),
		knowledge: getRandomNumber(50, 500),
	}))
}

function getRandomNumber(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

export const tenMockFactions: Faction[] = [
	{
		id: "f1",
		pubkey: "pubkey1",
		creator: "creator1",
		name: "Dragon Clan",
		image: "/images/dragon-clan.png",
		external_link: "https://dragonclan.org",
		description:
			"A clan known for their fierce warriors and fire-breathing dragons.",
		townhallLevel: 3,
		construction: {
			started: "2023-08-01T8:00:00Z",
			finished: "2023-08-01T10:00:00Z",
			stationId: "station1",
			blueprint: "dragon-lair",
			stationNewLevel: 2,
		},
		taxRate: 5,
	},
	{
		id: "f2",
		pubkey: "pubkey2",
		creator: "creator2",
		name: "Elf Kingdom",
		image: "/images/elf-kingdom.png",
		external_link: "https://elfkingdom.org",
		description: "Masters of the forest and skilled in the magical arts.",
		townhallLevel: 4,
		construction: {
			started: "2023-08-01T8:00:00Z",
			finished: undefined,
			stationId: "station2",
			blueprint: "elf-tree-house",
			stationNewLevel: 1,
		},
		taxRate: 4,
	},
	{
		id: "f3",
		pubkey: "pubkey3",
		creator: "creator3",
		name: "Mystic Wizards",
		image: "/images/mystic-wizards.png",
		external_link: "https://mysticwizards.org",
		description: "Ancient wizards wielding arcane magics.",
		townhallLevel: 5,
		construction: {
			started: "2023-07-15T12:00:00Z",
			finished: "2023-07-15T16:00:00Z",
			stationId: "station3",
			blueprint: "wizard-tower",
			stationNewLevel: 2,
		},
		taxRate: 6,
	},
	{
		id: "f4",
		pubkey: "pubkey4",
		creator: "creator4",
		name: "Orc Tribes",
		image: "/images/orc-tribes.png",
		external_link: "https://orctribes.org",
		description: "Brutal orc warriors from the harsh terrains.",
		townhallLevel: 2,
		construction: {
			started: "2023-06-30T14:00:00Z",
			finished: "2023-06-30T19:00:00Z",
			stationId: "station4",
			blueprint: "orc-hut",
			stationNewLevel: 1,
		},
		taxRate: 8,
	},
	{
		id: "f5",
		pubkey: "pubkey5",
		creator: "creator5",
		name: "Dwarf Engineers",
		image: "/images/dwarf-engineers.png",
		external_link: "https://dwarfengineers.org",
		description: "Craftsmen and miners, building intricate machines.",
		townhallLevel: 3,
		construction: {
			started: "2023-06-30T14:00:00Z",
			finished: undefined,
			stationId: "station5",
			blueprint: "dwarf-forge",
			stationNewLevel: 1,
		},
		taxRate: 5,
	},
	{
		id: "f6",
		pubkey: "pubkey6",
		creator: "creator6",
		name: "Undead Horde",
		image: "/images/undead-horde.png",
		external_link: "https://undeadhorde.org",
		description: "The risen dead, seeking to claim the living.",
		townhallLevel: 2,
		construction: {
			started: "2023-06-10T7:00:00Z",
			finished: "2023-06-10T10:00:00Z",
			stationId: "station6",
			blueprint: "undead-mausoleum",
			stationNewLevel: 3,
		},
		taxRate: 10,
	},
	{
		id: "f7",
		pubkey: "pubkey7",
		creator: "creator7",
		name: "Beast Tamers",
		image: "/images/beast-tamers.png",
		external_link: "https://beasttamers.org",
		description: "Masters of animals, from the wild forests to the vast plains.",
		townhallLevel: 3,
		construction: {
			started: "2023-05-30T10:00:00Z",
			finished: "2023-05-30T14:00:00Z",
			stationId: "station7",
			blueprint: "tamer-hut",
			stationNewLevel: 1,
		},
		taxRate: 7,
	},
	{
		id: "f8",
		pubkey: "pubkey8",
		creator: "creator8",
		name: "Sea Raiders",
		image: "/images/sea-raiders.png",
		external_link: "https://searaiders.org",
		description: "Pirates of the sea, seeking treasure and adventure.",
		townhallLevel: 1,
		construction: {
			started: "2023-05-25T03:00:00Z",
			finished: "2023-05-25T09:00:00Z",
			stationId: "station8",
			blueprint: "raider-ship",
			stationNewLevel: 2,
		},
		taxRate: 9,
	},
	{
		id: "f9",
		pubkey: "pubkey9",
		creator: "creator9",
		name: "Celestial Beings",
		image: "/images/celestial-beings.png",
		external_link: "https://celestialbeings.org",
		description: "God-like beings watching over the realms.",
		townhallLevel: 5,
		construction: {
			started: "2023-05-25T09:00:00Z",
			finished: undefined,
			stationId: "station9",
			blueprint: "celestial-temple",
			stationNewLevel: 3,
		},
		taxRate: 3,
	},
	{
		id: "f10",
		pubkey: "pubkey10",
		creator: "creator10",
		name: "Knight Order",
		image: "/images/knight-order.png",
		external_link: "https://knightorder.org",
		description: "Honorable knights who value chivalry and order.",
		townhallLevel: 5,
		construction: {
			started: "2023-08-10T02:00:00Z",
			finished: "2023-08-10T08:00:00Z",
			stationId: "station10",
			blueprint: "knight-castle",
			stationNewLevel: 3,
		},
		taxRate: 6,
	},
]

// export const tenMockFactionStats: FactionStats[] = [
//   {
//     id: 'f1',
//     name: 'Dragon Clan',
//     favor: 75,
//     domWins: 15,
//     wealth: 10000,
//     knowledge: 150
//   },
//   {
//     id: 'f2',
//     name: 'Elf Kingdom',
//     favor: 90,
//     domWins: 10,
//     wealth: 12000,
//     knowledge: 180
//   },
//   {
//     id: 'f3',
//     name: 'Mystic Wizards',
//     favor: 85,
//     domWins: 18,
//     wealth: 14000,
//     knowledge: 200
//   },
//   {
//     id: 'f4',
//     name: 'Orc Tribes',
//     favor: 65,
//     domWins: 12,
//     wealth: 8000,
//     knowledge: 110
//   },
//   {
//     id: 'f5',
//     name: 'Dwarf Engineers',
//     favor: 78,
//     domWins: 14,
//     wealth: 9000,
//     knowledge: 140
//   },
//   {
//     id: 'f6',
//     name: 'Undead Horde',
//     favor: 60,
//     domWins: 9,
//     wealth: 7500,
//     knowledge: 90
//   },
//   {
//     id: 'f7',
//     name: 'Beast Tamers',
//     favor: 80,
//     domWins: 16,
//     wealth: 9500,
//     knowledge: 160
//   },
//   {
//     id: 'f8',
//     name: 'Sea Raiders',
//     favor: 70,
//     domWins: 11,
//     wealth: 8500,
//     knowledge: 120
//   },
//   {
//     id: 'f9',
//     name: 'Celestial Beings',
//     favor: 95,
//     domWins: 20,
//     wealth: 13000,
//     knowledge: 210
//   },
//   {
//     id: 'f10',
//     name: 'Knight Order',
//     favor: 88,
//     domWins: 17,
//     wealth: 11000,
//     knowledge: 170
//   }
// ];
