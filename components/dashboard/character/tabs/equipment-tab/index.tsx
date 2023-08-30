import { FC } from "react"
import { PanelContainer } from "@/components/layout"
import { Character } from "@/types/server"
import { Box, Divider, Flex, Text } from "@chakra-ui/react"
import { CitizenEquipment } from "../citizen-equipment.component"
import { DeleteIcon } from "@chakra-ui/icons"

export const EquipmentTab: FC<{
	currentCharacter: Character
}> = ({ currentCharacter }) => {
	return (
		<PanelContainer
			display="flex"
			flexDirection="column"
			gap="2rem"
			width="100%"
		>
			<Flex
				bgColor="blacks.500"
				p="2rem"
				borderRadius="0.5rem"
				justifyContent="space-between"
				alignItems="center"
				flexDirection="row"
			>
				<Text
					fontSize="1.75rem"
					lineHeight="2rem"
					fontWeight="700"
					color="brand.secondary"
				>
					CURRENT LOADOUT
				</Text>
				<Flex
					justifyContent="space-between"
					alignItems="center"
					flexDirection="row"
				>
					<DeleteIcon />

					<Text
						fontSize="1.25rem"
						lineHeight="1.25rem"
						fontWeight="700"
						color="brand.secondary"
						paddingLeft="1rem"
					>
						RESET
					</Text>
				</Flex>
			</Flex>
			<Box>
				<CitizenEquipment enabled={true} citizen={currentCharacter} />
			</Box>
			<Box bgColor="blacks.500" p="2rem" borderRadius="0.5rem">
				<Text
					fontSize="1.75rem"
					lineHeight="2rem"
					fontWeight="700"
					color="brand.secondary"
				>
					AVAILABLE UNITS
				</Text>
			</Box>
		</PanelContainer>
	)
}
