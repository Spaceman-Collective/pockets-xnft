import React, { FC } from "react"
import toast from "react-hot-toast"

import { useSolana } from "@/hooks/useSolana"
import { useUnitDequip } from "@/hooks/useUnit"
import { COMBAT_SKILLS, Character } from "@/types/server"
import { Box, Flex, Grid, GridItem, Text } from "@chakra-ui/react"
import { useQueryClient } from "@tanstack/react-query"
import {
	ArrowBackIcon,
	ArrowForwardIcon,
	ArrowLeftIcon,
	ArrowUpDownIcon,
	ChevronDownIcon,
	ChevronUpIcon,
} from "@chakra-ui/icons"

export const CharacterEquipment: FC<{
	character: Character
	handleDequipUnit: (assetId: string) => void
}> = ({ character, handleDequipUnit }) => {
	const queryClient = useQueryClient()
	const { mutate } = useUnitDequip()

	const combatLevel = COMBAT_SKILLS.reduce(
		(acc, key) =>
			acc + character.skills[key.charAt(0).toUpperCase() + key.slice(1)] || 0,
		0,
	)

	return (
		<Grid
			templateAreas={`
                  "image name name"
                  "image units scroller"`}
			gridTemplateRows={"0fr 1fr"}
			gridTemplateColumns={"12rem 1fr 0fr"}
			h="16rem"
			maxW="100%"
			gap="2rem"
			p="2rem"
			color="blackAlpha.700"
			fontWeight="bold"
			borderRadius="0.5rem"
			overflow="hiddden"
			bgColor="blacks.500"
		>
			<GridItem
				area={"image"}
				display="flex"
				alignItems="center"
				justifyContent="center"
			>
				<Flex
					w="12rem"
					h="12rem"
					bgImage={character.image}
					bgSize="cover"
					bgPos="center"
					borderRadius="0.5rem"
					p="1rem"
				>
					<Box
						backgroundColor="brand.quaternary"
						minW="2.75rem"
						p="0 0.5rem"
						height="2.75rem"
						borderRadius="0.25rem"
						justifyContent="center"
						alignItems="center"
					>
						<Text
							fontSize="1.75rem"
							fontWeight="700"
							display="block"
							textAlign="center"
							alignSelf="center"
							color="blacks.700"
						>
							{combatLevel}
						</Text>
					</Box>
				</Flex>
			</GridItem>
			<GridItem
				area={"name"}
				display="flex"
				flexDir="row"
				alignItems="center"
				justifyContent="space-between"
			>
				<Text
					fontSize="2rem"
					lineHeight="2rem"
					fontWeight="700"
					color="brand.secondary"
					textTransform="uppercase"
				>
					{character.name}
				</Text>
			</GridItem>
			<GridItem area={"units"} overflow="auto">
				{character.army.length ? (
					<Grid templateColumns="repeat(10, 0fr)" gap="1rem">
						{character.army.map((unit) => (
							<GridItem
								cursor="pointer"
								onClick={() => handleDequipUnit(unit.assetId)}
								key={unit.assetId}
								bgColor="blacks.400"
								minH="3.5rem"
								w="3.5rem"
								borderRadius="0.25rem"
								bgImage={unit.image}
								bgSize="cover"
								bgPos="center"
							/>
						))}
					</Grid>
				) : (
					<Box pos="relative" maxW="100%" overflow="hidden">
						<Text
							fontSize="2rem"
							fontWeight="700"
							position="absolute"
							h="8rem"
							w="calc(100% - 5rem)"
							textAlign="center"
							display="flex"
							alignItems="center"
							justifyContent="center"
							zIndex={100}
							color="brand.secondary"
							opacity="0.5"
						>
							NO UNITS EQUIPPED
						</Text>

						<Grid templateColumns="repeat(10, 0fr)" gap="1rem">
							{Array.from({ length: 20 }, (_, i) => (
								<GridItem
									key={i}
									bgColor="blacks.400"
									h="3.5rem"
									w="3.5rem"
									borderRadius="0.25rem"
								/>
							))}
						</Grid>
					</Box>
				)}
			</GridItem>
			{/* <GridItem
				area={"scroller"}
				display="flex"
				flexDir="column"
				color="white"
				fontSize="3rem"
			>
				<Flex
					flex="1"
					bg="blacks.400"
					cursor="pointer"
					transition="all 0.1s ease"
					_hover={{
						backgroundColor: "brand.quaternary",
					}}
				>
					<ChevronUpIcon />
				</Flex>
				<Box h="1rem" />
				<Flex
					flex="1"
					bg="blacks.400"
					alignItems="flex-end"
					cursor="pointer"
					transition="all 0.1s ease"
					_hover={{
						backgroundColor: "brand.quaternary",
					}}
				>
					<ChevronDownIcon />
				</Flex>
			</GridItem> */}
		</Grid>
	)
}
