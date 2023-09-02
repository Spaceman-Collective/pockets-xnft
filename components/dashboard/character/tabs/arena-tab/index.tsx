import { PanelContainer } from "@/components/layout"
import { useFaction } from "@/hooks/useFaction"
import { BattleHistory, Character, Faction, History } from "@/types/server"
import { BellIcon, SearchIcon } from "@chakra-ui/icons"
import {
	Box,
	Button,
	Flex,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Popover,
	PopoverArrow,
	PopoverBody,
	PopoverCloseButton,
	PopoverContent,
	PopoverHeader,
	PopoverTrigger,
	Select,
	Spacer,
	Text,
	useDisclosure,
} from "@chakra-ui/react"
import React, { FC, FormEvent, useEffect, useState } from "react"
import { combatSkillKeys } from "../../constants"
import { OpponentEquipment } from "./OpponentEquipment"
import { useBattleHistory } from "@/hooks/useBattle"
import { timeSince } from "@/lib/utils"
import { useCharacter } from "@/hooks/useCharacter"
import { fetchCharacter } from "@/lib/apiClient"
import { CharacterImage } from "./CharacterImage"
import { BattleHistoryModal } from "./BattleHistoryModal"

export const ArenaTab: FC<{
	currentCharacter: Character
	allFactions: Faction[]
}> = ({ currentCharacter, allFactions }) => {
	const [factionId, setFactionId] = useState<string>("")
	const [factionSelected, setFactionSelected] = useState<boolean>(false)
	const [search, setSearch] = useState<string>("")
	const { data: factionData, isLoading: factionIsLoading } = useFaction({
		factionId,
	})

	const { data: battleHistory, isLoading: battleHistoryIsLoading } =
		useBattleHistory(currentCharacter.mint, factionData?.citizens || [])

	useEffect(() => {
		setFactionId("")
		setFactionSelected(false)
		setSearch("")
	}, [currentCharacter])

	useEffect(() => {
		if (factionData && factionId) {
		}
	}, [factionData, factionId])

	const onFactionSelectionChange = (e: FormEvent<HTMLSelectElement>) => {
		e.preventDefault()
		setSearch("")
		setFactionSelected(true)
		setFactionId(e.currentTarget.value)
	}

	const handleSearch = (e: FormEvent<HTMLInputElement>) => {
		e.preventDefault()
		setSearch(e.currentTarget.value)
	}

	const opponents = factionData?.citizens.filter((citizen) =>
		search !== ""
			? citizen.name.toLowerCase().includes(search.toLowerCase())
			: true,
	)

	return (
		<PanelContainer
			display="flex"
			flexDirection="column"
			gap="2rem"
			width={"100%"}
		>
			<Header character={currentCharacter} />
			<Select
				onChange={onFactionSelectionChange}
				borderRadius="0.5rem"
				alignItems="center"
				display="block"
				flex="1"
				fontSize="1.75rem"
				lineHeight="1.75rem"
				fontWeight="600"
				outline="none"
				letterSpacing="0"
				borderRight="2.1rem solid transparent"
			>
				<option defaultChecked value="default" disabled selected={!factionSelected}>
					SELECT A FACTION TO BATTLE
				</option>
				{allFactions.map((faction) =>
					faction.id !== currentCharacter?.faction?.id ? (
						<option
							key={faction.id}
							value={faction.id}
							selected={factionId === faction.id && factionSelected}
						>
							{faction.name}
						</option>
					) : null,
				)}
			</Select>
			<SearchBar
				disabled={!factionSelected}
				handleSearch={handleSearch}
				search={search}
			/>
			<Box
				overflowY="auto"
				gap="2rem"
				opacity={factionIsLoading ? 0.25 : 1}
				pointerEvents={factionIsLoading ? "none" : "auto"}
				transition="all 0.1s ease-in-out"
			>
				{factionIsLoading
					? null
					: opponents?.map((opponent) => (
							<OpponentEquipment
								key={opponent.mint}
								enabled={!!opponent.army.length}
								opponent={opponent}
								currentCharacter={currentCharacter}
							/>
					  ))}

				{opponents?.length === 0 && (
					<Text
						fontSize="1.75rem"
						lineHeight="1.75rem"
						fontWeight="600"
						color="brand.tertiary"
						opacity="0.5"
						textAlign="center"
						pt="2rem"
						textTransform="uppercase"
					>
						No Opponents Found
					</Text>
				)}
			</Box>
		</PanelContainer>
	)
}

const Header: FC<{ character: Character }> = ({ character }) => {
	const [viewBattleLog, setViewBattleLog] = useState<{
		history: { histories: History[] }
		opponent?: Character
	}>({
		history: { histories: [] },
	})

	const [opponents, setOpponents] = useState<Character[]>([])

	const { isOpen, onOpen, onClose } = useDisclosure()

	const { data: battleHistory, isLoading: battleHistoryIsLoading } =
		useBattleHistory(character.mint)

	const { data: characterData, isLoading: characterIsLoading } = useCharacter(
		character.mint,
	)

	const allOpponents = []

	useEffect(() => {
		if (battleHistory && battleHistory.histories.length) {
			const opponents = battleHistory.histories.map((history) => {
				if (history.attacker === character.mint) {
					return history.defender
				} else {
					return history.attacker
				}
			})
			const uniqueOpponents = opponents.filter(
				(opponent, i) => opponents.indexOf(opponent) === i,
			)

			uniqueOpponents.forEach(async (opponent) => {
				const { character } = await fetchCharacter({ mint: opponent })
				setOpponents((prev) => [...prev, character!])
				console.log(character)
			})
		}
	}, [battleHistory, character])

	if (characterIsLoading || battleHistoryIsLoading) {
		return null
	}
	const combatLevel = combatSkillKeys.reduce(
		(acc, key) =>
			acc + character.skills[key.charAt(0).toUpperCase() + key.slice(1)] || 0,
		0,
	)

	const handleBattleLogClick = (history: History, opponent: Character) => {
		setViewBattleLog({
			history: { histories: [history] },
			opponent,
		})
		onOpen()
	}

	return (
		<>
			<Box>
				<Flex justifyContent="space-between" alignItems="center">
					<Flex>
						{/* Total Battle Points and Current Combat Level */}
						<Text
							textTransform="uppercase"
							fontSize="1.75rem"
							lineHeight="1.75rem"
							fontWeight="600"
							color="brand.tertiary"
						>
							Total Battle Points:{" "}
							<Text as="span" color="brand.quaternary">
								{character.battlepoints}
							</Text>
						</Text>
						<Spacer width="2rem" />
						<Text
							textTransform="uppercase"
							fontSize="1.75rem"
							lineHeight="1.75rem"
							fontWeight="600"
							color="brand.tertiary"
						>
							Current Combat Level:{" "}
							<Text as="span" color="brand.quaternary">
								{combatLevel}
							</Text>
						</Text>
					</Flex>
					<Popover>
						<PopoverTrigger>
							<Button>
								<BellIcon fontSize="2.5rem" />
							</Button>
						</PopoverTrigger>
						<PopoverContent
							bgColor="blacks.500"
							w="auto"
							border="none"
							borderRadius="0.5rem"
							overflow="hidden"
						>
							<PopoverArrow bgColor="blacks.500" border="none" />
							<PopoverCloseButton p="2rem" />
							<PopoverHeader
								p="2rem"
								border="none"
								textTransform="uppercase"
								fontWeight="700"
								textAlign="left"
								minW="30rem"
								bgColor="blacks.500"
							>
								<Text fontSize="1.75rem" lineHeight="1.75rem">
									Battle history
								</Text>
								<Text
									fontSize="1.25rem"
									lineHeight="1.25rem"
									pt="0.75rem"
									opacity="0.5"
								>
									Number of Battles:{" "}
									{battleHistory && battleHistory.histories.length
										? battleHistory.histories.length
										: "0"}
								</Text>
							</PopoverHeader>
							{battleHistory && battleHistory.histories.length ? (
								<PopoverBody
									m="0"
									p="0"
									maxH="40rem"
									overflow="scroll"
									bgColor="blacks.600"
								>
									{battleHistory.histories.map((item, i) => {
										const characterIsAttacker = item.attacker === character.mint
										const characterIsDefender = item.defender === character.mint
										const opponentIsAttacker = item.attacker !== character.mint
										const opponentIsDefender = item.defender !== character.mint
										console.log(item)
										const opponent = opponents.find(
											(o) =>
												o.mint === (opponentIsAttacker ? item.attacker : item.defender),
										)
										return (
											<Flex
												onClick={() => handleBattleLogClick(item, opponent!)}
												key={i}
												_notLast={{
													borderBottom: "0.1rem solid #ffffff20",
												}}
												_first={{
													borderTop: "0.1rem solid #ffffff20",
												}}
												flexDirection="column"
												cursor="pointer"
												_hover={{
													opacity: 0.5,
												}}
												transition="all 0.1s ease"
												p="1rem 2rem"
											>
												<Flex p="1rem 0" alignItems="center">
													<Box
														w="4rem"
														h="4rem"
														bgColor="blacks.400"
														borderRadius="0.5rem"
														bgImage={
															item.attacker === character.mint
																? character.image
																: opponent?.image
														}
														bgSize="cover"
													/>
													<Text
														fontSize="1.5rem"
														p="0 1rem"
														lineHeight="1.5rem"
														fontWeight="700"
														opacity="0.75"
													>
														v.s.
													</Text>
													<Box
														w="4rem"
														h="4rem"
														bgColor="blacks.400"
														borderRadius="0.5rem"
														bgImage={
															item.defender === character.mint
																? character.image
																: opponent?.image
														}
														bgSize="cover"
													/>
													<Flex
														flex="1"
														height="auto"
														pl="1rem"
														flexDirection="column"
														textAlign="right"
													>
														<Text
															fontSize="1.25rem"
															lineHeight="1.25rem"
															fontWeight="500"
															opacity="0.5"
														>
															Rounds: {item.result.rounds?.length}
														</Text>
														<Box h="1.25rem" />
														<Text
															fontSize="1.25rem"
															lineHeight="1.25rem"
															fontWeight="700"
															opacity="0.75"
															color={item.result.winner === character.mint ? "green" : "red"}
														>
															{item.result.winner === character.mint ? "You won!" : "You lost"}
														</Text>
													</Flex>
												</Flex>
												<Text
													textTransform="uppercase"
													fontSize="1rem"
													lineHeight="1rem"
													fontWeight="700"
													opacity="0.25"
													textAlign="right"
												>
													{timeSince(item.time)}
												</Text>
											</Flex>
										)
									})}
								</PopoverBody>
							) : null}
						</PopoverContent>
					</Popover>
				</Flex>
			</Box>
			{viewBattleLog.opponent && viewBattleLog.history ? (
				<BattleHistoryModal
					isOpen={isOpen}
					onClose={onClose}
					character={character}
					opponent={viewBattleLog.opponent}
					history={viewBattleLog.history}
				/>
			) : null}
		</>
	)
}

const SearchBar: FC<{
	disabled: boolean
	handleSearch: (e: FormEvent<HTMLInputElement>) => void
	search: string
}> = ({ disabled, handleSearch, search }) => {
	return (
		<Flex
			width="100%"
			backgroundColor="blacks.500"
			borderRadius="0.5rem"
			alignItems="center"
			opacity={disabled ? 0.25 : 1}
			cursor={disabled ? "not-allowed" : ""}
		>
			<Input
				pointerEvents={disabled ? "none" : "auto"}
				_placeholder={{
					color: "brand.tertiary",
				}}
				onChange={handleSearch}
				value={search}
				display="block"
				flex="1"
				fontSize="1.75rem"
				lineHeight="1.75rem"
				fontWeight="600"
				placeholder="Search Opponents"
				backgroundColor="transparent"
				outline="none"
				textTransform="uppercase"
				padding="1.75rem"
				color="brand.secondary"
			/>
			<SearchIcon color="brand.tertiary" fontSize="1.75rem" marginRight="2rem" />
		</Flex>
	)
}
