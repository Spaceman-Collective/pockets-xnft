export interface Unit {
	mint: string
	name: string
	skill: string
	bonus: {
		[skill: string]: number
	}
}

export interface Unit extends UnitTemplate {
	assetId: string
	// when minting, a random amount of bonuses are added based on station level
	bonus: {
		[enemyName: string]: number
	}
}

export const XP_PER_RANK = 15

export interface UnitTemplate {
	name: string
	image: string
	skill: string // COMBAT_SKILLS
}

export const UNIT_TEMPLATES: UnitTemplate[] = [
	{
		name: "Brawler",
		image:
			"https://shdw-drive.genesysgo.net/7DeMHXZa3cXfzft3pmCVtGbiPHKQfXEQLb8cJxWHEP1Q/brawler.png",
		skill: "Strength",
	},
	{
		name: "Blademaster",
		image:
			"https://shdw-drive.genesysgo.net/7DeMHXZa3cXfzft3pmCVtGbiPHKQfXEQLb8cJxWHEP1Q/blademaster.png",
		skill: "Fighting",
	},
	{
		name: "Gunner",
		image:
			"https://shdw-drive.genesysgo.net/7DeMHXZa3cXfzft3pmCVtGbiPHKQfXEQLb8cJxWHEP1Q/gunwoman.png",
		skill: "Shooting",
	},
	{
		name: "Ranger",
		image:
			"https://shdw-drive.genesysgo.net/7DeMHXZa3cXfzft3pmCVtGbiPHKQfXEQLb8cJxWHEP1Q/ranger.png",
		skill: "Athletics",
	},
	{
		name: "Mindbreaker",
		image:
			"https://shdw-drive.genesysgo.net/7DeMHXZa3cXfzft3pmCVtGbiPHKQfXEQLb8cJxWHEP1Q/mindbreaker.png",
		skill: "Psionics",
	},
	{
		name: "Wizard",
		image:
			"https://shdw-drive.genesysgo.net/7DeMHXZa3cXfzft3pmCVtGbiPHKQfXEQLb8cJxWHEP1Q/wizard.png",
		skill: "Magic",
	},
]
