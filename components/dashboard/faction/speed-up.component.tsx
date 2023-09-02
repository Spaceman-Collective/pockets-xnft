import styled from "@emotion/styled"
import {
	Button,
	IconButton,
	Popover,
	PopoverTrigger,
	PopoverContent,
	Slider,
	SliderFilledTrack,
	SliderThumb,
	SliderTrack,
} from "@chakra-ui/react"
import { FaClock } from "react-icons/fa"
import { colors } from "@/styles/defaultTheme"
import { formatBalance, timeAgo } from "@/lib/utils"
import { FC, ReactNode } from "react"
import { BONK_COST_PER_MS_WIPED } from "@/constants"

export const SpeedUpPopover: FC<{
	speedUpWithBonk: () => Promise<void>
	input: number
	setInput: (e: number) => void
	count: number
	children: ReactNode
}> = ({ input, setInput, children, count, speedUpWithBonk }) => {
	return (
		<Popover>
			<PopoverTrigger>{children}</PopoverTrigger>
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
	)
}

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
