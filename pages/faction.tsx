import Head from "next/head";
import { NavBar } from "@/components/nav";
import { DashboardInfo, DashboardMenu } from "@/components/dashboard";
import { useEffect, useState } from "react";
import { useAssets } from "@/hooks/useAssets";
import { Character } from "@/types/server";
import { timeout } from "@/lib/utils";
import {
  DashboardMenuContainer,
  DashboardInfoContainer,
} from "@/components/Containers.styled";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";



export default function Faction() {
  const {
    data: allAssetData,
    isLoading: allAssetDataIsLoading,
    refetch,
  } = useAssets();
  const router = useRouter();


  useEffect(() => {}, []);

  return (
    <>
      <Head>
        <title>Pocket.gg</title>
        <meta name="description" content="Idle-RPG with your NFTs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <DashboardInfoContainer>
        <DashboardInfo />
      </DashboardInfoContainer>
      <DashboardMenuContainer>
        <DashboardMenu />
        <Button variant="outline" onClick={() => router.push("/wizard")}>
            Create a Char
          </Button>
      </DashboardMenuContainer>
    </>
  );
}
