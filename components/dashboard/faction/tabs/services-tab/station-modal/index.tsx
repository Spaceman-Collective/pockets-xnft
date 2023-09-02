import {
	Slider,
	SliderFilledTrack,
	SliderThumb,
	SliderTrack,
	Text,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
	ModalCloseButton,
	Flex,
	VStack,
	Image,
	Grid,
	Progress,
	Button,
	HStack,
	Spinner,
	Box,
} from "@chakra-ui/react"
import { FC, useEffect, useState } from "react"
import { useCountdown } from "usehooks-ts"
import { toast } from "react-hot-toast"
import { useCharTimers, useSpeedUpTimer } from "@/hooks/useCharTimers"
import { useSelectedCharacter } from "@/hooks/useSelectedCharacter"
import { buildTransferIx, useSolana } from "@/hooks/useSolana"
import {
	useFactionStationClaim,
	useFactionStationStart,
} from "@/hooks/useFaction"
import { useAllWalletAssets } from "@/hooks/useWalletAssets"
import { useQueryClient } from "@tanstack/react-query"
import { FaClock } from "react-icons/fa"
import { ResourceContainer } from "./resource-container.component"
import { startStationProcess as startStation } from "./tx-builder"
import { Tip } from "@/components/tooltip"
import { formatBalance, getLocalImage, timeAgo } from "@/lib/utils"
import { getBlueprint } from "@/types/server"
import {
	BONK_COST_PER_MS_WIPED,
	BONK_MINT,
	SERVER_KEY,
	STATION_USE_COST_PER_LEVEL,
} from "@/constants"

export const ModalStation: FC<{
	station?: {
		blueprint: string
		id: string
		faction: string
		level: number
	}
	isOpen: boolean
	onClose: () => void
}> = ({ station, isOpen, onClose }) => {
	const {
		buildMemoIx,
		encodeTransaction,
		walletAddress,
		connection,
		signTransaction,
		buildBurnIx,
	} = useSolana()

	const [selectedCharacter, _] = useSelectedCharacter()
	const { data: walletAssets } = useAllWalletAssets()
	const { data: timersData } = useCharTimers({ mint: selectedCharacter?.mint })

	const [input, setInput] = useState<number>(0)
	const [onHover, setOnHover] = useState<boolean>(false)
	const over = () => setOnHover(true)
	const out = () => setOnHover(false)

	const timer = timersData?.stationTimers.find((e) => e.station === station?.id)

	const finishedDate = timer?.finished && +timer?.finished
	const finishedTime = typeof finishedDate === "number" ? finishedDate : 0

	const startDate = timer?.started && +timer?.started
	const startTime = typeof startDate === "number" ? startDate : 0

	const remainingTime = (finishedTime - Date.now()) / 1000
	const isFuture = remainingTime > 0
	const isClaimable = Date.now() > finishedTime && timer !== undefined

	const totalTimeInSeconds = (finishedTime - startTime) / 1000
	const [count, { startCountdown, resetCountdown }] = useCountdown({
		countStart: isFuture ? Math.floor(remainingTime) : 0,
		intervalMs: 1000,
	})

	useEffect(() => {
		if (!isClaimable) return
		startCountdown()
	}, [isClaimable, startCountdown])

	useEffect(() => {
		if (remainingTime < 0) return
		resetCountdown()
		startCountdown()
	}, [remainingTime, resetCountdown, startCountdown])

	useEffect(() => {
		if (!!timer || !isOpen) return
		resetCountdown()
	}, [isOpen, !!timer])

	const queryClient = useQueryClient()
	const { mutate } = useFactionStationStart()
	const { mutate: speedUp, isLoading: speedUpIsLoading } = useSpeedUpTimer()
	const { mutate: claim, isLoading } = useFactionStationClaim()

	const stationBlueprint = station && getBlueprint(station?.blueprint)
	const progress = ((totalTimeInSeconds - count) / totalTimeInSeconds) * 100
	const image = getLocalImage({
		type: "stations",
		name: station?.blueprint ?? "",
	})
	const stationInputs = stationBlueprint?.inputs.map((e) => e.resource)
	const resourcesInWallet = walletAssets?.resources.filter((e) => {
		return stationInputs?.includes(e.name)
	})

	const hasEnoughResources = stationBlueprint?.inputs?.map(
		(e) =>
			resourcesInWallet?.find((walletItem) => walletItem.name === e?.resource)
				?.value,
	)

	const startStationProcess = async () => {
		if (hasEnoughResources?.includes("0")) {
			toast.error(`You don't have enough resources`)
			return
		}
		if (buildBurnIx === undefined || !buildBurnIx) {
			toast.error("Unable to build burn ix")
			return
		}

		try {
			await startStation({
				connection,
				walletAddress,
				selectedCharacter,
				station,
				stationBlueprint,
				signTransaction,
				encodeTransaction,
				buildMemoIx,
				//@ts-ignore no idea why this says it can still be undefined
				buildBurnIx,
				mutateStartStation: mutate,
				startCountdown,
				queryClient,
			})
		} catch (err) {
			console.error("failed to start error", err)
			//@ts-ignore
			const errorMessage = err?.response?.data?.error
			const errorWrongFaction =
				errorMessage === "Can only use stations in your faction!"
					? " Reselect character to fix."
					: ""
			toast.error(
				"Failed to start the station: " +
					`\n` +
					errorMessage +
					errorWrongFaction +
					`\n\n` +
					JSON.stringify(err),
			)
		}
	}

	const claimStationReward = async () => {
		if (!selectedCharacter?.mint || !station?.id)
			return toast.error("No Mint or StationId")
		claim(
			{ mint: selectedCharacter?.mint, stationId: station.id },
			{
				onSuccess: (response) => {
					queryClient.refetchQueries({ queryKey: ["char-timers"] })
					queryClient.refetchQueries({ queryKey: ["assets"] })
					queryClient.refetchQueries({ queryKey: ["wallet-assets"] })
					console.log({ response })
					toast.success(
						"You've claimed the reward from the " +
							station?.blueprint +
							"\nCheck inventory for new items.",
					)
				},
			},
		)
	}

	const speedUpWithBonk = async () => {
		//todo
		if (!walletAddress) {
			toast.error("No wallet connected")
			return
		}
		if (selectedCharacter?.mint === undefined) {
			toast.error("No selected character")
			return
		}

		const speedUpTime = input * 1000
		const memoIx = buildMemoIx({
			walletAddress,
			payload: {
				mint: selectedCharacter?.mint,
				timestamp: Date.now().toString(),
				type: "STATION",
				timerId: timer?.id,
				msSpedUp: speedUpTime,
			},
		})

		try {
			const bonkIxs = await buildTransferIx({
				walletAddress,
				connection,
				mint: BONK_MINT.toString(),
				receipientAddress: SERVER_KEY,
				amount: BigInt(speedUpTime) * BONK_COST_PER_MS_WIPED,
				decimals: 5,
			})

			const encodedTx = await encodeTransaction({
				walletAddress,
				connection,
				signTransaction,
				//@ts-ignore
				txInstructions: [memoIx, ...bonkIxs],
			})

			if (encodedTx instanceof Error) {
				toast.error("Unable to build tx to speed up bonk")
				throw Error("Unable to build tx to speed up bonk")
			}
			speedUp(
				{ signedTx: encodedTx },
				{
					onSuccess: (_) => {
						toast.success("Successfully speed up timer!")
						queryClient.refetchQueries({ queryKey: ["char-timers"] })
						queryClient.resetQueries({ queryKey: ["fetch-faction"] })
					},
				},
			)
		} catch (err) {
			console.error("Failed to speed up with bonk", JSON.stringify(err))
		}

		// fin
	}

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered>
			<ModalOverlay />
			<ModalContent
				bg="blacks.500"
				p="2rem"
				borderRadius="1rem"
				minW={{ base: "90vw", md: "70vw" }}
				minH={{ base: "90vh", md: "50vh" }}
			>
				<ModalCloseButton display={{ base: "inline", md: "none" }} />
				<ModalBody>
					<ModalHeader
						image={image ?? ""}
						name={station?.blueprint}
						desc={getBlueprint(station?.blueprint ?? "")?.description}
						level={station?.level}
					/>
					<Grid templateColumns="repeat(3, 1fr)" mt="4rem">
						<VStack gap="2rem">
							<Tip
								isHidden={!timer}
								label={`${isClaimable ? "Claim before starting again" : ""} ${
									!isClaimable
										? "Wait for build to finish and then claim to start again."
										: ""
								}`}
							>
								<Button isDisabled={!!timer} onClick={startStationProcess}>
									Start Build
								</Button>
							</Tip>
							<ResourceContainer
								type="resources"
								isDisabled={progress === 100}
								resources={
									stationBlueprint?.inputs.map((input) => ({
										name: input.resource,
										amount: input.amount,
										balance:
											resourcesInWallet?.find((e) => e.name === input.resource)?.value ??
											"",
									})) ?? []
								}
							/>
						</VStack>
						<Flex
							direction="column"
							justifyContent="center"
							alignItems="center"
							mt="4rem"
							onMouseOver={over}
							onMouseOut={out}
						>
							{timer && !isClaimable && (
								<>
									<Slider
										focusThumbOnChange={false}
										value={input}
										onChange={setInput}
										min={0}
										max={count}
										maxW="80%"
										m="1rem auto"
										transition="all 0.25 ease-in-out"
										opacity={onHover ? 1 : 0}
									>
										<SliderTrack>
											<SliderFilledTrack bg="brand.secondary" />
										</SliderTrack>
										<SliderThumb
											fontWeight={700}
											fontSize="1rem"
											w="10rem"
											h="3rem"
											bg="blacks.700"
											textAlign="center"
										>
											{timeAgo(input)}
											<br />
											{formatBalance(
												(Number(BONK_COST_PER_MS_WIPED) * 1e3 * input) / 1e5,
											).toString()}{" "}
											BONK
										</SliderThumb>
									</Slider>
									<Button onClick={speedUpWithBonk} mb="2rem">
										<FaClock style={{ marginRight: "0.5rem" }} /> SPEED UP
									</Button>
								</>
							)}
							{timer && (
								<Progress
									hasStripe={progress === 100 ? false : true}
									value={progress}
									w="100%"
									h="2rem"
									colorScheme={progress === 100 ? "green" : "blue"}
								/>
							)}
							{timer ? (
								<Text>{timeAgo(count)}</Text>
							) : (
								<Text fontWeight={700} fontSize="3rem" textAlign="center">
									Ready for the next build
								</Text>
							)}
						</Flex>
						<VStack gap="2rem">
							<Tip
								isHidden={!timer}
								label={
									count !== 0
										? "Wait for the build to finish before claiming"
										: "Ready to claim!"
								}
							>
								<Button
									onClick={claimStationReward}
									isDisabled={count !== 0 || isLoading || !timer}
								>
									{isLoading ? (
										<HStack>
											<Text>Claiming</Text>
											<Spinner />
										</HStack>
									) : (
										<Text>Claim</Text>
									)}
								</Button>
							</Tip>
							<ResourceContainer
								type={
									stationBlueprint?.unitOutput !== undefined ? "units" : "resources"
								}
								isDisabled={progress !== 100}
								rareDrop={stationBlueprint?.rareDrop}
								stationLevel={station?.level}
								resources={[
									{
										name:
											stationBlueprint?.unitOutput?.[0] ??
											stationBlueprint?.resourceOutput?.[0] ??
											"",
										amount: 1,
										balance:
											walletAssets?.units
												?.filter(
													(unit) =>
														unit.name.toLowerCase() ===
														stationBlueprint?.unitOutput?.[0].toLowerCase(),
												)
												?.length.toString() ?? "0",
									},
								]}
							/>
						</VStack>
					</Grid>
				</ModalBody>
			</ModalContent>
		</Modal>
	)
}

const ModalHeader = ({
	image,
	name,
	desc,
	level,
}: {
	image: string
	name?: string
	desc?: string
	level?: number
}) => {
	const stationCost =
		(STATION_USE_COST_PER_LEVEL * BigInt(level ?? 0)) / BigInt(1e5)
	return (
		<Flex gap="1rem">
			<Image src={image} alt="station" w="15rem" borderRadius="1rem" />

			<VStack alignItems="start">
				<Text
					fontSize="3rem"
					fontWeight="700"
					textTransform="uppercase"
					letterSpacing="1px"
				>
					{name}
				</Text>
				<Text letterSpacing="0.5px" noOfLines={4} textOverflow="ellipsis">
					{desc}
				</Text>
				<Text>
					Station Level: <strong>{level}</strong>
				</Text>
				<Text>
					Station cost to use:{" "}
					<strong>{(stationCost / BigInt(1000)).toString()}K BONK</strong>
				</Text>
			</VStack>
		</Flex>
	)
}
