import Head from "next/head";
import { NavBar } from "@/components/nav";
import styled from "@emotion/styled";
import { Box, Button, Grid, Spinner, Text } from "@chakra-ui/react";
import { colors } from "@/styles/defaultTheme";
import { useAssets } from "@/hooks/useAssets";
import { useRouter } from "next/router";
import useLocalStorage from "use-local-storage";

export default function Home() {
  const router = useRouter();

  const { data, isLoading, isFetching } = useAssets();
  console.log(data, isLoading, isFetching);

  const isNotConnected = data === undefined;

  return (
    <>
      <Head>
        <title>Pocket.gg</title>
        <meta name="description" content="Idle-RPG with your NFTs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      {isFetching && <Spinner />}
      {isNotConnected && (
        <Grid placeItems="center" minH="50vh">
          <Text>Connect your wallet</Text>
        </Grid>
      )}
      {!isFetching && !isNotConnected && (
        <Grid placeItems="center" minH="50vh">
          <Button variant="outline" onClick={() => router.push("/wizard")}>
            Create a Char
          </Button>
        </Grid>
      )}
    </>
  );
}

const WizardContainer = styled(Box)`
  margin: 0 auto;
  padding: 2rem 3rem;
  max-width: 700px;
  border-radius: 0.5rem;
  background-color: ${colors.blacks[500]};
`;

const BubbleBox = styled(Box)`
  border-radius: 1rem;
  width: 95%;
  height: 5rem;
  transition: all 1s ease;
`;
