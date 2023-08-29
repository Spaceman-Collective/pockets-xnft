import {
	CharacterList,
	DashboardInfo,
	DashboardMenu,
} from "@/components/dashboard"
import { CharacterTabs } from "@/components/dashboard/character/tabs"
import { ConsumeSkillModal } from "@/components/dashboard/character/tabs/skills-tab/consume-skill-modal"
import { FactionModal } from "@/components/dashboard/faction/join-faction-modal"
import {
	DashboardContainer,
	DashboardInfoContainer,
	DashboardMenuContainer,
	SectionContainer,
} from "@/components/layout/containers.styled"
import { NavBar } from "@/components/nav"
import { PleaseSignInContainer } from "@/components/no-wallet.component"
import { useAllFactions } from "@/hooks/useAllFactions"
import { useAssets } from "@/hooks/useCharacters"
import { useSelectedCharacter } from "@/hooks/useSelectedCharacter"
import { useSolana } from "@/hooks/useSolana"
import { Character } from "@/types/server"
import { Box, Grid, Text, useDisclosure } from "@chakra-ui/react"
import styled from "@emotion/styled"
import Head from "next/head"
import { useEffect, useState } from "react"

export default function CharacterPage() {
	const { data: allAssetData, isLoading: allAssetDataIsLoading } = useAssets()
	const { walletAddress } = useSolana()
	const joinFactionDisclosure = useDisclosure()
	const consumeResourceDisclosure = useDisclosure()
	const [_, setIsInFaction] = useState(false)
	const [selectedCharacter, setSelectedCharacter] = useSelectedCharacter()
	const [selectedSkill, setSelectedSkill] = useState<string>("")
	const { data: factionData } = useAllFactions()
	const allFactions = factionData?.factions

	useEffect(() => {
		setIsInFaction(!!selectedCharacter?.faction)
	}, [selectedCharacter])

	const selectSkill = (skill: string) => {
		setSelectedSkill(skill)
		consumeResourceDisclosure.onOpen()
	}

	return (
		<>
			<Head>
				<title>Pockets.gg</title>
				<meta name="description" content="Idle-RPG with your NFTs" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<NavBar />
			<Grid placeItems="center" minH="50vh">
				{walletAddress ? (
					<>
						<DashboardContainer>
							<DashboardInfoContainer>
								<DashboardInfo />
							</DashboardInfoContainer>
							<DashboardMenuContainer>
								<DashboardMenu />
							</DashboardMenuContainer>
							<FactionSection>
								<CharacterList
									data={allAssetData?.characters}
									isLoading={allAssetDataIsLoading}
									selectedCharacter={selectedCharacter}
									setSelectedCharacter={setSelectedCharacter}
								/>
								<SectionContainer>
									<CharacterTabs
										currentCharacter={allAssetData?.characters?.find(
											(e) => e.mint === selectedCharacter?.mint,
										)}
										allFactions={allFactions}
										selectSkill={selectSkill}
									/>
								</SectionContainer>
							</FactionSection>
						</DashboardContainer>
						<FactionModal
							setFactionStatus={() => {}}
							character={selectedCharacter!}
							{...joinFactionDisclosure}
						/>
					</>
				) : (
					<PleaseSignInContainer />
				)}
			</Grid>
			<ConsumeSkillModal skill={selectedSkill} {...consumeResourceDisclosure} />
		</>
	)
}

const FactionSection = styled(Box)`
	margin: 0 auto;
	display: flex;
	flex-direction: row;
`
