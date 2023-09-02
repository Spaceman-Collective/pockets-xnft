import React from "react"
import { Flex, Text } from "@chakra-ui/react"
import { IconSkill } from "@/components/icons"
import { colors } from "@/styles/defaultTheme"
import { COMBAT_SKILLS } from "@/types/server"

interface SkillSelectorProps {
	selectedSkill: string
	setSelectedSkill: (skill: string) => void
}

export const SkillSelector: React.FC<SkillSelectorProps> = ({
	selectedSkill,
	setSelectedSkill,
}) => {
	return (
		<Flex flexDirection="row" mb="2rem">
			{Object.keys(IconSkill).map((skill, index) => {
				const isCombatSkill = COMBAT_SKILLS.find(
					(combatSkill) => combatSkill.toUpperCase() === skill.toUpperCase(),
				)
				if (!isCombatSkill) {
					return null
				}
				const isCurrentlySelected = selectedSkill === skill ? true : false
				const Icon = Object.values(IconSkill)[index]
				const name = skill.charAt(0).toUpperCase() + skill.substring(1)
				return (
					<Flex
						key={name}
						onClick={() =>
							isCurrentlySelected ? setSelectedSkill("") : setSelectedSkill(skill)
						}
						m="0 0.5rem"
						flexDir="column"
						borderRadius="0.5rem"
						p="1.5rem"
						flex="1 1 auto"
						bg={isCurrentlySelected ? colors.brand.quaternary : colors.blacks[500]}
						color={isCurrentlySelected ? colors.blacks[700] : colors.brand.secondary}
						_last={{ marginRight: 0 }}
						_first={{ marginLeft: 0 }}
						cursor="pointer"
						transition="all 0.1s ease"
						_hover={{
							bg: isCurrentlySelected ? colors.brand.quaternary : colors.blacks[600],
						}}
						alignItems="center"
					>
						<Icon
							style={{
								fontSize: "2rem",
							}}
						/>
						<Text
							mt="1rem"
							textTransform="uppercase"
							fontWeight="600"
							fontSize="1.25rem"
						>
							{name}
						</Text>
					</Flex>
				)
			})}
		</Flex>
	)
}
