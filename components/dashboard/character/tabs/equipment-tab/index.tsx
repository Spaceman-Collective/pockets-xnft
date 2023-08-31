import { FC, useState } from "react"

import { PanelContainer } from "@/components/layout"
import { useAllWalletAssets } from "@/hooks/useWalletAssets"
import { colors } from "@/styles/defaultTheme"
import { Character, NFT } from "@/types/server"
import { AddIcon, RepeatIcon } from "@chakra-ui/icons"
import { Box, Button, Flex, Text } from "@chakra-ui/react"
import { toast } from "react-hot-toast"

import { buildTransferIx, useSolana } from "@/hooks/useSolana"
import { CharacterEquipment } from "../character-equipment.component"
import {
	useUnitConfirmEquip,
	useUnitDequip,
	useUnitRequestEquip,
} from "@/hooks/useUnit"
import { SERVER_KEY, SPL_TOKENS } from "@/constants"
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes"
import { Transaction } from "@solana/web3.js"

export const EquipmentTab: FC<{
	currentCharacter: Character
}> = ({ currentCharacter }) => {
	const [selectedCharacter, _] = useState<Character>(currentCharacter)

	const { mutate: requestMutate } = useUnitRequestEquip()
	const { mutate: confirmMutate } = useUnitConfirmEquip()
	const { signTransaction } = useSolana()
	const { data: walletAssets, isLoading: walletAssetsIsLoading } =
		useAllWalletAssets()

	const handleEquipUnit = async (unit: NFT) => {
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
					onSuccess: async () => toast.success("Unit equip request confirmed"),
					onError: (e) => toast.error(JSON.stringify(e)),
				})
			},
			onError: (e) => toast.error(JSON.stringify(e)),
		})
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
				<CharacterEquipment enabled={true} citizen={currentCharacter} />
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
