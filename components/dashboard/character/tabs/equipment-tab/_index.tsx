import { FC, useState } from "react"

import { PanelContainer } from "@/components/layout"
import { useAllWalletAssets } from "@/hooks/useWalletAssets"
import { colors } from "@/styles/defaultTheme"
import { COMBAT_SKILLS, Character, NFT } from "@/types/server"
import { AddIcon } from "@chakra-ui/icons"
import { Box, Button, Flex, Spinner, Text } from "@chakra-ui/react"
import { toast } from "react-hot-toast"

import { useSolana } from "@/hooks/useSolana"
import { CharacterEquipment } from "./CharacterEquipment"
import { useUnitConfirmEquip, useUnitRequestEquip } from "@/hooks/useUnit"
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes"
import { Transaction } from "@solana/web3.js"
import { useQueryClient } from "@tanstack/react-query"
import { timeout } from "@/lib/utils"
import { IconSkill } from "@/components/icons"

export const EquipmentTab: FC<{
	currentCharacter: Character
}> = ({ currentCharacter }) => {
	const [loadingUnitEquip, setLoadingUnitEquip] = useState<boolean>(false)
	const [skillFilter, setSkillFilter] = useState<string>("")
	const queryClient = useQueryClient()
	const { mutate: requestMutate } = useUnitRequestEquip()
	const { mutate: confirmMutate } = useUnitConfirmEquip()
	const { signTransaction, walletAddress } = useSolana()
	const { data: walletAssets, isLoading: walletAssetsIsLoading } =
		useAllWalletAssets()

	const handleEquipUnit = async (unit: NFT) => {
		setLoadingUnitEquip(true)
		console.log("EQUIP UNIT", unit)
		const payload = {
			mint: currentCharacter.mint, // Character Mint
			unit: unit.mint, // NFT address
		}

		console.log("[REQUEST EQUIP] PAYLOAD", payload)

		requestMutate(payload, {
			onSuccess: async (data: { encodedTx: string }) => {
				const { encodedTx } = data
				console.log("[REQUEST EQUIP] SUCCESS; ENCODED TX", encodedTx)
				const decodedTx = Transaction.from(bs58.decode(encodedTx))
				console.log("[REQUEST EQUIP] DECODED TX", decodedTx)
				const signedTx = await signTransaction(decodedTx)
				console.log("[REQUEST EQUIP] SIGNED TX", signedTx)
				const encodedReturnTx = bs58.encode(signedTx.serialize())
				console.log("[REQUEST EQUIP] ENCODED RETURN TX", encodedReturnTx)

				confirmMutate(encodedReturnTx, {
					onSuccess: async () => {
						toast.success("Unit equipped")
						queryClient.refetchQueries({
							queryKey: ["wallet-assets", walletAddress],
						})
						queryClient.refetchQueries({ queryKey: ["assets"] })
						setLoadingUnitEquip(false)
					},
					onError: (e) => toast.error(JSON.stringify(e)),
					onSettled: () => setLoadingUnitEquip(false),
				})
			},
			onError: (e) => {
				toast.error(JSON.stringify(e))
				setLoadingUnitEquip(false)
			},
		})
	}

	const units =
		walletAssets?.units.filter(
			(unit) =>
				String(unit.attributes.Skill).toLocaleUpperCase() ===
					skillFilter.toUpperCase() || !skillFilter.length,
		) || []

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
					{/* <RepeatIcon height="1.5rem" aspectRatio="1" />

					<Text
						fontSize="1.25rem"
						lineHeight="1.25rem"
						fontWeight="700"
						paddingLeft="0.25rem"
					>
						UNEQUIP ALL
					</Text> */}
				</Flex>
			</Flex>
			<Box>
				<CharacterEquipment enabled={true} character={currentCharacter} />
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
			<Flex flexDirection="row" overflow="auto">
				{Object.keys(IconSkill).map((skill, index) => {
					if (
						COMBAT_SKILLS.find(
							(combatSkill) =>
								combatSkill.toUpperCase() === skill.toUpperCase(),
						)
					) {
						const Icon = Object.values(IconSkill)[index]
						const name = skill.charAt(0).toUpperCase() + skill.substring(1)
						return (
							<Flex
								onClick={() =>
									skillFilter === skill
										? setSkillFilter("")
										: setSkillFilter(skill)
								}
								m="0 0.5rem"
								flexDir="row"
								borderRadius="0.5rem"
								p="1.5rem"
								flex="1 1 auto"
								bg={
									skillFilter === skill
										? colors.brand.quaternary
										: colors.blacks[500]
								}
								color={
									skillFilter === skill
										? colors.blacks[700]
										: colors.brand.secondary
								}
								_last={{ marginRight: 0 }}
								_first={{ marginLeft: 0 }}
								cursor="pointer"
								transition="all 0.1s ease"
								_hover={{
									bg:
										skillFilter === skill
											? colors.brand.quaternary
											: colors.blacks[600],
								}}
								alignItems="center"
							>
								<Icon
									style={{
										fontSize: "2rem",
									}}
								/>
								<Text
									ml="1rem"
									textTransform="uppercase"
									fontWeight="600"
									fontSize="1.25rem"
								>
									{name}
								</Text>
							</Flex>
						)
					}
				})}
			</Flex>
			<Box overflow="auto">
				{units.length && !walletAssetsIsLoading ? (
					units.map((unit) => {
						return (
							<Flex
								bgColor="blacks.500"
								p="1.5rem"
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
									w="12rem"
									h="12rem"
									p="1rem"
									bgImage={unit.image_uri}
									bgSize="cover"
									bgPos="center"
								>
									<Flex
										backgroundColor="rgba(0,0,0,0.5)"
										minW="2.75rem"
										p="0 0.25rem"
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
											color="brand.secondary"
										>
											{unit.attributes.Rank}
										</Text>
									</Flex>
								</Flex>
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
												{unit.name}
											</Text>
										</Box>
										<Flex
											flexDirection="row"
											flex="1 1 auto"
											alignSelf="center"
											alignContent="center"
											justifyContent="flex-end"
										>
											{Object.keys(IconSkill).map((skill, index) => {
												const unitSkill = String(
													unit.attributes.Skill,
												).toUpperCase()
												if (unitSkill === skill.toUpperCase()) {
													const Icon = Object.values(IconSkill)[index]
													return (
														<Flex
															p="0.625rem"
															bgColor="white.700"
															borderRadius="0.5rem"
														>
															<Icon
																style={{ color: "white", fontSize: "2.5rem" }}
															/>{" "}
														</Flex>
													)
												}
											})}
										</Flex>
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
												Bonus 1
											</Text>
											<Text
												pt="0.5rem"
												fontWeight="600"
												fontSize="1.75rem"
												lineHeight="1.75rem"
											>
												{Object.keys(unit.attributes)[0]}
												{" +"}
												{unit.attributes[Object.keys(unit.attributes)[0]]}
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
												Bonus 2
											</Text>
											<Text
												pt="0.5rem"
												fontWeight="600"
												fontSize="1.75rem"
												lineHeight="1.75rem"
											>
												{Object.keys(unit.attributes)[1]}
												{" +"}
												{unit.attributes[Object.keys(unit.attributes)[1]]}
											</Text>
										</Flex>
										<Flex
											flexDirection="row"
											flex="1 1 auto"
											alignSelf="center"
											alignContent="center"
											justifyContent="flex-end"
										>
											<Button
												bgColor="blacks.700"
												borderRadius="0.5rem"
												p="1.25rem"
												fontSize="1.5rem"
												lineHeight="1.5rem"
												fontWeight="600"
												onClick={
													loadingUnitEquip
														? () => {}
														: () => handleEquipUnit(unit)
												}
												opacity={loadingUnitEquip ? 0.5 : 1}
												cursor={loadingUnitEquip ? "not-allowed" : "cursor"}
											>
												{loadingUnitEquip ? <Spinner /> : <AddIcon />}
												<Box w="1rem" />
												Equip Unit
											</Button>
										</Flex>
									</Flex>
								</Flex>
							</Flex>
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
							{skillFilter.length
								? `No ${skillFilter} units available`
								: "No Units Available"}
						</Text>
					</Box>
				)}
			</Box>
		</PanelContainer>
	)
}
