import styled from "@emotion/styled"
import { BLUEPRINTS } from "@/types/server"
import {
	Image,
	Text,
	Box,
	Flex,
	Grid,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
	ModalCloseButton,
	HStack,
} from "@chakra-ui/react"
import { FC } from "react"
import { Blueprint } from "../constants"
import { getLocalImage, timeAgo } from "@/lib/utils"
import { Tip } from "@/components/tooltip"
import { GiClockwork } from "react-icons/gi"
import { FaClock } from "react-icons/fa"

export const BuildingInfoModal: FC<{
	isOpen: boolean
	onClose: () => void
}> = ({ isOpen, onClose }) => {
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
					<Box mb="2rem">
						<Text fontSize="3rem" textTransform="uppercase" fontWeight={700}>
							Stations Preview
						</Text>
						<Text>
							Stations convert resources into new resources or units. To build one,
							create a proposal in your factions PROPOSAL tab. Creating a station
							requires the needed building resources to be in your faction&apos;s
							treasury.
						</Text>
					</Box>
					<Flex gap="1rem" flexWrap="wrap">
						{BLUEPRINTS.map((e) => {
							return <BlueprintContainer key={e.name} blueprint={e} />
						})}
					</Flex>
				</ModalBody>
			</ModalContent>
		</Modal>
	)
}

const BlueprintContainer: FC<{ blueprint: Blueprint }> = ({ blueprint }) => {
	return (
		<Box
			bg="blacks.700"
			minW="240px"
			p="1rem"
			borderRadius="1rem"
			transition="all 0.25s ease-in-out"
			_hover={{
				transform: "scale(1.1)",
			}}
		>
			<Flex justifyContent="space-between" alignItems="center">
				<Tip label={blueprint.description} placement="top">
					<Text
						fontWeight={700}
						fontFamily="heading"
						fontSize="2rem"
						w="fit-content"
					>
						{blueprint.name}
					</Text>
				</Tip>
				<HStack>
					<FaClock style={{ opacity: 0.5 }} />
					<Text fontSize="1.25rem" fontWeight={700} textTransform="uppercase">
						{timeAgo(blueprint.timeRequired / 1000)}
					</Text>
				</HStack>
			</Flex>
			<Flex>
				<Image
					src={getLocalImage({ type: "stations", name: blueprint.name })}
					alt={blueprint.name}
					maxW="15rem"
				/>
				<Box p="0 1rem 1rem">
					<Text
						textTransform="uppercase"
						fontSize="1rem"
						letterSpacing="0.5px"
						fontWeight={700}
						mb="0.5rem"
					>
						Converts
					</Text>
					<Flex gap="1rem">
						{blueprint.inputs.map((input) => (
							<ItemImage
								key={input.resource + input.amount}
								name={input.resource}
								amount={input.amount}
							/>
						))}
					</Flex>
					<Text
						textTransform="uppercase"
						fontSize="1rem"
						letterSpacing="0.5px"
						fontWeight={700}
						mb="0.5rem"
					>
						into
					</Text>
					<Flex gap="1rem">
						{blueprint?.resourceOutput?.map((output) => (
							<ItemImage key={output + "outputresource"} name={output} amount={1} />
						))}
						{blueprint?.unitOutput?.map((output) => (
							<ItemImage
								key={output + "outputresource"}
								name={output}
								amount={1}
								isUnit
							/>
						))}

						{blueprint?.rareDrop && (
							<RareDrop placeItems="center" bg="brand.quaternary" borderRadius="1rem">
								<Tip label={"Has a chance to additionally drop " + blueprint.rareDrop}>
									<Box transform="scale(0.7)">
										<ItemImage name={blueprint.rareDrop} amount={1} disableTip />
									</Box>
								</Tip>
							</RareDrop>
						)}
					</Flex>
				</Box>
			</Flex>
		</Box>
	)
}

export const ItemImage: FC<{
	name: string
	amount: number
	isUnit?: boolean
	disableTip?: boolean
}> = ({ name, amount, isUnit, disableTip }) => {
	return (
		<Tip label={`${amount}x ${name}`} isHidden={disableTip}>
			<Box position="relative">
				<Text
					position="absolute"
					bottom="-0.5rem"
					right="-0.5rem"
					bg="brand.primary"
					px="1rem"
					py="0.25rem"
					borderRadius="0.5rem"
					fontSize="1rem"
				>
					{amount}
				</Text>
				<Image
					src={getLocalImage({ type: isUnit ? "units" : "resources", name })}
					alt={name}
					boxSize="5rem"
					borderRadius="0.5rem"
				/>
			</Box>
		</Tip>
	)
}

const RareDrop = styled(Grid)`
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
