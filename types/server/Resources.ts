export interface Resource {
	name: string
	tier: "common" | "uncommon" | "rare" | "legendary"
	skills: string[]
	mint: string
}

export const RESOURCE_XP_GAIN = {
	common: 10,
	uncommon: 25,
	rare: 75,
	legendary: 300,
}

export enum ResourceType {
	"Cables" = "Cables",
	"Soil" = "Soil",
	"Flowers" = "Flowers",
	"Bandages" = "Bandages",
	"Ingots" = "Ingots",
	"Stone" = "Stone",
	"Circuits" = "Circuits",
	"Mushrooms" = "Mushrooms",
	"Fruits" = "Fruits",
	"Trade Goods" = "Trade Goods",
	"Marble" = "Marble",
	"Batteries" = "Batteries",
	"Wood" = "Wood",
	"Tobacco" = "Tobacco",
	"Poison" = "Poison",
	"Magic Runes" = "Magic Runes",
	"Gemstones" = "Gemstones",
	"Runic Circuits" = "Runic Circuits",
	"Psychedelics" = "Psychedelics",
	"Golden Apples" = "Golden Apples",
}

export const RESOURCES: Resource[] = [
	{
		name: "Cables",
		tier: "common",
		skills: ["Electronics"],
		mint: "2fYG7wrRkuqPYaPqbnAwkQQhBXeCWbjhrqJ5hz27S4ik",
	},
	{
		name: "Soil",
		tier: "common",
		skills: ["Forestry"],
		mint: "9rPmGhsqRgzyJ23TJmek3pdAktLLH4MtnfDc5UYkc5WE",
	},
	{
		name: "Flowers",
		tier: "common",
		skills: ["Farming"],
		mint: "78NkSWR51ve3BgGruPVHYNPQPNd1jTDG6c327YD9iSzP",
	},
	{
		name: "Bandages",
		tier: "common",
		skills: ["Healing"],
		mint: "A9xFHG1PqgfuoaKXAu9hsn4DKHjuG82FSFmjJsjmEAZh",
	},
	{
		name: "Ingots",
		tier: "common",
		skills: ["Manufacturing"],
		mint: "FR7DJJN2cMJHzMNSKoLhZyZQrunLnrugEVQ46TZyLuN",
	},
	{
		name: "Stone",
		tier: "common",
		skills: ["Mining"],
		mint: "78NtnLpgM4K6N1wFTjeseC9bZFFSZWjBwJUinCpHt4oS",
	},
	{
		name: "Circuits",
		tier: "uncommon",
		skills: ["Electronics"],
		mint: "E1wPHExQUexs3Qj5z5jCNBHHcN4dND3rb5d8aN8yUnAN",
	},
	{
		name: "Mushrooms",
		tier: "uncommon",
		skills: ["Forestry"],
		mint: "AVav5e733SREhMX1ybyG7S9vykyjAhuChf1aPbURpHbi",
	},
	{
		name: "Fruits",
		tier: "uncommon",
		skills: ["Farming"],
		mint: "2575ipDoQC2NJAAed6fhWoh6jnrde8xv6rMLc3ExZPaf",
	},
	{
		name: "Trade Goods",
		tier: "uncommon",
		skills: ["Manufacturing"],
		mint: "5ZTx79GaVfF8Fo6yRP78nveUdPKCqPzPrmt4d4Qo5BJQ",
	},
	{
		name: "Marble",
		tier: "uncommon",
		skills: ["Mining"],
		mint: "76ottAMufVgs4M1sHLmKtPW3SDKwHwgY2h2E84rz46KH",
	},
	{
		name: "Batteries",
		tier: "rare",
		skills: ["Electronics"],
		mint: "HRCaDe847EUPwitdmg4wN5vKKJAcygvV1XtnsMwqqN9L",
	},
	{
		name: "Wood",
		tier: "rare",
		skills: ["Forestry"],
		mint: "FmPhLpHwv1qFzXGGCoZr5XBhBeKgmVC2BdZUBSybhb1h",
	},
	{
		name: "Tobacco",
		tier: "rare",
		skills: ["Farming"],
		mint: "FY9JRicedE9AKpMiWdhgrY42N63T3npk1cXBB5oR3R3h",
	},
	{
		name: "Poison",
		tier: "rare",
		skills: ["Healing"],
		mint: "FpmjzeeuXcAX2ZLwMBYGXAxG51BPbPNKn9qCjrg7Lmdj",
	},
	{
		name: "Magic Runes",
		tier: "rare",
		skills: ["Manufacturing"],
		mint: "CKQj4b9ptjEU6cg2pf7vhcbkEkJXsxUCn9BU7bVBpd3M",
	},
	{
		name: "Gemstones",
		tier: "rare",
		skills: ["Mining"],
		mint: "524AcpdhR6xEXtZfxHf1a9Nob988ihEvQkzFCqmqnkmd",
	},
	{
		name: "Runic Circuits",
		tier: "legendary",
		skills: ["Electronics", "Mining"],
		mint: "An9utccQDX7whbuwMSaHqnSMQ9mbuH6HU5zrRg8mCLF5",
	},
	{
		name: "Psychedelics",
		tier: "legendary",
		skills: ["Forestry", "Healing"],
		mint: "2szefUQN9kJSsbUDFoZoJvUfYShBQX78XG1Z2eusorgP",
	},
	{
		name: "Golden Apples",
		tier: "legendary",
		skills: ["Farming", "Manufacturing"],
		mint: "GVnnmwKYer3BVsX2ehbNPrMFRT6jCxWdNgMwFX2TWzKW",
	},
]
