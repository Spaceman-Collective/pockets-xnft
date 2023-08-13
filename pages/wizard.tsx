import Head from "next/head";
import dynamic from "next/dynamic";
import { NavBar } from "@/components/nav";
import {
  Mint,
  SelectCollection as Collection,
  SelectNFT as NFT,
  ReviewMint,
} from "@/components/wizard";
import styled from "@emotion/styled";
import { Box, Grid } from "@chakra-ui/react";
import { colors } from "@/styles/defaultTheme";
import { useState } from "react";
import { useAssets } from "@/hooks/useAssets";
import { NFT as NFTType } from "@/types/server";

export default function Wizard() {
  const [wizardStep, setWizardStep] = useState<number>(1);
  const next = () => setWizardStep(wizardStep + 1);
  const back = () => setWizardStep(wizardStep - 1);
  const [selectedMint, setSelectedMint] = useState<string | undefined>();

  const Bubble = ({ toStep }: { toStep: number }) => (
    <BubbleBox
      onClick={() => setWizardStep(toStep)}
      bg={
        toStep === wizardStep ? "green" : toStep < wizardStep ? "teal" : "grey"
      }
    />
  );

  const { data: allAssetData, isLoading: allAssetDataIsLoading } = useAssets();
  console.log({ selectedMint });

  return (
    <>
      <Head>
        <title>Pocket.gg</title>
        <meta name="description" content="Idle-RPG with your NFTs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <Grid
        templateColumns="repeat(3, 1fr)"
        justifyItems="center"
        maxW="700px"
        m="2rem auto"
      >
        <Bubble toStep={0} />
        <Bubble toStep={1} />
        <Bubble toStep={2} />
      </Grid>
      <WizardContainer>
        {wizardStep === 0 && <Collection next={next} />}
        {wizardStep === 1 && (
          <NFT
            back={back}
            next={next}
            data={allAssetData}
            isLoading={allAssetDataIsLoading}
            select={setSelectedMint}
          />
        )}
        {wizardStep === 2 && <Mint back={back} next={next} />}
        {wizardStep === 3 && <ReviewMint />}
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

const BubbleBox = styled(Box)`
  border-radius: 1rem;
  width: 95%;
  height: 5rem;
  transition: all 1s ease;
`;