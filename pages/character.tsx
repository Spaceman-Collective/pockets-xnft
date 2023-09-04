import Head from "next/head"
import { Flex, Grid } from "@chakra-ui/react"

import {
	CharacterList,
	DashboardInfo,
	DashboardMenu,
} from "@/components/dashboard"
import { CharacterTabs } from "@/components/dashboard/character/tabs"
import {
	DashboardContainer,
	DashboardInfoContainer,
	DashboardMenuContainer,
	SectionContainer,
} from "@/components/layout/containers.styled"
import { NavBar } from "@/components/nav"

export default function CharacterPage() {
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
					<Flex m="0 auto" flexDir="row">
						<CharacterList />
						<SectionContainer>
							<CharacterTabs />
						</SectionContainer>
					</Flex>
				</DashboardContainer>
			</Grid>
		</>
	)
}
