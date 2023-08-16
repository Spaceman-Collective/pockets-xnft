import Head from "next/head";
import styled from "@emotion/styled";
import { NavBar } from "@/components/nav";
import { DashboardInfo, DashboardMenu, Faction, CharacterList } from "@/components/dashboard";
import { useEffect, useState } from "react";
import { useAssets } from "@/hooks/useAssets";
import {
  DashboardMenuContainer,
  DashboardInfoContainer,
  DashboardContainer,
  SectionContainer,
} from "@/components/Containers.styled";
import { Box, Grid, Text, useDisclosure } from "@chakra-ui/react";
import { useSolana } from "@/hooks/useSolana";
import { FactionModal } from "@/components/dashboard/faction-modal";
import { join } from "path";

export default function FactionPage() {
  const {
    data: allAssetData,
    isLoading: allAssetDataIsLoading,
    refetch,
  } = useAssets();
  const { account } = useSolana();
  const joinFactionDisclosure = useDisclosure();

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
        {account ? (
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
                  <Faction onOpenJoinFaction={joinFactionDisclosure.onOpen} />
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
