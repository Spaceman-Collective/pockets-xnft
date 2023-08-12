import Head from "next/head";
import dynamic from "next/dynamic";
import { NavBar } from "@/components/nav";
import { SelectCollection } from "@/components/wizard";
import styled from "@emotion/styled";
import { Box } from "@chakra-ui/react";
import { colors } from "@/styles/defaultTheme";

const ClientHome = dynamic(() => import("../components/home/client.component"));

export default function Home() {
  return (
    <>
      <Head>
        <title>Pocket.gg</title>
        <meta name="description" content="Idle-RPG with your NFTs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <WizardContainer>
        <SelectCollection />
      </WizardContainer>
    </>
  );
}

const WizardContainer = styled(Box)`
  margin: 0 auto;
  padding: 2rem 3rem;
  max-width: 700px;
  min-height: 80vh;
  border-radius: 0.5rem;
  background-color: ${colors.blacks[500]};
`;
