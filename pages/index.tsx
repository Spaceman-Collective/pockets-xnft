import Head from "next/head";
import { NavBar } from "@/components/nav";
import styled from "@emotion/styled";
import { Box, Grid, Text } from "@chakra-ui/react";
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
  Personal,
  CharacterList,
} from "@/components/dashboard";
import { useAssets } from "@/hooks/useCharacters";
import { useSelectedCharacter } from "@/hooks/useSelectedCharacter";
import { useAllWalletAssets } from "@/hooks/useWalletAssets";
import { WalletTabs } from "@/components/dashboard/wallet-page";

export default function Home() {
  const { walletAddress } = useSolana();
  const { data: assets, isLoading: assetsIsLoading } = useAssets(); // chars/nfts

  const [selectedCharacter, setSelectedCharacter] = useSelectedCharacter();

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
              <PersonalSection>
                <CharacterList
                  data={assets?.characters}
                  isLoading={assetsIsLoading}
                  selectedCharacter={selectedCharacter}
                  setSelectedCharacter={setSelectedCharacter}
                />
                <SectionContainer>
                  {/* <Personal /> */}
                  <WalletTabs />
                </SectionContainer>
              </PersonalSection>
            </DashboardContainer>
          </>
        ) : (
          <Text>PLEASE SIGN IN WITH A SOLANA WALLET</Text>
        )}
      </Grid>
    </>
  );
}

const PersonalSection = styled(Box)`
  margin: 0 auto;
  display: flex;
  flex-direction: row;
`;
