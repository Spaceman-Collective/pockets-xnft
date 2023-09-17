import { Tip } from "@/components/tooltip"
import { useSolana } from "@/hooks/useSolana"
import { useUnitConsumeConfirm, useUnitConsumeRequest } from "@/hooks/useUnit"
import { getLocalImage } from "@/lib/utils"
import { Unit, UnitTemplate, XP_PER_RANK } from "@/types/server"
import {
	Box,
	Flex,
	Grid,
	Image,
	Skeleton,
	Spinner,
	Text,
} from "@chakra-ui/react"
import { Transaction } from "@solana/web3.js"
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes"
import { useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { FC, ReactNode, useContext, useState } from "react"
import { MainContext } from "@/contexts/MainContext"

interface UnitPlusRank extends Unit {
	rank: string
	mint: string
}

export const ConsumeUnitContainer: FC<{
	unit: UnitTemplate
	unitsInWallet?: UnitPlusRank[]
}> = ({ unit, unitsInWallet }) => {
	const { signTransaction, walletAddress } = useSolana()
	const { selectedCharacter: selectedChar } = useContext(MainContext)
	const img = getLocalImage({ type: "units", name: unit.name })
	const [removedMints, setRemovedMints] = useState([""]) // for optimistic removals
	const [isLoadingRequest, setIsLoadingRequest] = useState<boolean | string>(
		false,
	)
	const queryClient = useQueryClient()
	const { mutate: requestConsume } = useUnitConsumeRequest()
	const { mutate: confirmConsume } = useUnitConsumeConfirm()

	const handleRequestConsume = async (unit: UnitPlusRank) => {
		console.log({ unit })
		if (!selectedChar) {
			toast.error("no selected char")
			return
		}
		if (!unit || unit.mint === undefined) {
			toast.error("no unit")
			return
		}
		setIsLoadingRequest(unit.mint)
		const payload = {
			mint: selectedChar.mint, // Character Mint
			unit: unit.mint, // NFT address
		}

		requestConsume(payload, {
			onError: (e: any) => {
				//toast.error(JSON.stringify(e))
				toast.error(e.response.data)
				setIsLoadingRequest(false)
			},
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

				confirmConsume(encodedReturnTx, {
					onSuccess: async () => {
						toast.success(
							`${unit.name} was consumed for ${+unit.rank * XP_PER_RANK}xp!`,
							{ duration: 7000 },
						)
						setRemovedMints([...removedMints, unit.mint])
						queryClient.refetchQueries({ queryKey: ["assets"] })
						queryClient.refetchQueries({
							queryKey: ["wallet-assets", walletAddress],
						})

						setIsLoadingRequest(false)
					},
					onError: (e) => toast.error(JSON.stringify(e)),
					onSettled: () => setIsLoadingRequest(false),
				})
			},
		})
	}

	return (
		<Box>
			<Flex gap="1rem" flexWrap="wrap">
				{unitsInWallet && unitsInWallet.length === 0 && (
					<Grid placeItems="center" w="100%" gap="1rem">
						<Text textAlign="center">
							You don&apos;t own any <br />
							{unit.name}s.
						</Text>
						<Image
							src={img}
							alt={unit.name}
							w="20rem"
							opacity={0.5}
							filter="saturate(0.2)"
							borderRadius="1rem"
							transition="all 0.25s ease-in-out"
							_hover={{
								filter: "saturate(1)",
							}}
						/>
					</Grid>
				)}
				{unitsInWallet &&
					unitsInWallet.map((unit) => {
						const isRemoved = removedMints.includes(unit.mint)
						return (
							<>
								{isRemoved && (
									<Tip label="Consumption is in progress">
										<Skeleton h="102px" w="104px" borderRadius="1rem" />
									</Tip>
								)}
								{!isRemoved && (
									<UnitFrame
										key={unit?.mint}
										unit={unit}
										img={img}
										isLoading={isLoadingRequest}
										onClick={async () => await handleRequestConsume(unit)}
									/>
								)}
							</>
						)
					})}
			</Flex>
		</Box>
	)
}

const UnitFrame: FC<{
	unit: UnitPlusRank
	img: string
	isLoading: boolean | string
	onClick: () => void
}> = ({ unit, img, onClick, isLoading }) => {
	if (!unit) return null
	const bonuses = Object.keys(unit.bonus)
	const loading = isLoading?.toString().toLowerCase() === unit.mint.toLowerCase()
	return (
		<Box
			onClick={onClick}
			cursor="pointer"
			bg="blacks.700"
			color="white"
			p="0.5rem"
			borderRadius="1rem"
		>
			<Flex
				bg="blacks.500"
				p="1rem"
				borderRadius="0.5rem 0.5rem 0 0"
				justifyContent="center"
				minH="4.75rem"
			>
				{loading && <Spinner />}
				{!loading && (
					<Text fontWeight="700" letterSpacing="1px">
						{+unit.rank * XP_PER_RANK}xp
					</Text>
				)}
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
