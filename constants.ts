import { PublicKey } from "@solana/web3.js"

export const SERVER_KEY = "pockmZEzU9m8bkgHMtA3bmHASDFKv8N3kwkEbvQdd9K"

// TODO: REPLACE WITH COMMENTED CODE AT LAUNCH
export const FACTION_CREATION_MULTIPLIER = BigInt(1000000_00000) // ~ $0.3-0.5 * # of factions already created // 100th Faction could cost ~$50
//export const FACTION_CREATION_MULTIPLIER = BigInt(10_00000) // ~ $0.3-0.5 * # of factions already created // 100th Faction could cost ~$50
export const RESOURCE_FIELD_CREATION_MULTIPLIER = BigInt(50000_00000) // ~0.15-0.20c * # of resource fields // 100th will cost around $25
export const BONK_PER_MS_WIPED = 10 // wipe 1 ms for every 100 bonk they send in 1s = 100K Bonk, 1hr = 36M Bonk (~$12)
export const BONK_COST_PER_MS_WIPED = BigInt(100_00000) // wipe 1 ms for every 100 bonk they send in 1s = 100K Bonk, 1hr = 36M Bonk (~$12)
export const BONK_MINT = new PublicKey(
	"DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
)

export const SPL_TOKENS: {
	[token: string]: { mint: string; decimals: number }
} = {
	bonk: {
		mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
		decimals: 5,
	},
}

export const STATION_USE_COST_PER_LEVEL = BigInt(25000_00000) //3c for Lvl 4 Building use

// xp multiplier based on rarity
export const RESOURCE_XP_GAIN = {
	common: 10,
	uncommon: 25,
	rare: 75,
	legendary: 300,
}

export const getResource = (
	resourceName: string,
): ResourceConstantType | undefined =>
	RESOURCES.find((e) => e.name.toLowerCase() === resourceName.toLowerCase())

type ResourceConstantType = {
	name: string
	tier: string
	skills: string[]
	mint: string
}
export const RESOURCES: ResourceConstantType[] = [
	{
		name: "Cables",
		tier: "common",
		skills: ["Electronics"],
		mint: "4V9hso8cSkNAA2JnEufBaT4BVtQytuG9Z1weyKjtvvRg",
	},
	{
		name: "Soil",
		tier: "common",
		skills: ["Forestry"],
		mint: "515CByLTbE79ER3mkrb1hP72cijVK2SUzKBBFmpJLo7o",
	},
	{
		name: "Flowers",
		tier: "common",
		skills: ["Farming"],
		mint: "8sNJbGGpUdyEoRymVpj4yDBPFbivHUKm8GxKEU4vV1Ak",
	},
	{
		name: "Bandages",
		tier: "common",
		skills: ["Healing"],
		mint: "CsGYJ732drKWpLu3TmA5iosoAHB2xK1Lx1psZAyU5WBF",
	},
	{
		name: "Ingots",
		tier: "common",
		skills: ["Manufacturing"],
		mint: "GDqfuu4wNRcACzWHsKQtHc2nRsveVb9hYyacQgyMnDuE",
	},
	{
		name: "Stone",
		tier: "common",
		skills: ["Mining"],
		mint: "4JthHJU5bdGUrBMkxXMb5bQTNvP9Uufq8f3p88mRLusY",
	},
	{
		name: "Circuits",
		tier: "uncommon",
		skills: ["Electronics"],
		mint: "6UimUtPVAiUr6s7mqjmsb7D21PnsWDg5nFr6HMkyDgat",
	},
	{
		name: "Mushrooms",
		tier: "uncommon",
		skills: ["Forestry"],
		mint: "BfnTbsgCtcG9DEWHXhGxw15pKTFRKzMEedWjAW43Wa73",
	},
	{
		name: "Fruits",
		tier: "uncommon",
		skills: ["Farming"],
		mint: "2BRG2fyXfQFSXXy119f1jfzYs5H6w4fhej4yZnTQski4",
	},
	{
		name: "Medicines",
		tier: "uncommon",
		skills: ["Healing"],
		mint: "DvnS1Ahtc7g8DvuNKnMKvKEPH9Wv6GuzkuB9ZS174jF1",
	},
	{
		name: "Trade Goods",
		tier: "uncommon",
		skills: ["Manufacturing"],
		mint: "7A5FJaUxw6uZ7k2BGDsZcAEByuztXFWgBWL7Di7HA7PS",
	},
	{
		name: "Marble",
		tier: "uncommon",
		skills: ["Mining"],
		mint: "GsrrQdFG3XWyqWCP4u1yVndP1Cv7EkAaqpsNbQnfpJti",
	},
	{
		name: "Batteries",
		tier: "rare",
		skills: ["Electronics"],
		mint: "4eua2AHiNcv55yHccfEyHMmvUBkoEegLSb61DweRgbM7",
	},
	{
		name: "Wood",
		tier: "rare",
		skills: ["Forestry"],
		mint: "FN5esgt2v3M7juZ7Ay2797eNuMcw1UVgGAkgA9yNBjej",
	},
	{
		name: "Tobacco",
		tier: "rare",
		skills: ["Farming"],
		mint: "BHv7RpEbwKkfrdX4psDpcBLF7Spus3wQP8ie6akTJQcJ",
	},
	{
		name: "Poison",
		tier: "rare",
		skills: ["Healing"],
		mint: "8MT44eK8r7bs7buVxcAQGnsaERkSNqJ5HaeFXtfYw9DZ",
	},
	{
		name: "Magic Runes",
		tier: "rare",
		skills: ["Manufacturing"],
		mint: "24NcpSYwhZvnXCZbwe9vP8Z2tD6TanQ2sgwF8tXQP8T6",
	},
	{
		name: "Gemstones",
		tier: "rare",
		skills: ["Mining"],
		mint: "3KPSkcCBvFK6FPmPYZzMmCTmXLNsrmT4t1Fn4cykE98a",
	},
	{
		name: "Runic Circuits",
		tier: "legendary",
		skills: ["Electronics", "Mining"],
		mint: "HYJ6dA3Y3Yrg5x4XCgQ2GkcUbZMHVYkhmh3y3YDmTS1X",
	},
	{
		name: "Psychedelics",
		tier: "legendary",
		skills: ["Forestry", "Healing"],
		mint: "4z8iZK4wu6tXqMxN1ZJK4R1xn3JwtCxBze8egWPLpNFW",
	},
	{
		name: "Golden Apples",
		tier: "legendary",
		skills: ["Farming", "Manufacturing"],
		mint: "CgGemKFsAQpXVFnMHcorxXj7vEK3hbTAzVTJDxHvhaZQ",
	},
]
