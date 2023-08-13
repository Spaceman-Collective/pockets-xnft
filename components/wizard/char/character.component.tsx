import { FC, useEffect, useState } from "react";
import Confetti from "@/components/Confetti";
import { timeout } from "@/lib/utils";
import { Generate } from "./gen.component";
import { Grid, Spinner } from "@chakra-ui/react";

export const CharGen: FC<{ back: () => void; next: () => void }> = ({
  next: nextStep,
  back: backStep,
}) => {
  const [confetti, setConfetti] = useState(false);
  const fireConfetti = async () => {
    if (confetti) return;
    setConfetti(true);
    await timeout(3600);
    setConfetti(false);
  };

  const [isLoading, setIsLoading] = useState<boolean | undefined>();

  return (
    <>
      {isLoading === undefined && (
        <Generate
          confetti={confetti}
          fire={fireConfetti}
          back={backStep}
          next={async () => {
            setIsLoading(true);
            await timeout(3600);
            setIsLoading(false);
            nextStep();
          }}
        />
      )}
      {isLoading && (
        <Grid placeItems="center" gap="1rem" minH="60vh">
          <Spinner h="100" w="100px" />
          <p>Hold Tight!</p>
        </Grid>
      )}
      {confetti && <Confetti canFire={confetti} />}
    </>
  );
};
