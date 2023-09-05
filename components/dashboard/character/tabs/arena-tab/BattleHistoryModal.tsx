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
import { BattleLogCard } from "./BattleLogCard"
import { combatSkillKeys } from "../../constants"

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
	const oppponentCombatLevel = combatSkillKeys.reduce(
		(acc, key) =>
			acc + opponent.skills[key.charAt(0).toUpperCase() + key.slice(1)] || 0,
		0,
	)
	const characterCombatLevel = combatSkillKeys.reduce(
		(acc, key) =>
			acc + character.skills[key.charAt(0).toUpperCase() + key.slice(1)] || 0,
		0,
	)
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent bg="brand.primary" maxWidth="50%" minW="30rem" p="3rem">
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
											bgColor="blacks.600"
											flexDir="column"
											mt="2rem"
											borderRadius="0.5rem"
										>
											<Flex key={battle.id} p="4rem">
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
														level={
															battle.defender === character.mint
																? oppponentCombatLevel
																: characterCombatLevel
														}
													/>
												</Flex>
												<Flex w="12rem" alignItems="center" flexDirection="column">
													<Text fontWeight="700" pt="13rem">
														v.s.
													</Text>
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
														level={
															battle.defender === character.mint
																? characterCombatLevel
																: oppponentCombatLevel
														}
													/>
												</Flex>
											</Flex>
											<Box>
												{battle.result.rounds.map((round, i) => (
													<Flex
														minH="12rem"
														bgColor="blacks.500"
														borderRadius="0.5rem"
														_notFirst={{
															marginTop: "2rem",
														}}
														mb="2rem"
														key={i}
														m="2rem"
														flexDirection="column"
													>
														<Text
															p="2rem"
															fontWeight="700"
															letterSpacing="0.1rem"
															fontSize="1.5rem"
															opacity="0.5"
														>
															ROUND {i + 1}
														</Text>
														<Flex flexDir="row" justifyContent="space-between">
															<Flex
																m="2rem"
																flex="1"
																minH="10rem"
																gap="2rem"
																justifyContent="flex-end"
															>
																<BattleLogCard
																	value={round.attacker.bonus}
																	text="BONUS"
																	type="bonus"
																/>
																<BattleLogCard
																	value={round.attacker.roll}
																	text="ROLL"
																	type="roll"
																/>
																<BattleLogCard
																	unit={round.attacker.unit}
																	text="UNIT"
																	type="unit"
																/>
															</Flex>
															<Flex
																w="12rem"
																alignItems="center"
																flexDirection="column"
																justifyContent="center"
															>
																<Text fontWeight="700" opacity="0.5">
																	v.s.
																</Text>
															</Flex>
															<Flex
																m="2rem"
																flex="1"
																minH="10rem"
																gap="2rem"
																justifyContent="flex-end"
															>
																<BattleLogCard
																	unit={round.defender.unit}
																	text="UNIT"
																	type="unit"
																/>
																<BattleLogCard
																	value={round.defender.roll}
																	text="ROLL"
																	type="roll"
																/>
																<BattleLogCard
																	value={round.defender.bonus}
																	text="BONUS"
																	type="bonus"
																/>
															</Flex>
														</Flex>
													</Flex>
												))}
											</Box>
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
