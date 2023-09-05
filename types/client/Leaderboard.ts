import { Faction } from "../server"

export interface Leaderboard {
	condition: string
	factions: {
		wealth: number
		faction: Faction
		knowledge: number
		domination: number
	}
}
