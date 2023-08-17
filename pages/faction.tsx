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
import { Character } from "@/types/server";
import { useSelectedCharacter } from "@/hooks/useSelectedCharacter";


export default function FactionPage() {
  const { data: allAssetData } = useAssets();
  const { walletAddress } = useSolana();
  const joinFactionDisclosure = useDisclosure();
  const [isInFaction, setIsInFaction] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useSelectedCharacter();

  useEffect(() => {
    setIsInFaction(!!selectedCharacter?.faction)
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
                <CharacterList data={allAssetData?.characters} selectedCharacter={selectedCharacter} setSelectedCharacter={setSelectedCharacter} />
                <SectionContainer>
                  {!selectedCharacter ? (
                    <NoSelectedCharacter />
                  ) : isInFaction ? (
                    <FactionTabs currentCharacter={selectedCharacter!} />
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

const character: Character = {
  name: "Crispin Bonehunter",
  mint: "CppHyx5oQ5vGGTEDk3ii5LtdzmAbdAffrqqip7AWWkdZ",
  collection: "OKB POG",
  image: "https://storage.googleapis.com/fractal-launchpad-public-assets/pogs/okb/assets/collectors/assets/2557.png",
  experience: {
    Strength: { current: 0, threshold: 1000 },
    Fighting: { current: 0, threshold: 1000 },
    Shooting: { current: 0, threshold: 1000 },
    Athlethics: { current: 0, threshold: 1000 },
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
    Athlethics: 1,
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
    Strength: 0
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
    POGRarity: "Rare"
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
    stations: [{
      id: "1",
      faction: "",
      blueprint: "",
      level: "1",
    }],
    lastLooted: "",
    construction: {
      finishedAt: "",
      station: {
        id: "1",
        faction: "",
        blueprint: "",
        level: "1",
      }
    }
  }
};
// export const characterData: Character = {
//   name: "Crispin Bonehunter",
//   mint: "CppHyx5oQ5vGGTEDk3ii5LtdzmAbdAffrqqip7AWWkdZ",
//   collection: "OKB POG",
//   image: "https://storage.googleapis.com/fractal-launchpad-public-assets/pogs/okb/assets/collectors/assets/2557.png",
//   experience: {
//     Strength: { current: 0, threshold: 1000 },
//     Fighting: { current: 0, threshold: 1000 },
//     Shooting: { current: 0, threshold: 1000 },
//     Athlethics: { current: 0, threshold: 1000 },
//     Psionics: { current: 0, threshold: 1000 },
//     Magic: { current: 0, threshold: 1000 },
//     Electronics: { current: 0, threshold: 1000 },
//     Forestry: { current: 0, threshold: 1000 },
//     Farming: { current: 0, threshold: 1000 },
//     Healing: { current: 0, threshold: 1000 },
//     Manufacturing: { current: 0, threshold: 1000 },
//     Mining: { current: 0, threshold: 1000 },
//   },
//   skills: {
//     Athlethics: 1,
//     Electronics: 0,
//     Farming: 0,
//     Fighting: 1,
//     Forestry: 0,
//     Healing: 1,
//     Magic: 1,
//     Manufacturing: 0,
//     Mining: 1,
//     Psionics: 1,
//     Shooting: 0,
//     Strength: 0
//   },
//   army: [],
//   attributes: {
//     Bear: "Penny",
//     Clothing: "Blue OKB Tank",
//     Eyewear: "Charcoal",
//     FractalRank: 1337,
//     FractalRarity: "Common",
//     GAMESTATAgility: "2",
//     GAMESTATAttack: "4",
//     GAMESTATElement: "Water 3",
//     GAMESTATMass: "3",
//     Headwear: "Jellyfish Pog God Cap",
//     Mask: "Mask",
//     Neckwear: "Yang",
//     OverClothing: "Cloudhaze",
//     POGArt: "POG Bears",
//     POGEnvironment: "Game Stats Circle Midnight Apple",
//     POGMaterial: "Cardboard",
//     POGRarity: "Rare"
//   },
//   // faction: "GqMugi26QUaoLiGHnMAED"

//   faction: {
//     id: "GqMugi26QUaoLiGHnMAED",
//     pubkey: "GqMugi26QUaoLiGHnMAED",
//     creator: "GqMugi26QUaoLiGHnMAED",
//     name: "GqMugi26QUaoLiGHnMAED",
//     image: "GqMugi26QUaoLiGHnMAED",
//     external_link: "GqMugi26QUaoLiGHnMAED",
//     description: "GqMugi26QUaoLiGHnMAED",
//     townhallLevel: 1,
//     stations: [{
//       id: "1",
//       faction: "GqMugi26QUaoLiGHnMAED",
//       blueprint: "GqMugi26QUaoLiGHnMAED",
//       level: "1",
//     }],
//     lastLooted: "GqMugi26QUaoLiGHnMAED",
//     construction: {
//       finishedAt: "GqMugi26QUaoLiGHnMAED",
//       station: {
//         id: "1",
//         faction: "GqMugi26QUaoLiGHnMAED",
//         blueprint: "GqMugi26QUaoLiGHnMAED",
//         level: "1",
//       }
//     }
//   }
// };
