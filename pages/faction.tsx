import Head from "next/head"
import styled from "@emotion/styled"
import { NavBar } from "@/components/nav"
import {
	DashboardInfo,
	DashboardMenu,
	CharacterList,
} from "@/components/dashboard"
import { useAssets } from "@/hooks/useCharacters"
import {
	DashboardMenuContainer,
	DashboardInfoContainer,
	DashboardContainer,
	SectionContainer,
} from "@/components/layout/containers.styled"
import { Box, Grid, useDisclosure } from "@chakra-ui/react"
import { FactionModal } from "@/components/dashboard/faction/join-faction-modal"
import {
	NoFaction,
	NoSelectedCharacter,
} from "@/components/dashboard/faction/no-faction.component"
import { FactionTabs } from "@/components/dashboard/faction/tabs"
import { useContext, useEffect, useState } from "react"
import { useSelectedCharacter } from "@/hooks/useSelectedCharacter"
import { MainContext } from "@/contexts/MainContext"

export default function FactionPage() {
	const joinFactionDisclosure = useDisclosure()
	const [isInFaction, setIsInFaction] = useState(true)
	const { selectedCharacter } = useContext(MainContext)

	useEffect(() => {
		setIsInFaction(!!selectedCharacter?.faction)
	}, [selectedCharacter])

	const handleSetFactionStatus = (status: boolean) => {
		setIsInFaction(status)
	}

	useEffect(() => {
		console.log("sc: ", selectedCharacter)
	}, [selectedCharacter])

	return (
		<>
			<Head>
				<title>Pockets</title>
				<meta name="description" content="Idle-RPG with your NFTs" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<NavBar />
			<Grid placeItems="center" minH="50vh">
				<DashboardContainer>
					<DashboardInfoContainer>
						<DashboardInfo />
					</DashboardInfoContainer>
					<DashboardMenuContainer>
						<DashboardMenu />
					</DashboardMenuContainer>
					<FactionSection>
						<CharacterList />
						<SectionContainer>
							{!selectedCharacter ? (
								<NoSelectedCharacter />
							) : isInFaction ? (
								<FactionTabs setFactionStatus={handleSetFactionStatus} />
							) : (
								<NoFaction
									onOpenJoinFaction={joinFactionDisclosure.onOpen}
									setFactionStatus={handleSetFactionStatus}
								/>
							)}
						</SectionContainer>
					</FactionSection>
				</DashboardContainer>
				<FactionModal
					character={selectedCharacter!}
					{...joinFactionDisclosure}
					setFactionStatus={handleSetFactionStatus}
				/>
			</Grid>
		</>
	)
}

const FactionSection = styled(Box)`
	margin: 0 auto;
	display: flex;
	flex-direction: row;
`
