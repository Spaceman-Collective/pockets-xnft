import { NFT } from "."

export interface Unit {
	mint?: string
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

export const XP_PER_RANK = 50

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

export const UNIT_NAMES = UNIT_TEMPLATES.map((template) => {
	return template.name
})

export function buildUnitFromNFT(nft: NFT): Unit {
	// Get type to make sure it's unit
	if (nft.attributes["Type"] != "Unit") {
		throw new Error("Not a unit!")
	}

	// Get skill
	let unit: Unit = {
		assetId: nft.mint,
		bonus: {},
		name: nft.name,
		image: nft.image_uri,
		skill: nft.attributes["Skill"],
	}

	// get bonuses
	for (let trait of nft.attributes_array) {
		if (UNIT_NAMES.includes(trait.trait_type)) {
			unit.bonus[trait.trait_type] = parseInt(trait.value)
		}
	}

	return unit
}
