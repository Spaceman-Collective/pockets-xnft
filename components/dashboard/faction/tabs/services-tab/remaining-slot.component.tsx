import { getLocalImage, timeAgo } from "@/lib/utils"
import { FC, useEffect } from "react"
import { StationBox } from "./service-tab.styles"
import { Box, Spinner } from "@chakra-ui/react"
import { CheckmarkIcon, toast } from "react-hot-toast"
import { Tip } from "@/components/tooltip"
import { useCompleteConstruction } from "@/hooks/useFaction"
import { FaHammer } from "react-icons/fa"
import styled from "@emotion/styled"
import { useCountdown } from "usehooks-ts"
import { useQueryClient } from "@tanstack/react-query"

type Construction = {
	blueprint?: string
	stationId?: string
	finished?: string
	started?: string
	stationNewLevel?: number
}

export const RemainingSlot: FC<{
	onClick?: () => void
	factionId?: string
	construction?: Construction
	slots?: [number, number]
}> = ({
	onClick: openBuildingInfoModal,
	factionId,
	construction,
	slots: [remainingSlots, availableSlots] = [0, 0],
}) => {
	const { mutate, isLoading } = useCompleteConstruction()
	const hasConstruction = construction?.blueprint !== undefined

	const blueprint = construction?.blueprint
	const finished = construction?.finished ?? Date.now()
	const isFinished = +finished < Date.now()
	const remainingTime = isFinished ? 0 : +finished - Date.now()
	const img = getLocalImage({
		type: "stations",
		name: blueprint ?? "",
	})

	const isFuture = remainingTime > 0
	const isClaimable = Date.now() > +finished && construction !== undefined

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
		if (hasConstruction) return
		resetCountdown()
	}, [hasConstruction])

	const queryClient = useQueryClient()
	const onClick = () => {
		if (!isFinished || !factionId) return
		mutate(
			{ factionId },
			{
				onSuccess: (_) => {
					queryClient.refetchQueries({ queryKey: ["fetch-faction"] })
					toast.success(
						construction?.blueprint +
							" created! You can now use it to process resources",
					)
				},
				onError: (_) => {
					toast.error("Oops! Did not create a station")
				},
			},
		)
	}

	if (!hasConstruction) {
		return (
			<EmptySlot
				openModal={openBuildingInfoModal}
				remainingSlots={remainingSlots}
				availableSlots={availableSlots}
			/>
		)
	}

	return (
		<Tip
			label={
				isFinished
					? "Station ready! Click to continue"
					: `Remaining Build Time: ${timeAgo(count / 1000)} `
			}
		>
			<StationBox
				key="underconstruction"
				onClick={onClick}
				backgroundImage={img}
				filter={isFinished ? "" : "saturate(0.1)"}
			>
				{isLoading && <Spinner size="lg" m="0 auto" />}
				{!isLoading && isFinished && <CheckmarkIcon />}
				{!isLoading && !isFinished && <AnimatedHammer />}
			</StationBox>
		</Tip>
	)
}

export const EmptySlot: FC<{
	availableSlots: string | number
	remainingSlots: string | number
	openModal?: () => void
}> = ({ availableSlots, remainingSlots, openModal }) => {
	return (
		<Tip
			label={`This slot is available for a station to be built. Townhall Level ${availableSlots}: allows for a total of ${availableSlots} stations. You have ${remainingSlots} available slot${
				+remainingSlots > 1 ? "s" : ""
			} left. Create a proposal in the politics tab to start one.`}
		>
			<Box
				cursor="pointer"
				onClick={openModal}
				bg="brand.primary"
				h="7rem"
				w="7rem"
				borderRadius="1rem"
			/>
		</Tip>
	)
}

const AnimatedHammer = styled(FaHammer)`
	filter: drop-shadow(0 3px 3px rgba(0, 0, 0, 1));
	animation: pulse 5s ease-in-out infinite;

	svg {
		stroke: black;
		stroke-width: 2px;
	}
	@keyframes pulse {
		from {
			transform: scale(1);
		}
		50% {
			transform: scale(2);
		}
		to {
			transform: scale(1);
		}
	}
`
