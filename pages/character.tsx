import Head from "next/head";
import styled from "@emotion/styled";
import { NavBar } from "@/components/nav";
import {
  DashboardInfo,
  DashboardMenu,
  CharacterList,
  ManageCharacter,
} from "@/components/dashboard";
import { useAssets } from "@/hooks/useCharacters";
import {
  DashboardMenuContainer,
  DashboardInfoContainer,
  DashboardContainer,
  SectionContainer,
} from "@/components/Containers.styled";
import { Box, Grid, Text, useDisclosure } from "@chakra-ui/react";
import { useSolana } from "@/hooks/useSolana";
import { FactionModal } from "@/components/dashboard/faction/join-faction-modal";
import { useEffect, useState } from "react";
import { Character } from "@/types/server";
import { useSelectedCharacter } from "@/hooks/useSelectedCharacter";
import { ConsumeSkillModal } from "@/components/dashboard/manage-character/consume-skill-modal";

export default function CharacterPage() {
  const { data: allAssetData, isLoading: allAssetDataIsLoading } = useAssets();
  const { walletAddress } = useSolana();
  const joinFactionDisclosure = useDisclosure();
  const consumeResourceDisclosure = useDisclosure();
  const [isInFaction, setIsInFaction] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useSelectedCharacter();
  const [selectedSkill, setSelectedSkill] = useState<string>("");

  useEffect(() => {
    setIsInFaction(!!selectedCharacter?.faction);
  }, [selectedCharacter]);

  const selectSkill = (skill: string) => {
    setSelectedSkill(skill);
    consumeResourceDisclosure.onOpen();
  };

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
                  <ManageCharacter
                    currentCharacter={allAssetData?.characters?.find(
                      (e) => e.mint === selectedCharacter?.mint,
                    )}
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
          <Text>PLEASE SIGN IN WITH A SOLANA WALLET</Text>
        )}
      </Grid>
      <ConsumeSkillModal skill={selectedSkill} {...consumeResourceDisclosure} />
    </>
  );
}

const FactionSection = styled(Box)`
  margin: 0 auto;
  display: flex;
  flex-direction: row;
`;
