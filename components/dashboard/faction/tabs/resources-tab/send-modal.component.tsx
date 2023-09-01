import { getResource } from "@/constants"
import { useSolana } from "@/hooks/useSolana"
import { getLocalImage, timeout } from "@/lib/utils"
import {
	Text,
	Image,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
	ModalCloseButton,
	ModalHeader,
	ModalFooter,
	Button,
	Slider,
	SliderTrack,
	SliderFilledTrack,
	SliderThumb,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberIncrementStepper,
	NumberDecrementStepper,
	Flex,
	Box,
} from "@chakra-ui/react"
import { useQueryClient } from "@tanstack/react-query"
import { FC, useState } from "react"
import { toast } from "react-hot-toast"

export const ModalSendResource: FC<{
	isOpen: boolean
	onClose: () => void
	selectedResource?: string
	factionPubKey?: string
	factionName?: string
	valueInWallet?: number
}> = ({
	isOpen,
	onClose,
	selectedResource,
	valueInWallet,
	factionPubKey,
	factionName,
}) => {
	const {
		walletAddress,
		buildTransferIx,
		sendTransaction,
		connection,
		signTransaction,
	} = useSolana()
	const [input, setInput] = useState<number>(0)
	const queryClient = useQueryClient()

	const sendResource = async () => {
		if (selectedResource === undefined) return
		if (walletAddress === undefined) return
		if (getResource(selectedResource) === undefined) return
		if (!factionPubKey) return

		const resourceIx = await buildTransferIx({
			walletAddress,
			connection,
			receipientAddress: factionPubKey,
			mint: getResource(selectedResource)?.mint!,
			amount: BigInt(input),
			decimals: 0,
		})

		if (!resourceIx) return
		try {
			await sendTransaction({
				connection,
				ixs: [...resourceIx],
				wallet: walletAddress,
				signTransaction,
			}).then(async (_) => {
				await new Promise((_) =>
					setTimeout(() => {
						queryClient.refetchQueries({
							queryKey: ["wallet-assets", walletAddress],
						})
						queryClient.refetchQueries({
							queryKey: ["fetch-faction"],
						})
						toast.success("Sent to " + factionName)
					}, 1500),
				)
			})
		} catch (err) {
			console.error({ err })
			const parsedErr = JSON.stringify(err)
			toast.error("Failed to send resource" + parsedErr)
		}
	}

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered>
			<ModalOverlay />
			<ModalContent
				bg="blacks.500"
				p="2rem"
				borderRadius="1rem"
				minW="40vw"
				minH="40vh"
			>
				<ModalHeader fontSize="24px" fontWeight="bold" letterSpacing="3px">
					Send Resource
				</ModalHeader>
				<ModalCloseButton display={{ base: "inline", md: "none" }} />
				<ModalBody>
					<Flex justifyContent="space-between">
						<Image
							alt={selectedResource}
							src={getLocalImage({
								type: "resources",
								name: selectedResource ?? "",
							})}
							fallbackSrc="https://via.placeholder.com/150"
							borderRadius="0.5rem"
							w="15rem"
						/>
						<Flex alignSelf="end" w="50%" direction="column">
							<Text alignSelf="end" p="1rem 0">
								You own {valueInWallet}x
							</Text>
							<NumberInputContainer
								input={input}
								setInput={setInput}
								maxValue={valueInWallet ?? 0}
							/>
						</Flex>
					</Flex>
					<Box p="3rem 0">
						<SliderContainer
							input={input}
							setInput={setInput}
							maxValue={valueInWallet ?? 0}
						/>
					</Box>
				</ModalBody>
				<ModalFooter>
					<Box>
						<Text textAlign="end" mb="1rem">
							Send {input}x {selectedResource} <br />
							to faction bank of {factionName}
						</Text>
						<Button
							size="lg"
							p="2rem 3rem"
							borderRadius="1rem"
							onClick={sendResource}
						>
							Send Resource
						</Button>
					</Box>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

const NumberInputContainer: FC<{
	input: number
	setInput: (e: number) => void
	maxValue: number
}> = ({ input, setInput, maxValue }) => {
	return (
		<NumberInput
			defaultValue={1}
			min={0}
			max={maxValue}
			value={input}
			onChange={(e) => setInput(Number(e))}
		>
			<NumberInputField
				border="solid 2px rgba(0,0,0,0.25)"
				fontWeight={700}
				fontSize="4rem"
				color="brand.secondary"
				bg="brand.primary"
				borderRadius="1rem"
				py="1.5rem"
				h="100%"
			/>
			<NumberInputStepper stroke="white">
				<NumberIncrementStepper
					bg="blacks.600"
					fontSize="2rem"
					w="3rem"
					transform="translateX(-1rem)"
					border="none"
					_hover={{ bg: "green.700" }}
				/>
				<NumberDecrementStepper
					bg="blacks.600"
					fontSize="2rem"
					w="3rem"
					transform="translateX(-1rem)"
					border="none"
					_hover={{ bg: "red.700" }}
				/>
			</NumberInputStepper>
		</NumberInput>
	)
}

const SliderContainer: FC<{
	input: number
	setInput: (e: number) => void
	maxValue: number
}> = ({ input, setInput, maxValue }) => {
	return (
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
			<SliderThumb fontWeight={700} fontSize="3rem" boxSize="6rem" bg="blacks.700">
				{input}
			</SliderThumb>
		</Slider>
	)
}
