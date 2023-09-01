import { PanelContainer } from "@/components/layout"
import { useFaction } from "@/hooks/useFaction"
import { Character, Faction } from "@/types/server"
import { BellIcon, SearchIcon } from "@chakra-ui/icons"
import { Box, Flex, Input, Select, Spacer, Text } from "@chakra-ui/react"
import React, { FC, FormEvent, useEffect, useState } from "react"
import { combatSkillKeys } from "../../constants"
import { CitizenEquipment } from "../citizen-equipment.component"

export const ArenaTab: FC<{
	currentCharacter: Character
	allFactions: Faction[]
}> = ({ currentCharacter, allFactions }) => {
	const [factionId, setFactionId] = useState<string>("")
	const [factionSelected, setFactionSelected] = useState<boolean>(false)
	const [search, setSearch] = useState<string>("")

	useEffect(() => {
		setFactionId("")
		setFactionSelected(false)
		setSearch("")
	}, [currentCharacter])

	const { data: factionData, isLoading: factionIsLoading } = useFaction({
		factionId,
	})

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

	const filteredCitizens = factionData?.citizens.filter((citizen) =>
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
					: filteredCitizens?.map((citizen) => (
							<CitizenEquipment
								key={citizen.mint}
								enabled={!!citizen.army.length}
								opponent={true}
								citizen={citizen}
							/>
					  ))}

				{filteredCitizens?.length === 0 && (
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
	const combatLevel = combatSkillKeys.reduce(
		(acc, key) =>
			acc + character.skills[key.charAt(0).toUpperCase() + key.slice(1)] || 0,
		0,
	)

	return (
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
				<Box>
					<BellIcon fontSize="2.5rem" />
				</Box>
			</Flex>
		</Box>
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
