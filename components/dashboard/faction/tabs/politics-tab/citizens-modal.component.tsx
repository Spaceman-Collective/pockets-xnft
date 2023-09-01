import { Frame } from "@/components/wizard/wizard.components"
import { Character } from "@/types/server"
import {
	Text,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
	Grid,
	Flex,
	Box,
	HStack,
} from "@chakra-ui/react"
import { FC } from "react"

export const CitizenModal: FC<{
	citizens: Character[]
	onClose: () => void
	isOpen: boolean
}> = ({ citizens, onClose, isOpen }) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent
				p="1rem"
				minW={{ base: "95%", sm: "600px" }}
				minH="600px"
				maxH="800px"
				bg="blacks.500"
				color="brand.secondary"
				borderRadius="1rem"
				overflow="auto"
			>
				<ModalBody>
					<Box mb="2rem">
						<Text fontSize="3rem" fontWeight={700}>
							Citizens
						</Text>
						<Text>Population: {citizens.length}</Text>
						<HStack>
							<Text>Total Skills: </Text>
							<Text
								fontSize="1.5rem"
								fontWeight={700}
								bg="brand.quaternary"
								color="brand.primary"
								w="fit-content"
								p="0 1rem"
								borderRadius="1rem"
								filter="drop-shadow(0 2px 2px rgba(0,0,0,0.25))"
							>
								{citizens?.length > 0 &&
									citizens
										.map((e) => Object.values(e.skills).reduce((a, b) => a + b))
										.reduce((a, b) => a + b)}
							</Text>
						</HStack>
					</Box>
					<Grid templateColumns="repeat(auto-fill, minmax(12rem, 1fr))" gap="1rem">
						{citizens.map((citizen) => (
							<Flex direction="column" key={citizen.mint} position="relative">
								<Text
									noOfLines={1}
									textOverflow="ellipsis"
									fontFamily="header"
									fontSize="2.25rem"
								>
									{citizen.name.split(" ")[0]}
								</Text>
								<Text noOfLines={1} textOverflow="ellipsis" fontFamily="header">
									{citizen.name.split(" ")[1]}
								</Text>
								<Frame img={citizen.image} />

								<Text
									position="absolute"
									bottom="-0.5rem"
									left="-0.5rem"
									fontSize="1.5rem"
									fontWeight={700}
									bg="brand.quaternary"
									color="brand.primary"
									w="fit-content"
									p="0 1rem"
									borderRadius="1rem"
									filter="drop-shadow(0 2px 2px rgba(0,0,0,0.25))"
								>
									{Object.values(citizen.skills).reduce((a, b) => a + b)}
								</Text>
							</Flex>
						))}
					</Grid>
				</ModalBody>
			</ModalContent>
		</Modal>
	)
}
