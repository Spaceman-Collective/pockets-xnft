import Head from "next/head"
import { NavBar } from "@/components/nav"
import styled from "@emotion/styled"
import { Box, Grid } from "@chakra-ui/react"
import {
	DashboardMenuContainer,
	DashboardInfoContainer,
	DashboardContainer,
	SectionContainer,
} from "@/components/layout/containers.styled"
import { DashboardInfo, DashboardMenu } from "@/components/dashboard"
import { WalletTabs } from "@/components/dashboard/wallet-page"

export default function WalletPage() {
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
					<PersonalSection>
						<Box m="0 auto">
							<SectionContainer>
								<WalletTabs />
							</SectionContainer>
						</Box>
					</PersonalSection>
				</DashboardContainer>
			</Grid>
		</>
	)
}

const PersonalSection = styled(Box)`
	margin: 0 auto;
	display: flex;
	flex-direction: row;
`
