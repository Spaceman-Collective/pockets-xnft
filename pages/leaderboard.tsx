import Head from "next/head";
import { NavBar } from "@/components/nav";
import styled from "@emotion/styled";
import { Box, Grid, HStack, Text, VStack } from "@chakra-ui/react";
import { useSolana } from "@/hooks/useSolana";
import {
  DashboardMenuContainer,
  DashboardInfoContainer,
  DashboardContainer,
  SectionContainer,
} from "@/components/Containers.styled";
import {
  DashboardInfo,
  DashboardMenu,
  CharacterList,
} from "@/components/dashboard";
import { useAssets } from "@/hooks/useCharacters";
import { useSelectedCharacter } from "@/hooks/useSelectedCharacter";
import { WalletTabs } from "@/components/dashboard/wallet-page";
import { colors } from "@/styles/defaultTheme";
import { Faction } from "@/types/server/Faction";
import { useLeaderboardFactions } from "@/hooks/useLeaderboardFactions";


interface LeaderboardProps {
  factions: Faction[];
}

export default function Home() {
  const { walletAddress } = useSolana();
  const { data: assets, isLoading: assetsIsLoading } = useAssets(); // chars/nfts
  const leaderboardFactionsQuery = useLeaderboardFactions();

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
              <LeaderboardContainer>
              <LeaderboardContainer>
            {leaderboardFactionsQuery.isSuccess && (
              <Leaderboard factions={leaderboardFactionsQuery.data || []} />
            )}
          </LeaderboardContainer>
              </LeaderboardContainer>
            </DashboardContainer>
          </>
        ) : (
          <Text>PLEASE SIGN IN WITH A SOLANA WALLET</Text>
        )}
      </Grid>
    </>
  );
}

const Leaderboard: React.FC<LeaderboardProps> = ({ factions }) => {
  return (
    <VStack align="stretch" spacing={4}>
      {factions.map((faction) => (
        <HStack key={faction.id} spacing={4} align="center">
          <Image src={faction.image} boxSize="50px" rounded="full" />
          <Text>{faction.name}</Text>
          <Text>
            <strong>Favor Points:</strong> {faction.favorPoints}
          </Text>
          <Text>
            <strong>Dom Wins(points):</strong> {faction.domWins}
          </Text>
          <Text>
            <strong>Wealth Points:</strong> {faction.wealthPoints}
          </Text>
          <Text>
            <strong>Knowledge Points:</strong> {faction.knowledgePoints}
          </Text>
        </HStack>
      ))}
    </VStack>
  );
};

export const LeaderboardContainer = styled(Box)`
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  padding: 3rem;
  width: 100%;
  height: 72rem;
  border-radius: 0.5rem;
  background-color: ${colors.brand.primary};
`;
