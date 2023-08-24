import { useEffect, useState } from "react";
import { useSolana } from "./useSolana";
import { useSelectedCharacter } from "./useSelectedCharacter";
import { getFactionPDA, getFactionAccount } from "@/lib/solanaClient";
import { Connection } from "@solana/web3.js";
import { Character } from "@/types/server";

export const useVoteThreshold = () => {
  const [voteThreshold, setVoteThreshold] = useState<string>("NA");
  const [currentCharacter] = useSelectedCharacter();
  const { connection } = useSolana();

  const getVoteThreshold = async () => {
    if (!currentCharacter?.faction?.id) {
      console.error("Character undefined on vote threshold retrieval");
      return;
    }
    
    const factPDA = getFactionPDA(currentCharacter?.faction?.id);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const fA = await getFactionAccount(connection, factPDA);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (fA) {
      console.log("FA: ", fA);
      setVoteThreshold(fA?.thresholdToPass.toString()!);
    } else {
      console.error("FA does not exist");
      setVoteThreshold("NA");
    }
  };

  useEffect(() => {
    getVoteThreshold().then(() => {
      console.log("Vote threshold: ", voteThreshold);
    });
  }, [currentCharacter?.faction?.id, connection]);

  return voteThreshold;
};
