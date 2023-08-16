import Head from "next/head";
import styled from "@emotion/styled";
import { NavBar } from "@/components/nav";
import {
  DashboardInfo,
  DashboardMenu,
  CharacterList,
} from "@/components/dashboard";
import { useAssets } from "@/hooks/useAssets";
import {
  DashboardMenuContainer,
  DashboardInfoContainer,
  DashboardContainer,
  SectionContainer,
} from "@/components/Containers.styled";
import { Box, Grid, Text, useDisclosure } from "@chakra-ui/react";
import { useSolana } from "@/hooks/useSolana";
import { FactionModal } from "@/components/dashboard/faction/faction-modal";
import { NoFaction } from "@/components/dashboard/faction/no-faction.component";
import { FactionTabs } from "@/components/dashboard/faction/tabs";

export default function FactionPage() {
  const { data: allAssetData } = useAssets();
  const { walletAddress } = useSolana();
  const joinFactionDisclosure = useDisclosure();

  // TODO: replace with api
  const isInFaction = true;

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
                <CharacterList data={allAssetData?.characters} />
                <SectionContainer>
                  {isInFaction ? (
                    <FactionTabs />
                  ) : (
                    <NoFaction
                      onOpenJoinFaction={joinFactionDisclosure.onOpen}
                    />
                  )}
                </SectionContainer>
              </FactionSection>
            </DashboardContainer>
            <FactionModal {...joinFactionDisclosure} />
          </>
        ) : (
          <Text>PLEASE SIGN IN WITH A SOLANA WALLET</Text>
        )}
      </Grid>
    </>
  );
}

const FactionSection = styled(Box)`
  margin: 0 auto;
  display: flex;
  flex-direction: row;
`;
