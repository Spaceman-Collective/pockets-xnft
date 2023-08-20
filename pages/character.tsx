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

export default function CharacterPage() {
  const { data: allAssetData, isLoading: allAssetDataIsLoading } = useAssets();
  const { walletAddress } = useSolana();
  const joinFactionDisclosure = useDisclosure();
  const [isInFaction, setIsInFaction] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useSelectedCharacter();

  useEffect(() => {
    setIsInFaction(!!selectedCharacter?.faction);
  }, [selectedCharacter]);

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
                  <ManageCharacter currentCharacter={selectedCharacter!} />
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
    </>
  );
}

const FactionSection = styled(Box)`
  margin: 0 auto;
  display: flex;
  flex-direction: row;
`;

const character: Character = {
  name: "Crispin Bonehunter",
  mint: "CppHyx5oQ5vGGTEDk3ii5LtdzmAbdAffrqqip7AWWkdZ",
  collection: "OKB POG",
  image:
    "https://storage.googleapis.com/fractal-launchpad-public-assets/pogs/okb/assets/collectors/assets/2557.png",
  experience: {
    Strength: { current: 0, threshold: 1000 },
    Fighting: { current: 0, threshold: 1000 },
    Shooting: { current: 0, threshold: 1000 },
    Athletics: { current: 0, threshold: 1000 },
    Psionics: { current: 0, threshold: 1000 },
    Magic: { current: 0, threshold: 1000 },
    Electronics: { current: 0, threshold: 1000 },
    Forestry: { current: 0, threshold: 1000 },
    Farming: { current: 0, threshold: 1000 },
    Healing: { current: 0, threshold: 1000 },
    Manufacturing: { current: 0, threshold: 1000 },
    Mining: { current: 0, threshold: 1000 },
  },
  skills: {
    Athletics: 1,
    Electronics: 0,
    Farming: 0,
    Fighting: 1,
    Forestry: 0,
    Healing: 1,
    Magic: 1,
    Manufacturing: 0,
    Mining: 1,
    Psionics: 1,
    Shooting: 0,
    Strength: 0,
  },
  army: [],
  attributes: {
    Bear: "Penny",
    Clothing: "Blue OKB Tank",
    Eyewear: "Charcoal",
    FractalRank: 1337,
    FractalRarity: "Common",
    GAMESTATAgility: "2",
    GAMESTATAttack: "4",
    GAMESTATElement: "Water 3",
    GAMESTATMass: "3",
    Headwear: "Jellyfish Pog God Cap",
    Mask: "Mask",
    Neckwear: "Yang",
    OverClothing: "Cloudhaze",
    POGArt: "POG Bears",
    POGEnvironment: "Game Stats Circle Midnight Apple",
    POGMaterial: "Cardboard",
    POGRarity: "Rare",
  },
  // faction: "GqMugi26QUaoLiGHnMAED"

  faction: {
    id: "",
    pubkey: "",
    creator: "",
    name: "",
    image: "",
    external_link: "",
    description: "",
    townhallLevel: 1,
    stations: [
      {
        id: "1",
        faction: "",
        blueprint: "",
        level: "1",
      },
    ],
    lastLooted: "",
    construction: {
      finishedAt: "",
      station: {
        id: "1",
        faction: "",
        blueprint: "",
        level: "1",
      },
    },
  },
};
