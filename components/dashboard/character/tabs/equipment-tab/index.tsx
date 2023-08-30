import { FC } from "react"

import { PanelContainer } from "@/components/layout"
import { useAllWalletAssets } from "@/hooks/useWalletAssets"
import { colors } from "@/styles/defaultTheme"
import { Character, NFT } from "@/types/server"
import { AddIcon, RepeatIcon } from "@chakra-ui/icons"
import { Box, Button, Flex, Text, space } from "@chakra-ui/react"

import { CitizenEquipment } from "../citizen-equipment.component"
import { useSolana } from "@/hooks/useSolana"

export const EquipmentTab: FC<{
	currentCharacter: Character
}> = ({ currentCharacter }) => {
	const { data: walletAssets, isLoading: walletAssetsIsLoading } =
		useAllWalletAssets()
	const {
		buildMemoIx,
		encodeTransaction,
		walletAddress,
		connection,
		signTransaction,
	} = useSolana()

	console.log(walletAssets)
	console.log(currentCharacter.mint)

	const handleEquipUnit = (unit: NFT) => {
		console.log(unit)
	}

	return (
		<PanelContainer
			display="flex"
			flexDirection="column"
			gap="2rem"
			width="100%"
		>
			<Flex
				bgColor="blacks.600"
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
					color="brand.secondary"
					transition="all 0.1s ease"
					cursor="pointer"
					_hover={{
						color: colors.red[700],
					}}
				>
					<RepeatIcon height="1.5rem" aspectRatio="1" />

					<Text
						fontSize="1.25rem"
						lineHeight="1.25rem"
						fontWeight="700"
						paddingLeft="0.25rem"
					>
						UNEQUIP ALL
					</Text>
				</Flex>
			</Flex>
			<Box>
				<CitizenEquipment enabled={true} citizen={currentCharacter} />
			</Box>
			<Box bgColor="blacks.600" p="2rem" borderRadius="0.5rem">
				<Text
					fontSize="1.75rem"
					lineHeight="2rem"
					fontWeight="700"
					color="brand.secondary"
				>
					AVAILABLE UNITS
				</Text>
			</Box>
			<Box overflow="auto">
				{walletAssets?.units.length && !walletAssetsIsLoading ? (
					walletAssets?.units.map((unit) => (
						<Flex
							bgColor="blacks.500"
							p="1.75rem"
							borderRadius="0.5rem"
							key={unit.mint}
							flexDirection="row"
							alignItems="center"
							justifyContent="space-between"
							mb="2rem"
							_last={{ mb: 0 }}
						>
							<Flex
								bgColor="brand.tertiary"
								borderRadius="0.5rem"
								aspectRatio="1"
								maxH="12rem"
								maxW="12rem"
								h="100%"
								w="100%"
								p="1rem"
								bgImage={unit.image_uri}
								bgSize="cover"
								bgPos="center"
							/>
							<Flex flexDirection="column" flex="1 1 auto" pl="2rem">
								<Flex
									flexDirection="row"
									justifyContent="space-between"
									alignItems="flex-start"
								>
									<Box>
										<Text
											fontWeight="600"
											fontSize="1.5rem"
											lineHeight="1.5rem"
											color="brand.tertiary"
											textTransform="uppercase"
										>
											Name
										</Text>
										<Text
											pt="0.5rem"
											fontWeight="600"
											fontSize="1.75rem"
											lineHeight="1.75rem"
										>
											{Object.keys(unit.attributes)[0]}
										</Text>
									</Box>
									<Button
										bgColor="blacks.700"
										borderRadius="0.5rem"
										p="1.5rem 2rem"
										fontSize="1.5rem"
										lineHeight="1.5rem"
										fontWeight="600"
										onClick={() => handleEquipUnit(unit)}
									>
										<AddIcon mr="1rem" />
										Equip Unit
									</Button>
								</Flex>
								<Flex flexDirection="row" w="100%" pt="2rem">
									<Flex flexDirection="column" pr="4rem">
										<Text
											fontWeight="600"
											fontSize="1.5rem"
											lineHeight="1.5rem"
											color="brand.tertiary"
											textTransform="uppercase"
										>
											Skill
										</Text>
										<Text
											pt="0.5rem"
											fontWeight="600"
											fontSize="1.75rem"
											lineHeight="1.75rem"
										>
											{unit.attributes.Skill}
										</Text>
									</Flex>
									<Flex flexDirection="column" pr="4rem">
										<Text
											fontWeight="600"
											fontSize="1.5rem"
											lineHeight="1.5rem"
											color="brand.tertiary"
											textTransform="uppercase"
										>
											Specialty
										</Text>
										<Text
											pt="0.5rem"
											fontWeight="600"
											fontSize="1.75rem"
											lineHeight="1.75rem"
										>
											{Object.keys(unit.attributes)[1]}
										</Text>
									</Flex>
									<Flex flexDirection="column" pr="4rem">
										<Text
											fontWeight="600"
											fontSize="1.5rem"
											lineHeight="1.5rem"
											color="brand.tertiary"
											textTransform="uppercase"
										>
											Rank
										</Text>
										<Text
											pt="0.5rem"
											fontWeight="600"
											fontSize="1.75rem"
											lineHeight="1.75rem"
										>
											{unit.attributes.Rank}
										</Text>
									</Flex>
								</Flex>
							</Flex>
						</Flex>
					))
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
						<Text opacity="0.5">No Units Available</Text>
					</Box>
				)}
			</Box>
		</PanelContainer>
	)
}
