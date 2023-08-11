import Head from "next/head";
import { Inter } from "next/font/google";
import { Box, Button } from "@chakra-ui/react";
import { useWeb3Auth } from "@/hooks/useWeb3Auth";

const inter = Inter({ subsets: ["latin"] });

//Initialize within your constructor

export default function Home() {
  const { web3auth } = useWeb3Auth();
  return (
    <>
      <Head>
        <title>Pocket.gg</title>
        <meta name="description" content="Idle-RPG with your NFTs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>
        <Button
          onClick={async () => {
            await web3auth?.connect();
          }}
        >
          hi
        </Button>
      </Box>
    </>
  );
}
