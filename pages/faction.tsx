import Head from "next/head";
import styled from "@emotion/styled";
import { NavBar } from "@/components/nav";
import {
  DashboardInfo,
  DashboardMenu,
  Faction,
  CharacterList,
} from "@/components/dashboard";
import { useAssets } from "@/hooks/useAssets";
import {
  DashboardMenuContainer,
  DashboardInfoContainer,
  DashboardContainer,
  SectionContainer,
} from "@/components/Containers.styled";
import {
  Box,
  Grid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useSolana } from "@/hooks/useSolana";
import { FactionModal } from "@/components/dashboard/faction-modal";

export default function FactionPage() {
  const { data: allAssetData } = useAssets();
  const { walletAddress } = useSolana();
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
                  <Tabs isFitted variant="enclosed">
                    <TabList mb="1em">
                      <Tab>Services</Tab>
                      <Tab>Politics</Tab>
                      <Tab>Resources</Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel>
                        <p>one!</p>
                      </TabPanel>
                      <TabPanel>
                        <p>two!</p>
                      </TabPanel>
                      <TabPanel>
                        <p>3!</p>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
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
