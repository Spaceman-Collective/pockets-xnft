import styled from "@emotion/styled"
import { Box, Flex, Grid, Spacer, Text, VStack } from "@chakra-ui/react"
import { colors } from "@/styles/defaultTheme"
import { useGetLeaderboard } from "@/hooks/useAllFactions"
import { LeaderboardItem } from "./faction-leaderboard-bar.component"
import { useEffect, useState } from "react"
import { Tip } from "../tooltip"
import { usePrizePool } from "@/hooks/useWalletAssets"
import { Leaderboard } from "@/types/client/Leaderboard"

/**
 * Leaderboard
 * @returns
 */
export const LeaderboardList = () => {
	//const handleFilter = (e: any) => console.info(e);
	const { data: prizePool } = usePrizePool()
	const { data } = useGetLeaderboard()
	const [factions, setFactions] = useState(
		(data?.find((c) => c.condition === "knowledge")?.factions ||
			[]) as Leaderboard["factions"][],
	)

	useEffect(() => {
		setFactions(
			(data?.find((c) => c.condition == "domination")?.factions ||
				[]) as Leaderboard["factions"][],
		)
	}, [data])

	const selectTab = (tab: string) => {
		if (tab == "domination") {
			setFactions(
				(data?.find((c) => c.condition == "domination")?.factions ||
					[]) as Leaderboard["factions"][],
			)
		} else if (tab == "knowledge") {
			setFactions(
				(data?.find((c) => c.condition == "knowledge")?.factions ||
					[]) as Leaderboard["factions"][],
			)
		} else if (tab == "wealth") {
			setFactions(
				(data?.find((c) => c.condition == "wealth")?.factions ||
					[]) as Leaderboard["factions"][],
			)
		}
	}

	return (
		<Flex
			m="0 auto"
			display="flex"
			flexDir="column"
			p="3rem"
			w="100%"
			borderRadius="0.5rem"
			bgColor="brand.primary"
		>
			<Flex justifyContent="space-between" alignItems="center">
				<Text textTransform="uppercase" fontSize="3rem" fontWeight="800" mb="3px">
					LEADERBOARD
				</Text>
				<Tip label="For a chance to win this prize, join and participate in a faction!">
					<Text
						fontSize="2rem"
						lineHeight="2rem"
						fontWeight="700"
						fontFamily="heading"
					>
						BONK Prize Pool: {prizePool}
					</Text>
				</Tip>
			</Flex>

			<Grid templateColumns="2fr 3fr" display={{ base: "none", sm: "grid" }}>
				<Spacer />
				<Flex justifyContent="space-between" my="1.5rem" opacity="0.5">
					<Tip
						label={`Domination is how many battles a faction's citizens have collectively won together.`}
						placement="top"
					>
						<Label onClick={() => selectTab("domination")}>Domination</Label>
					</Tip>

					<Tip
						label={`Wealth is how many resources a faction has burned.`}
						placement="top"
					>
						<Label onClick={() => selectTab("wealth")}>Wealth</Label>
					</Tip>

					<Tip
						label={`Knowledge is the total skill level of all the faction's citizens added together.`}
						placement="top"
					>
						<Label onClick={() => selectTab("knowledge")}>Knowledge</Label>
					</Tip>
				</Flex>
			</Grid>
			<VStack align="start" spacing={5} overflowY="auto" h="100%" w="100%">
				{factions?.map((faction) => (
					<LeaderboardItem
						key={faction.faction.id}
						rank={faction.faction.townhallLevel}
						name={faction.faction.name}
						imageUrl={faction.faction.image}
						stats={{
							knowledge: faction.knowledge,
							domWins: faction.domination,
							wealth: faction.wealth,
						}}
					/>
				))}
			</VStack>
		</Flex>
	)
}

const Label = ({ ...props }): JSX.Element => (
	<Text
		cursor="pointer"
		fontSize="1.25rem"
		fontWeight="500"
		textTransform="uppercase"
		transition="all 0.25s ease-in-out"
		_hover={{ transform: "scale(1.1)" }}
		onClick={props.onClick}
	>
		{props.children}
	</Text>
)
