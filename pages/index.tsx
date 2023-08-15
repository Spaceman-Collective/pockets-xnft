import Head from "next/head";
import { NavBar } from "@/components/nav";
import styled from "@emotion/styled";
import { Box, Button, Grid, Text } from "@chakra-ui/react";
import { colors } from "@/styles/defaultTheme";
import { useRouter } from "next/router";
import { useSolana } from "@/hooks/useSolana";

export default function Home() {
  const router = useRouter();
  const { account } = useSolana();

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
          <Button variant="outline" onClick={() => router.push("/wizard")}>
            Create a Char
          </Button>
        ) : (
          <Text>PLEASE SIGN IN WITH A SOLANA WALLET</Text>
        )}
      </Grid>
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
