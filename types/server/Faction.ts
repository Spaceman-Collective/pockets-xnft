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
