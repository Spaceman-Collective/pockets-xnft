import { Tip } from "@/components/tooltip"
import { useSelectedCharacter } from "@/hooks/useSelectedCharacter"
import { useSolana } from "@/hooks/useSolana"
import { useUnitConsumeConfirm, useUnitConsumeRequest } from "@/hooks/useUnit"
import { getLocalImage } from "@/lib/utils"
import { Unit, UnitTemplate, XP_PER_RANK } from "@/types/server"
import { Box, Flex, Image, Text } from "@chakra-ui/react"
import { Transaction } from "@solana/web3.js"
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes"
import { useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { FC, ReactNode, useState } from "react"

interface UnitPlusRank extends Unit {
	rank: string
}

export const ConsumeUnitContainer: FC<{
	unit: UnitTemplate
	unitsInWallet?: UnitPlusRank[]
}> = ({ unit, unitsInWallet }) => {
	const { signTransaction, walletAddress } = useSolana()
	const [selectedChar, _] = useSelectedCharacter()
	const img = getLocalImage({ type: "units", name: unit.name })
	const [isLoadingRequest, setIsLoadingRequest] = useState(false)

	const queryClient = useQueryClient()
	const { mutate: requestConsume } = useUnitConsumeRequest()
	const { mutate: confirmConsume } = useUnitConsumeConfirm()

	const handleRequestConsume = async (unit: UnitPlusRank) => {
		if (!selectedChar) return
		if (!unit || unit.mint === undefined) return
		setIsLoadingRequest(true)
		const payload = {
			mint: selectedChar.mint, // Character Mint
			unit: unit.mint, // NFT address
		}

		requestConsume(payload, {
			onSuccess: async (data: { encodedTx: string }) => {
				const { encodedTx } = data
				console.log("unit consume request encoded tx: ", encodedTx)

				const signedTx = await signTransaction(
					Transaction.from(bs58.decode(encodedTx)),
				)

				const encodedReturnTx = bs58.encode(signedTx.serialize())
				if (!encodedReturnTx) {
					toast.error("no encoded tx")
					return
				}

				confirmConsume(
					{ signedTx: encodedReturnTx },
					{
						onSuccess: async () => {
							toast.success("Unit equipped")
							queryClient.refetchQueries({ queryKey: ["assets"] })
							queryClient.refetchQueries({
								queryKey: ["wallet-assets", walletAddress],
							})

							setIsLoadingRequest(false)
						},
						onError: (e) => toast.error(JSON.stringify(e)),
						onSettled: () => setIsLoadingRequest(false),
					},
				)
			},
			onError: (e) => {
				toast.error(JSON.stringify(e))
				setIsLoadingRequest(false)
			},
		})
	}

	return (
		<Box>
			<Flex gap="1rem" flexWrap="wrap">
				{unitsInWallet &&
					unitsInWallet.map((unit) => {
						return (
							<UnitFrame
								key={unit?.mint}
								unit={unit}
								img={img}
								onClick={() => handleRequestConsume(unit)}
							/>
						)
					})}
			</Flex>
		</Box>
	)
}

const UnitFrame: FC<{
	unit: UnitPlusRank
	img: string
	onClick: () => void
}> = ({ unit, img }) => {
	if (!unit) return null
	const bonuses = Object.keys(unit.bonus)
	return (
		<Box bg="blacks.700" color="white" p="0.5rem" borderRadius="1rem">
			<Flex
				bg="blacks.500"
				p="1rem"
				borderRadius="0.5rem 0.5rem 0 0"
				justifyContent="center"
			>
				<Text fontWeight="700" letterSpacing="1px">
					{+unit.rank * XP_PER_RANK}xp
				</Text>
			</Flex>
			<TipWrapper bonuses={bonuses} unit={unit}>
				<Image
					src={img}
					alt={unit.name}
					borderRadius="0 0 0.5rem 0.5rem"
					boxSize="12rem"
					h="7rem"
					objectFit="cover"
					objectPosition="top"
				/>
			</TipWrapper>
		</Box>
	)
}
const TipWrapper: FC<{
	bonuses: string[]
	unit: Unit
	children: ReactNode
}> = ({ bonuses, unit, children }) => {
	return (
		<Tip
			label={
				<Box>
					{bonuses.map((bonus, i) => (
						<BonusTip
							key={i + "bonus" + bonus}
							bonus={bonus}
							bonusValue={unit.bonus[bonus]}
						/>
					))}
				</Box>
			}
		>
			{children}
		</Tip>
	)
}
const BonusTip: FC<{ bonus: string; bonusValue: number }> = ({
	bonus,
	bonusValue,
}) => {
	return (
		<Flex justifyContent="space-between" gap="1rem" px="1rem">
			<Text
				fontSize="1.25rem"
				letterSpacing="0.5px"
				w="8ch"
				noOfLines={1}
				textOverflow="ellipsis"
			>
				{bonus}
			</Text>
			<Text fontSize="1.25rem" letterSpacing="0.5px">
				{bonusValue}
			</Text>
		</Flex>
	)
}
