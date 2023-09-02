import { BLUEPRINTS } from "@/types/server"
import {
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
					{BLUEPRINTS.map((e) => {
						return <BlueprintContainer key={e.name} blueprint={e} />
					})}
				</ModalBody>
			</ModalContent>
		</Modal>
	)
}

const BlueprintContainer: FC<{ blueprint: Blueprint }> = ({ blueprint }) => {
	return <Text>{blueprint.name}</Text>
}
