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
import { NoFaction, NoSelectedCharacter } from "@/components/dashboard/faction/no-faction.component";
import { FactionTabs } from "@/components/dashboard/faction/tabs";
import { useEffect, useState } from "react";
import { useSelectedCharacter } from "@/hooks/useSelectedCharacter";


export default function FactionPage() {
  const { data: allAssetData } = useAssets();
  const { walletAddress } = useSolana();
  const joinFactionDisclosure = useDisclosure();
  const [isInFaction, setIsInFaction] = useState(true);
  const [selectedCharacter, setSelectedCharacter] = useSelectedCharacter();

  useEffect(() => {
    setIsInFaction(!!selectedCharacter?.faction)
  }, [selectedCharacter]);

  const handleSetFactionStatus = (status: boolean) => {
    setIsInFaction(status);
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
                <CharacterList data={allAssetData?.characters} selectedCharacter={selectedCharacter} setSelectedCharacter={setSelectedCharacter} />
                <SectionContainer>
                  {!selectedCharacter ? (
                    <NoSelectedCharacter />
                  ) : isInFaction ? (
                    <FactionTabs currentCharacter={selectedCharacter!} setFactionStatus={handleSetFactionStatus} />
                  ) : (
                    <NoFaction
                      onOpenJoinFaction={joinFactionDisclosure.onOpen}
                    />
                  )}
                </SectionContainer>
              </FactionSection>
            </DashboardContainer>
            <FactionModal character={selectedCharacter!} {...joinFactionDisclosure} setFactionStatus={handleSetFactionStatus} />
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
