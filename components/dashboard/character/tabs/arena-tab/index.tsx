import { PanelContainer } from "@/components/layout"
import { colors } from "@/styles/defaultTheme"
import { BellIcon, SearchIcon } from "@chakra-ui/icons"
import {
	Box,
	Button,
	Flex,
	Grid,
	GridItem,
	Image,
	Input,
	Select,
	Spacer,
	Text,
} from "@chakra-ui/react"
import React, { useState, FormEvent, FC } from "react"

import { combatSkillKeys } from "../../constants"
import { Character, Faction } from "@/types/server"

import { useFaction } from "@/hooks/useFaction"

export const ArenaTab: FC<{
	currentCharacter: Character
	allFactions: Faction[]
}> = ({ currentCharacter, allFactions }) => {
	const [factionId, setFactionId] = useState<string>("")
	const [factionSelected, setFactionSelected] = useState<boolean>(false)
	const [search, setSearch] = useState<string>("")
	// Remove user's faction from the list of all factions
	const allFactionsExceptUser = allFactions.filter(
		(faction) => faction.id !== currentCharacter?.faction?.id ?? "",
	)

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
			>
				<option defaultChecked value="default" disabled selected>
					SELECT A FACTION
				</option>
				{allFactionsExceptUser.map((faction) => (
					<option key={faction.id} value={faction.id}>
						{faction.name}
					</option>
				))}
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
							<Opponent key={citizen.mint} enabled={true} citizen={citizen} />
					  ))}

				{filteredCitizens?.length === 0 && (
					<Text
						fontSize="1.75rem"
						lineHeight="1.75rem"
						fontWeight="600"
						color="brand.tertiary"
						textAlign="center"
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
		>
			<Input
				_placeholder={{
					color: "brand.tertiary",
				}}
				onChange={handleSearch}
				value={search}
				pointerEvents={disabled ? "none" : "auto"}
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
			<SearchIcon
				color="brand.tertiary"
				fontSize="1.75rem"
				marginRight="2rem"
			/>
		</Flex>
	)
}

const Opponent: FC<{
	enabled: boolean
	citizen: Character
}> = ({ enabled, citizen }) => {
	const combatLevel = combatSkillKeys.reduce(
		(acc, key) =>
			acc + citizen.skills[key.charAt(0).toUpperCase() + key.slice(1)] || 0,
		0,
	)

	const hasUnits = citizen.army.length

	return (
		<Flex
			w="100%"
			bgColor="blacks.500"
			borderRadius="0.5rem"
			p="1.75rem"
			_notLast={{ marginBottom: "2rem" }}
			pos="relative"
		>
			{hasUnits ? null : (
				<Text
					fontSize="2rem"
					fontWeight="700"
					position="absolute"
					width="100%"
					height="calc(100% - 2rem)"
					textAlign="center"
					display="flex"
					alignItems="center"
					justifyContent="center"
					zIndex={100}
					color="brand.secondary"
				>
					NO UNITS EQUIPPED
				</Text>
			)}
			<Flex w="100%" opacity={hasUnits ? 1 : 0.25}>
				<Flex
					flex="0 0 auto"
					bgColor="brand.tertiary"
					borderRadius="0.5rem"
					w="12rem"
					h="12rem"
					p="1rem"
					bgImage={citizen.image}
					bgSize="cover"
					bgPos="center"
				>
					<Box
						backgroundColor="brand.quaternary"
						width="2.75rem"
						height="2.75rem"
						borderRadius="0.25rem"
						justifyContent="center"
						alignItems="center"
					>
						<Text
							fontSize="1.75rem"
							fontWeight="700"
							display="block"
							textAlign="center"
							alignSelf="center"
							color="blacks.500"
						>
							{combatLevel}
						</Text>
					</Box>
				</Flex>
				<Flex p="0 1.75rem" flexDirection="column" w="100%" flex="1 1 auto">
					<Text
						w="100%"
						paddingBottom="1.75rem"
						fontSize="2rem"
						lineHeight="2rem"
						fontWeight="700"
						color="brand.secondary"
						textTransform="uppercase"
					>
						{citizen.name}
					</Text>
					<Grid templateColumns="repeat(8, 0fr)" gap="1rem">
						{Array.from({ length: 16 }, (_, i) => (
							<GridItem
								key={i}
								bgColor="blacks.400"
								h="3.5rem"
								w="3.5rem"
								borderRadius="0.25rem"
							/>
						))}
					</Grid>
				</Flex>

				<Flex
					flexDirection="column"
					flex="0 0 auto"
					justifyContent="space-between"
					alignItems="flex-end"
				>
					<Flex
						flexDirection="row"
						alignItems="center"
						justifyContent="space-between"
						cursor="pointer"
						opacity="0.75"
						transition="0.1s ease"
						_hover={{
							opacity: 1,
						}}
					>
						<Text
							textTransform="uppercase"
							fontSize="1.25rem"
							fontWeight="600"
							color="brand.secondary"
							paddingRight="1.5rem"
							textAlign="right"
						>
							Battle <br />
							History
						</Text>
						<Image
							src={"/assets/arena/helmet.svg"}
							w="4rem"
							h="4rem"
							alt="helmet"
							color="blue"
							transform="scaleX(-1)" // Flip around the Y axis
						/>
					</Flex>

					<Button
						variant={enabled ? "solid" : "transparent"}
						border={
							enabled
								? `0.25rem solid ${colors.blacks[700]}`
								: "0.25rem solid #ffffff"
						}
						_hover={{
							border: enabled
								? `0.25rem solid ${colors.blacks[600]}`
								: "0.25rem solid #ffffff",
							bgColor: enabled ? colors.blacks[600] : "",
						}}
						width="100%"
						p="1rem 3.5rem"
						fontSize="1.5rem"
						color={enabled ? "" : "#ffffff"}
						disabled={!enabled}
					>
						{enabled ? "Battle" : "04:52:31"}
					</Button>
				</Flex>
			</Flex>
		</Flex>
	)
}
