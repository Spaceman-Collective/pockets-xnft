import Head from "next/head";
import dynamic from "next/dynamic";
import { NavBar } from "@/components/nav";
import {
  CharGen,
  SelectCollection as Collection,
  SelectNFT as NFT,
} from "@/components/wizard";
import styled from "@emotion/styled";
import { Box } from "@chakra-ui/react";
import { colors } from "@/styles/defaultTheme";
import { useState } from "react";

const ClientHome = dynamic(() => import("../components/home/client.component"));

export default function Home() {
  const [wizardStep, setWizardStep] = useState<number>(2);
  const next = () => setWizardStep(wizardStep + 1);
  const back = () => setWizardStep(wizardStep - 1);
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
        {wizardStep === 0 && <Collection next={next} />}
        {wizardStep === 1 && <NFT back={back} next={next} />}
        {wizardStep === 2 && <CharGen back={back} next={next} />}
      </WizardContainer>
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
