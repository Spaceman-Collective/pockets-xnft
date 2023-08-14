import Head from "next/head";
import { NavBar } from "@/components/nav";
import {
  Mint,
  SelectCollection as Collection,
  SelectNFT as NFT,
  ReviewMint,
} from "@/components/wizard";
import { useEffect, useState } from "react";
import { useAssets } from "@/hooks/useAssets";
import { Character } from "@/types/server";
import { timeout } from "@/lib/utils";
import Confetti from "@/components/Confetti";
import { CenteredBoxContainer as WizardContainer } from "@/components/Containers.styled";

export default function Wizard() {
  const [wizardStep, setWizardStep] = useState<number>(1);
  const next = () => setWizardStep(wizardStep + 1);
  const back = () => setWizardStep(wizardStep - 1);
  const [selectedMint, setSelectedMint] = useState<string | undefined>();
  const [reviewMint, setReviewMint] = useState<Character | undefined>();

  const {
    data: allAssetData,
    isLoading: allAssetDataIsLoading,
    refetch,
  } = useAssets();

  const [confetti, setConfetti] = useState(false);
  const fireConfetti = async () => {
    if (confetti) return;
    setConfetti(true);
    await timeout(3600);
    setConfetti(false);
    refetch();
  };

  useEffect(() => {
    if (wizardStep === 1 && !!selectedMint) setWizardStep(2);
  }, [wizardStep, selectedMint]);

  useEffect(() => {
    if (reviewMint) {
      setWizardStep(3);
    }
  }, [reviewMint]);

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
        {wizardStep === 1 && (
          <NFT
            back={back}
            next={next}
            data={allAssetData}
            isLoading={allAssetDataIsLoading}
            select={setSelectedMint}
            setReview={setReviewMint}
          />
        )}
        {wizardStep === 2 && (
          <Mint
            back={() => {
              setSelectedMint(undefined);
              back();
            }}
            next={next}
            setReviewMint={setReviewMint}
            nft={allAssetData?.nfts?.find(
              (record) => record?.mint === selectedMint
            )}
            fireConfetti={fireConfetti}
          />
        )}
        {wizardStep === 3 && (
          <ReviewMint
            data={reviewMint}
            back={() => {
              setSelectedMint(undefined);
              setReviewMint(undefined);
              setWizardStep(1);
            }}
          />
        )}
      </WizardContainer>
      {confetti && <Confetti canFire={confetti} />}
    </>
  );
}
