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
} from "@chakra-ui/react"
import { FC } from "react"
import { Blueprint } from "../constants"
import { getLocalImage, timeAgo } from "@/lib/utils"
import { Tip } from "@/components/tooltip"

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
				<Text fontSize="1.25rem" fontWeight={700}>
					{timeAgo(blueprint.timeRequired / 1000)}
				</Text>
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
}> = ({ name, amount, isUnit }) => {
	return (
		<Tip label={`${amount}x ${name}`}>
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
