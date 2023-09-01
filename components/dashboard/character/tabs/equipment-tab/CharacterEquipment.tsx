import React, { FC, useRef, useState } from "react"

import { Character, Unit } from "@/types/server"
import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Box,
	Button,
	Flex,
	Grid,
	GridItem,
	Spinner,
	Text,
	useDisclosure,
} from "@chakra-ui/react"
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons"
import { Tip } from "@/components/tooltip"

export const CharacterEquipment: FC<{
	character: Character
	handleDequipUnit: (assetId: string) => void
	combatSkillLevels: { skill: string; level: number }[]
	selectedSkill: string
	loadingUnitDequip: boolean
	setLoadingUnitDequip: (loading: boolean) => void
}> = ({
	character,
	handleDequipUnit,
	combatSkillLevels,
	selectedSkill,
	loadingUnitDequip,
	setLoadingUnitDequip,
}) => {
	const { isOpen, onOpen, onClose } = useDisclosure()
	const cancelRef = useRef<HTMLButtonElement>(null)

	const [unequippingUnit, setUneqippingUnit] = useState<Unit>()

	const totalCombatLevel = combatSkillLevels.reduce(
		(acc, { level }) => acc + level,
		0,
	)

	const totalAvailableSlotsForSkill =
		combatSkillLevels.find(
			(skill) => skill.skill.toUpperCase() === selectedSkill.toUpperCase(),
		)?.level || 0

	const availableSlots =
		totalAvailableSlotsForSkill -
		character.army.filter(
			(unit) => unit.skill.toUpperCase() === selectedSkill.toUpperCase(),
		).length

	return (
		<>
			<Grid
				templateAreas={`"image name name" "image units scroller"`}
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
								{totalCombatLevel}
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
					{character.army.length || selectedSkill.length ? (
						<Grid templateColumns="repeat(10, 0fr)" gap="1rem">
							{character.army.length
								? character.army.map((unit) => (
										<Tip
											label={`${unit.name}\n with bonus: ${Object.keys(unit.bonus).join(
												", ",
											)}`}
											placement="top"
											key={unit.assetId}
										>
											<GridItem
												cursor="pointer"
												onClick={() => {
													setUneqippingUnit(unit)
													onOpen()
												}}
												bgColor="blacks.400"
												minH="3.5rem"
												w="3.5rem"
												borderRadius="0.25rem"
												bgImage={unit.image}
												bgSize="cover"
												bgPos="center"
											/>
										</Tip>
								  ))
								: null}
							{selectedSkill.length
								? Array.from({
										length: availableSlots,
								  }).map((_, i) => (
										<GridItem
											key={i}
											bgColor="blacks.400"
											h="3.5rem"
											w="3.5rem"
											borderRadius="0.25rem"
										/>
								  ))
								: null}
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
				{character.army ? (
					<GridItem
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
					</GridItem>
				) : null}
			</Grid>

			<AlertDialog
				isOpen={isOpen}
				leastDestructiveRef={cancelRef}
				onClose={onClose}
				isCentered
			>
				<AlertDialogOverlay>
					<AlertDialogContent bg="brand.primary" maxWidth="50%" p="3rem">
						<AlertDialogHeader fontSize="3rem" fontWeight="bold">
							Unequip {unequippingUnit?.name}
						</AlertDialogHeader>

						<AlertDialogBody>
							Are you sure you want to unequip {unequippingUnit?.name} from your
							current loadout? Note: It takes around 30 seconds for the unit to appear
							in the list of available units after unequipping.
						</AlertDialogBody>

						<AlertDialogFooter mt="3rem">
							<Button ref={cancelRef} onClick={onClose}>
								Cancel
							</Button>
							<Button
								backgroundColor="red.700"
								onClick={async () => {
									if (!unequippingUnit) {
										onClose()
									}
									setLoadingUnitDequip(true)
									await handleDequipUnit(unequippingUnit?.assetId || "")
									setLoadingUnitDequip(false)
									onClose()
								}}
								ml={3}
							>
								{loadingUnitDequip ? (
									<>
										<Spinner mr="1rem" />
										Unequipping...
									</>
								) : (
									"Unequip"
								)}
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	)
}
