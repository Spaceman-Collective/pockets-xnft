import Head from "next/head";
import { NavBar } from "@/components/nav";
import styled from "@emotion/styled";
import { Box, Button, Grid, Text } from "@chakra-ui/react";
import { colors } from "@/styles/defaultTheme";
import { useRouter } from "next/router";
import { useSolana } from "@/hooks/useSolana";
import { Character } from "@/types/server";
import { timeout } from "@/lib/utils";
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
import { useAssets } from "@/hooks/useAssets";

export default function Home() {
  const router = useRouter();
  const { account } = useSolana();
  const { data: assets } = useAssets()
  console.log({ assets })

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
              <PersonalSection>
                <CharacterList data={assets?.characters} />
                <SectionContainer>
                  <Personal />
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
