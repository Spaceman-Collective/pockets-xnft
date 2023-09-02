import React from "react"
import {
	Box,
	Button,
	Flex,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
} from "@chakra-ui/react"
import { BattleHistory, Character } from "@/types/server"
import { CharacterImage } from "./CharacterImage"

interface BattleHistoryModalProps {
	opponent: Character
	character: Character
	history: BattleHistory
	isOpen: boolean
	onClose: () => void
}

export const BattleHistoryModal: React.FC<BattleHistoryModalProps> = ({
	opponent,
	character,
	history,
	isOpen,
	onClose,
}) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent bg="brand.primary" maxWidth="30%" minW="30rem" p="3rem">
				<ModalHeader fontSize="3rem" lineHeight="3rem" fontWeight="bold">
					Battle Log
				</ModalHeader>
				<ModalCloseButton p="4rem 5rem" />
				<ModalBody>
					{history.histories.length
						? history.histories.map((battle, i) => {
								console.log(battle)
								return (
									<Flex
										key={battle.id}
										p="4rem"
										borderRadius="0.5rem"
										m="3rem 0"
										bgColor="blacks.500"
									>
										<Flex flexDir="column" flex="1">
											<Text
												fontSize="1.5rem"
												lineHeight="1.5rem"
												fontWeight="700"
												textTransform="uppercase"
											>
												Attacker
											</Text>
											<Text fontSize="2rem" lineHeight="2rem" p="1rem 0">
												{battle.attacker === character.mint
													? character.name
													: opponent.name}
											</Text>
											<CharacterImage
												image={
													battle.attacker === character.mint
														? character.image
														: opponent.image
												}
												level={6}
											/>
										</Flex>
										<Flex
											flexDir="column"
											flex="1"
											textAlign="right"
											alignContent="flex-end"
										>
											<Text
												fontSize="1.5rem"
												lineHeight="1.5rem"
												fontWeight="700"
												textTransform="uppercase"
											>
												Defender
											</Text>
											<Text fontSize="2rem" lineHeight="2rem" p="1rem 0">
												{battle.defender === character.mint
													? character.name
													: opponent.name}
											</Text>
											<CharacterImage
												image={
													battle.defender === character.mint
														? character.image
														: opponent.image
												}
												level={6}
											/>
										</Flex>
									</Flex>
								)
						  })
						: null}
				</ModalBody>
				<ModalFooter>
					<Button colorScheme="blue" mr={3} onClick={onClose}>
						Close
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}
