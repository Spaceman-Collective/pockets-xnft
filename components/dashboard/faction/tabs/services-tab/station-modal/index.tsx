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
	ModalHeader,
	useDisclosure,
} from "@chakra-ui/react"
import { FC, useContext, useEffect, useState } from "react"
import { useCountdown } from "usehooks-ts"
import { toast } from "react-hot-toast"
import { useCharTimers, useSpeedUpTimer } from "@/hooks/useCharTimers"
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
import { StationModalHeader } from "./header.component"
import { StationModalBody } from "./body.component"
import { MainContext } from "@/contexts/MainContext"

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

	const { selectedCharacter } = useContext(MainContext)
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
	const progress = !!timer
		? ((totalTimeInSeconds - count) / totalTimeInSeconds) * 100
		: 0
	const image = getLocalImage({
		type: "stations",
		name: station?.blueprint ?? "",
	})
	const stationInputs = stationBlueprint?.inputs.map((e) => e.resource)
	const resourcesInWallet = walletAssets?.resources.filter(
		(e: { name: string }) => {
			return stationInputs?.includes(e.name)
		},
	)

	const hasEnoughResources = stationBlueprint?.inputs?.map(
		(e) =>
			resourcesInWallet?.find(
				(walletItem: { name: string }) => walletItem.name === e?.resource,
			)?.value,
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
					queryClient.refetchQueries({ queryKey: ["wallet-assets", walletAddress] })
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
					},
				},
			)
		} catch (err) {
			console.error("Failed to speed up with bonk", JSON.stringify(err))
		}

		// fin
	}

	const sidebarDisclosure = useDisclosure()
	const toggleSidebar = () => {
		if (sidebarDisclosure.isOpen) {
			sidebarDisclosure.onClose()
		} else {
			sidebarDisclosure.onOpen()
		}
	}

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered>
			<ModalOverlay />
			<ModalContent
				bg="blacks.500"
				borderRadius="1rem"
				minW={{ base: "90vw", md: "500px" }}
				minH={{ base: "90vh", md: "50vh" }}
			>
				<ModalBody>
					<StationModalHeader
						image={image ?? ""}
						name={station?.blueprint}
						desc={getBlueprint(station?.blueprint ?? "")?.description}
						level={station?.level}
						stationId={station?.id}
					/>
					<StationModalBody
						hasEnoughResources={!hasEnoughResources?.includes("0")}
						blueprint={station?.blueprint ?? ""}
						resourcesInWallet={resourcesInWallet}
						progress={progress}
						timer={timer}
						isFuture={isFuture}
						isClaimable={isClaimable}
						speedUp={speedUpWithBonk}
						speedUpIsLoading={speedUpIsLoading}
						startBuild={startStationProcess}
						claimReward={claimStationReward}
						claimIsLoading={isLoading}
						count={count}
						input={input}
						setInput={setInput}
						stationLevel={station?.level}
					/>
				</ModalBody>
			</ModalContent>
		</Modal>
	)
}
