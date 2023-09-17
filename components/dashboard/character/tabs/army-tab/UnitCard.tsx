import React, { useState } from "react"
import {
	Flex,
	Box,
	Text,
	Button,
	Spinner,
	Grid,
	GridItem,
} from "@chakra-ui/react"
import { AddIcon, WarningTwoIcon } from "@chakra-ui/icons"
import {
	COMBAT_SKILLS,
	Character,
	NFT,
	UNIT_TEMPLATES,
	buildUnitFromNFT,
} from "@/types/server"
import { IconSkill } from "@/components/icons"
import { useUnitConfirmEquip, useUnitRequestEquip } from "@/hooks/useUnit"
import { Transaction } from "@solana/web3.js"
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes"
import toast from "react-hot-toast"
import { useQueryClient } from "@tanstack/react-query"
import { useSolana } from "@/hooks/useSolana"
import { colors } from "@/styles/defaultTheme"
import { Tip } from "@/components/tooltip"

interface UnitCardProps {
	unitNFT: NFT
	character: Character
	combatSkillLevels: { skill: string; level: number }[]
}

export const UnitCard: React.FC<UnitCardProps> = ({
	unitNFT,
	character,
	combatSkillLevels,
}) => {
	// State
	const [loadingUnitEquip, setLoadingUnitEquip] = useState<boolean>(false)

	// Hooks
	const { signTransaction, walletAddress } = useSolana()
	const { mutate: requestUnitEquip } = useUnitRequestEquip()
	const { mutate: confirmUnitEquip } = useUnitConfirmEquip()

	// Functions
	const unit = buildUnitFromNFT(unitNFT)
	const queryClient = useQueryClient()
	const checkIfUnitIsEquippable = (skill: string) => {
		const skillLevel = combatSkillLevels.find(
			(skillLevel) => skillLevel.skill.toUpperCase() === skill.toUpperCase(),
		)

		if (!skillLevel) return false

		const totalUnitsForSkill = character.army.filter(
			(unit) => unit.skill.toUpperCase() === skill.toUpperCase(),
		).length

		return skillLevel.level > totalUnitsForSkill
	}

	// Handlers
	const handleEquipUnit = async (unit: NFT) => {
		setLoadingUnitEquip(true)
		const payload = {
			mint: character!.mint, // Character Mint
			unit: unitNFT.mint, // NFT address
		}

		requestUnitEquip(payload, {
			onSuccess: async (data: { encodedTx: string }) => {
				const { encodedTx } = data

				const signedTx = await signTransaction(
					Transaction.from(bs58.decode(encodedTx)),
				)

				const encodedReturnTx = bs58.encode(signedTx.serialize())

				confirmUnitEquip(encodedReturnTx, {
					onSuccess: async () => {
						toast.success("Unit equipped")
						queryClient.refetchQueries({ queryKey: ["assets"] })
						queryClient.refetchQueries({
							queryKey: ["wallet-assets", walletAddress],
						})

						setLoadingUnitEquip(false)
					},
					onError: (e: any) => toast.error(e.response.data), //toast.error(JSON.stringify(e)),
					onSettled: () => setLoadingUnitEquip(false),
				})
			},
			onError: (e) => {
				toast.error(JSON.stringify(e))
				setLoadingUnitEquip(false)
			},
		})
	}

	return (
		<Grid
			templateAreas={`
                  "image name skill"
                  "image bonusses button"`}
			gridTemplateRows={"1fr 1fr"}
			gridTemplateColumns={"12rem 1fr 0fr"}
			h="16rem"
			gap="2rem"
			p="2rem"
			borderRadius="0.5rem"
			overflow="hiddden"
			bgColor="blacks.500"
			mb="2rem"
			_last={{ mb: 0 }}
		>
			<GridItem
				bg="orange.300"
				area="image"
				bgColor="brand.tertiary"
				borderRadius="0.5rem"
				w="12rem"
				h="12rem"
				p="1rem"
				bgImage={unit.image}
				bgSize="cover"
				bgPos="center"
				display="flex"
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
						{Object.values(unit.bonus).reduce((acc, key) => acc + key, 0)}
					</Text>
				</Flex>
			</GridItem>
			<GridItem area="name">
				<Box>
					<Text
						fontWeight="700"
						fontSize="1.5rem"
						lineHeight="1.5rem"
						color="brand.tertiary"
						textTransform="uppercase"
					>
						Name
					</Text>
					<Text pt="0.5rem" fontWeight="600" fontSize="1.75rem" lineHeight="1.75rem">
						{unit.name}
					</Text>
				</Box>
			</GridItem>
			<GridItem area="bonusses" display="flex">
				{Object.keys(unit.bonus).map((bonus, index) => {
					const bonusName = Object.keys(unit.bonus)[index]
					const bonusValue = unit.bonus[bonus]

					return (
						<Tip
							label={`+${bonusValue} bonus against ${bonusName}`}
							placement="top"
							key={index}
						>
							<Flex
								flexDirection="row"
								pr="1rem"
								bgImage={UNIT_TEMPLATES.find((t) => t.name === bonusName)?.image}
								bgSize="cover"
								filter="grayscale(100%)"
								h="5rem"
								w="5rem"
								p="0rem"
								borderRadius="0.5rem"
								_notLast={{
									marginRight: "1rem",
								}}
								_hover={{
									filter: "grayscale(0%)",
								}}
								transition="all 0.2s ease"
								justifyContent="flex-end"
							>
								<Text fontSize="1.25rem" fontWeight="700" m="0.25rem 0.5rem">
									<Text mr="0.1rem" as="span">
										+
									</Text>
									{bonusValue}
								</Text>
							</Flex>
						</Tip>
					)
				})}
			</GridItem>
			<GridItem area="skill" display="flex" justifyContent="flex-end">
				{Object.keys(IconSkill).map((skill, index) => {
					if (String(unit.skill).toUpperCase() === skill.toUpperCase()) {
						const Icon = Object.values(IconSkill)[index]
						return (
							<Tip label={unit.skill} placement="top" key={skill}>
								<Flex
									p="1.25rem"
									bgColor="blacks.600"
									borderRadius="0.5rem"
									justifyContent="center"
								>
									<Icon style={{ color: colors.brand.secondary, fontSize: "2.5rem" }} />{" "}
								</Flex>
							</Tip>
						)
					}
				})}
			</GridItem>
			<GridItem area="button" display="flex">
				{checkIfUnitIsEquippable(unit.skill) ? (
					<Button
						bgColor="blacks.700"
						borderRadius="0.5rem"
						p="1.25rem"
						fontSize="1.25rem"
						lineHeight="1.25rem"
						fontWeight="700"
						flex="1 1 auto"
						onClick={loadingUnitEquip ? () => {} : () => handleEquipUnit(unitNFT)}
						opacity={loadingUnitEquip ? 0.5 : 1}
						cursor={loadingUnitEquip ? "not-allowed" : "cursor"}
					>
						{loadingUnitEquip ? <Spinner /> : <AddIcon />}
						<Box w="1rem" />
						Equip Unit
					</Button>
				) : (
					<Button
						bgColor="blacks.700"
						borderRadius="0.5rem"
						p="1.25rem"
						fontSize="1.25rem"
						lineHeight="1.25rem"
						fontWeight="700"
						flex="1 1 auto"
						opacity="0.5"
						cursor="not-allowed"
					>
						<WarningTwoIcon />
						<Box w="1rem" />
						{unit.skill} level too low
					</Button>
				)}
			</GridItem>
		</Grid>
	)
}
