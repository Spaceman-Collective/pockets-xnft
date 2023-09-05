import styled from "@emotion/styled"
import {
	Slider,
	SliderFilledTrack,
	SliderThumb,
	SliderTrack,
	HStack,
	Flex,
	Image,
	Button,
	IconButton,
	VStack,
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@chakra-ui/react"
import { Tip } from "@/components/tooltip"
import { formatBalance, getLocalImage, timeAgo } from "@/lib/utils"
import { Label, Value } from "../tab.styles"
import { colors } from "@/styles/defaultTheme"
import { FC, useContext, useEffect, useState } from "react"
import { useCountdown } from "usehooks-ts"
import { useRfHarvest } from "@/hooks/useRf"
import { useSolana } from "@/hooks/useSolana"
import { toast } from "react-hot-toast"
import { useQueryClient } from "@tanstack/react-query"
import { FaClock } from "react-icons/fa"
import { BONK_COST_PER_MS_WIPED, BONK_MINT, SERVER_KEY } from "@/constants"
import { useSpeedUpTimer } from "@/hooks/useCharTimers"
import { MainContext } from "@/contexts/MainContext"

export const ResourceFieldAction: FC<{
	charMint?: string
	rf: { id: string; resource: string; amount: string }
	timer?: {
		character: string
		finished: string
		id: string
		rf?: string
	}
}> = ({ rf, timer, charMint }) => {
	// show harvest button on timer undefined
	const finishedDate = timer?.finished && +timer?.finished
	const finishedTime = typeof finishedDate === "number" ? finishedDate : 0

	const remainingTime = (finishedTime - Date.now()) / 1000
	const isFuture = remainingTime > 0
	const isHarvestable = !isFuture || timer === undefined

	const { selectedCharacter } = useContext(MainContext)
	const [input, setInput] = useState<number>(0)

	const {
		buildMemoIx,
		buildTransferIx,
		encodeTransaction,
		walletAddress,
		connection,
		signTransaction,
	} = useSolana()
	const { mutate } = useRfHarvest()
	const { mutate: speedUp, isLoading: speedUpIsLoading } = useSpeedUpTimer()
	const queryClient = useQueryClient()

	const [count, { startCountdown, stopCountdown, resetCountdown }] =
		useCountdown({
			countStart: isFuture ? Math.floor(remainingTime) + 1 : 10,
			intervalMs: 1000,
		})

	useEffect(() => {
		if (!isHarvestable) return
		startCountdown()
	}, [])

	useEffect(() => {
		if (remainingTime < 0) return
		resetCountdown()
		startCountdown()
	}, [remainingTime])

	const post = async () => {
		if (!charMint) {
			return toast.error("no selected character:" + charMint)
		}
		if (!rf.id) {
			return toast.error("no selected resource field" + rf?.id)
		}

		const payload = {
			mint: charMint,
			timestamp: Date.now().toString(),
			rfs: [rf?.id],
		}
		const ix = buildMemoIx({
			walletAddress: walletAddress ?? "",
			payload,
		})
		let encodedTx
		try {
			encodedTx = await encodeTransaction({
				walletAddress,
				connection,
				signTransaction,
				txInstructions: [ix],
			})
		} catch (err) {
			return toast.error("Wallet Action Failed:" + JSON.stringify(err))
		}

		if (typeof encodedTx !== "string" || encodedTx === undefined) {
			return toast.error("no encoded tx")
		}

		mutate(
			{ signedTx: encodedTx },
			{
				onSuccess: (e) => {
					toast.success("Successful harvest. Check your wallet page.")
					queryClient.refetchQueries({
						queryKey: ["char-timers"],
					})
				},

				onError: (e) => {
					toast.error(JSON.stringify(e))
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
				type: "RF",
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

	return (
		<ResourceActionContainer key={rf.id}>
			<HStack>
				<Tip label={rf.resource}>
					<Image
						width="5rem"
						borderRadius="0.5rem"
						alt={rf.resource}
						src={getLocalImage({
							type: "resources",
							name: rf.resource,
						})}
					/>
				</Tip>
				<VStack alignItems="start">
					<Label>amount:</Label>
					<Value>{rf.amount}</Value>
				</VStack>
			</HStack>
			<HStack gap="1rem">
				{isFuture && <Value>{timeAgo(count)}</Value>}
				{isHarvestable && (
					<Button
						bg="brand.quaternary"
						color="brand.secondary"
						fontSize="1.25rem"
						onClick={post}
					>
						Harvest
					</Button>
				)}
				{!isHarvestable && (
					<Popover>
						<PopoverTrigger>
							<IconButton
								icon={<FaClock />}
								aria-label="Speed up"
								bg={colors.blacks[400]}
								w="3rem" // Adjust the width as needed
								h="3rem" // Adjust the height as needed
								// isDisabled={true}
							/>
						</PopoverTrigger>
						<PopoverContentStyled bg="teal">
							<Slider
								focusThumbOnChange={false}
								value={input}
								onChange={setInput}
								min={0}
								max={count}
								maxW="80%"
								m="1rem auto"
								transition="all 0.25 ease-in-out"
							>
								<SliderTrack>
									<SliderFilledTrack bg="brand.secondary" />
								</SliderTrack>
								<SliderThumb
									display="flex"
									fontWeight={700}
									fontSize="1rem"
									w="10rem"
									h="3rem"
									bg="blacks.700"
									alignItems="center"
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
							<Button onClick={speedUpWithBonk}>Speed UP</Button>
						</PopoverContentStyled>
					</Popover>
				)}
			</HStack>
		</ResourceActionContainer>
	)
}

export const ResourceActionContainer = styled(Flex)`
	background-color: ${colors.blacks[500]};
	width: 100%;
	padding: 1.5rem;
	border-radius: 1rem;
	align-items: center;
	justify-content: space-between;
`

const PopoverContentStyled = styled(PopoverContent)`
	background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
	background-size: 400% 400%;
	animation: gradient 15s ease infinite;

	@keyframes gradient {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}
`
