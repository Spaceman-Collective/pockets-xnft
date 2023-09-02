import React from "react"

import { Character, NFT } from "@/types/server"
import { Box, Text } from "@chakra-ui/react"

import { SkillSelector } from "./SkillSelector"
import { UnitCard } from "./UnitCard"

interface UnitListProps {
	character: Character
	units: NFT[]
	combatSkillLevels: { skill: string; level: number }[]
	selectedSkill: string
	setSelectedSkill: (skill: string) => void
}

enum UnitStates {
	EQUIPPABLE = "EQUIPPABLE",
	EQUIPPED = "EQUIPPED",
}

export const UnitsList: React.FC<UnitListProps> = ({
	character,
	units,
	combatSkillLevels,
	selectedSkill,
	setSelectedSkill,
}) => {
	const filteredUnits =
		units.filter(
			(unit) =>
				String(unit.attributes.Skill).toLocaleUpperCase() ===
					selectedSkill.toUpperCase() || !selectedSkill.length,
		) || []
	return (
		<Box overflow="auto">
			<SkillSelector
				selectedSkill={selectedSkill}
				setSelectedSkill={setSelectedSkill}
			/>
			<Box>
				{filteredUnits.length ? (
					filteredUnits.map((unitNFT) => {
						return (
							<UnitCard
								key={unitNFT.mint}
								unitNFT={unitNFT}
								character={character}
								combatSkillLevels={combatSkillLevels}
							/>
						)
					})
				) : (
					<Box
						bgColor="blacks.500"
						p="2rem"
						borderRadius="0.5rem"
						fontSize="1.5rem"
						lineHeight="1.5rem"
						fontWeight="600"
						color="brand.tertiary"
						textAlign="center"
						width="100%"
						textTransform="uppercase"
					>
						<Text opacity="0.5">
							{selectedSkill.length
								? `No ${selectedSkill} units available`
								: "No Units Available"}
						</Text>
					</Box>
				)}
			</Box>
		</Box>
	)
}
