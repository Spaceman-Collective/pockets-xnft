import Head from "next/head";
import { NavBar } from "@/components/nav";
import { Grid } from "@chakra-ui/react";
import {
  DashboardContainer,
  DashboardInfoContainer,
  DashboardMenuContainer,
} from "@/components/layout/containers.styled";
import { DashboardInfo, DashboardMenu } from "@/components/dashboard";
import { LeaderboardList } from "@/components/leaderboard";

export default function Leaderboard() {
  return (
    <>
      <Head>
        <title>Pockets</title>
        <meta name="description" content="Idle-RPG with your NFTs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <Grid placeItems="center" minH="50vh">
        <DashboardContainer>
          <DashboardInfoContainer>
            <DashboardInfo />
          </DashboardInfoContainer>
          <DashboardMenuContainer>
            <DashboardMenu />
          </DashboardMenuContainer>
          <LeaderboardList />
        </DashboardContainer>
      </Grid>
    </>
  );
}
