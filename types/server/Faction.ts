import { Character } from "."

export interface Faction {
	id: string
	pubkey: string
	creator: string
	name: string
	image: string
	external_link: string
	description: string
	townhallLevel: number
	construction: Construction
	taxRate: number
}

interface Construction {
	started?: string
	finished?: string
	blueprint?: string
	stationId?: string
	stationNewLevel?: number
}

export type FactionData =
	| {
			citizens: Character[]
			faction: Faction
			resources: {
				name: string
				value: string
			}[]
			stations: {
				blueprint: string
				faction: string
				id: string
				level: number
			}[]
	  }
	| undefined
