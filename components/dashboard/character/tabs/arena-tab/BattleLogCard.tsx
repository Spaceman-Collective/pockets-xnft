import React from "react"
import { Box, Flex, Text } from "@chakra-ui/react"
import { Unit } from "@/types/server"
import { colors } from "@/styles/defaultTheme"
import { Tip } from "@/components/tooltip"

interface BattleLogCardProps {
	type: "bonus" | "roll" | "unit"
	text?: string
	value?: string | number
	unit?: any
}

export const BattleLogCard: React.FC<BattleLogCardProps> = ({
	type,
	text,
	value,
	unit,
}) => {
	const color =
		type === "bonus" ? colors.brand.quaternary : colors.brand.tertiary
	return (
		<Flex
			flexDirection="column"
			justifyContent="center"
			alignItems="center"
			minW="8rem"
		>
			<Text
				bgColor={color}
				p="0 0.5rem"
				borderTopRightRadius="0.5rem"
				borderTopLeftRadius="0.5rem"
				fontWeight="700"
				color="brand.primary"
				w="100%"
				textAlign="center"
			>
				{text}
			</Text>
			<Tip
				placement="top"
				label={`${unit?.name}. Skill: ${unit?.skill}. Bonusses: ${
					unit ? Object.keys(unit.bonus).join(", ") : ""
				}`}
			>
				<Box
					bgColor="blacks.500"
					borderRight={`2px solid ${color}`}
					borderBottom={`2px solid ${color}`}
					borderLeft={`2px solid ${color}`}
					p="0 0.5rem"
					borderBottomRightRadius="0.5rem"
					borderBottomLeftRadius="0.5rem"
					fontWeight="700"
					w="100%"
					h="100%"
					textAlign="center"
					fontSize="4rem"
					flex="1"
					display="flex"
					justifyContent="center"
					alignItems="center"
					minW="8rem"
					bgImage={unit?.image}
					bgSize="cover"
					color={color}
				>
					{value}
				</Box>
			</Tip>
		</Flex>
	)
}
