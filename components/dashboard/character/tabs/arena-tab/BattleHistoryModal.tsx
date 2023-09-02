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
import { timeSince } from "@/lib/utils"
import { Tip } from "@/components/tooltip"

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
								return (
									<>
										<Text
											fontSize="1.25rem"
											fontWeight="600"
											textTransform="uppercase"
											opacity="0.5"
											pt="2rem"
										>
											Time: {timeSince(battle.time)}
										</Text>

										<Text
											fontSize="1.25rem"
											fontWeight="600"
											textTransform="uppercase"
											opacity="0.5"
										>
											Winner:{" "}
											{battle.winner === character.mint ? character.name : opponent.name}
										</Text>
										<Flex
											key={battle.id}
											p="4rem"
											borderRadius="0.5rem"
											m="3rem 0"
											mt="2rem"
											bgColor="blacks.500"
										>
											<Flex
												flexDir="column"
												flex="1"
												alignItems="flex-end"
												opacity={battle.winner === battle.attacker ? 1 : 0.5}
											>
												<Text
													fontSize="1.5rem"
													lineHeight="1.5rem"
													fontWeight="700"
													textTransform="uppercase"
												>
													Attacker
												</Text>
												<Text fontSize="2rem" lineHeight="2rem" pt="1rem" pb="4rem">
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
												<Box h="1.125rem"></Box>
												{battle.result.rounds.map((round, i) => (
													<Flex
														key={i}
														gap="2rem"
														alignItems="center"
														justifyContent="center"
													>
														<Tip placement="top" label={round.attacker.unit.name}>
															<Box
																bgImage={round.attacker.unit.image}
																bgSize="cover"
																bgPos="center"
																w="8rem"
																h="8rem"
																borderRadius="0.5rem"
															/>
														</Tip>
														<Text fontWeight="700" pt="12rem">
															Roll {round.attacker.roll}
														</Text>
														<Text fontWeight="700" pt="12rem" key={i}>
															Bonus {round.attacker.bonus}
														</Text>
													</Flex>
												))}
											</Flex>
											<Flex w="12rem" alignItems="center" flexDirection="column">
												<Text fontWeight="700" pt="13rem" pb="6rem">
													v.s.
												</Text>
												{battle.result.rounds.map((round, i) => (
													<Text
														fontWeight="700"
														pt="12rem"
														key={i}
														_last={{ paddingBottom: "6rem" }}
													>
														Round {i + 1}
													</Text>
												))}
											</Flex>
											<Flex
												flexDir="column"
												flex="1"
												opacity={battle.winner === battle.defender ? 1 : 0.5}
											>
												<Text
													fontSize="1.5rem"
													lineHeight="1.5rem"
													fontWeight="700"
													textTransform="uppercase"
												>
													Defender
												</Text>
												<Text fontSize="2rem" lineHeight="2rem" pt="1rem" pb="4rem">
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
												<Box h="1.125rem"></Box>
												{battle.result.rounds.map((round, i) => (
													<Flex
														key={i}
														gap="2rem"
														alignItems="center"
														justifyContent="center"
													>
														<Text fontWeight="700" pt="12rem" key={i}>
															Bonus {round.defender.bonus}
														</Text>
														<Text fontWeight="700" pt="12rem">
															Roll {round.defender.roll}
														</Text>

														<Tip placement="top" label={round.defender.unit.name}>
															<Box
																bgImage={round.defender.unit.image}
																bgSize="cover"
																bgPos="center"
																w="8rem"
																h="8rem"
																borderRadius="0.5rem"
															/>
														</Tip>
													</Flex>
												))}
											</Flex>
										</Flex>
									</>
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
