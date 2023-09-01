import {
	Button,
	Flex,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Slider,
	SliderFilledTrack,
	SliderThumb,
	SliderTrack,
} from "@chakra-ui/react"
import { FC, useState } from "react"

export const ConsumeButton: FC<{
	isDisabled: boolean
	maxValue?: number
	onClick: (amountToBurn: number) => void
}> = ({ isDisabled, maxValue, onClick }) => {
	const [input, setInput] = useState(0)
	const [focused, setFocused] = useState(false)
	return (
		<>
			<Flex>
				<NumberInput
					onFocus={() => setFocused(true)}
					onBlur={() => setFocused(false)}
					defaultValue={1}
					min={0}
					max={maxValue}
					display={!isDisabled ? "inherit" : "none"}
					value={input}
					onChange={(e) => setInput(Number(e))}
				>
					<NumberInputField
						border="solid 2px rgba(0,0,0,0.25)"
						fontWeight={700}
						fontSize="1.75rem"
						w="8rem"
						color="brand.secondary"
						bg="brand.primary"
						borderRadius="1rem 0 0 1rem"
						h="100%"
					/>
					<NumberInputStepper stroke="white">
						<NumberIncrementStepper
							bg="blacks.600"
							border="none"
							_hover={{ bg: "green.700" }}
						/>
						<NumberDecrementStepper
							bg="blacks.600"
							border="none"
							_hover={{ bg: "red.700" }}
						/>
					</NumberInputStepper>
				</NumberInput>
				<Button
					isDisabled={isDisabled}
					borderRadius="0 1rem 1rem 0"
					bg={!isDisabled ? "blacks.700" : "brand.primary"}
					h="fit-content"
					opacity="0.5"
					transition="all 0.25s ease-in-out"
					_hover={{ opacity: 1 }}
					onClick={() => {
						onClick(input)
					}}
				>
					Consume
				</Button>
			</Flex>
			{focused && (
				<Slider
					focusThumbOnChange={false}
					value={input}
					onChange={setInput}
					min={0}
					max={maxValue}
				>
					<SliderTrack>
						<SliderFilledTrack bg="brand.secondary" />
					</SliderTrack>
					<SliderThumb
						fontWeight={700}
						fontSize="1.5rem"
						boxSize="3rem"
						bg="blacks.700"
					>
						{input}
					</SliderThumb>
				</Slider>
			)}
		</>
	)
}
