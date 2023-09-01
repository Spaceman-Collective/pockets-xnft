import { useQuery, useQueryClient } from "@tanstack/react-query";
import { delegateVotes } from "@/lib/solanaClient";
import { Connection, PublicKey } from "@solana/web3.js";
import { Character } from "@/types/server";
import { useSelectedCharacter } from "./useSelectedCharacter";
import { useSolana } from "./useSolana";

export const useDelegateVotes = (
  voteAmt: number,
  voteCharacterRecepientMint: string
): boolean => {
  const [selectedCharacter] = useSelectedCharacter();
  const { walletAddress } = useSolana();

  const defaultQueryResult = false;

  const queryResult = useQuery<boolean>(
    [
      "delegateVotes",
      selectedCharacter?.mint,
      walletAddress,
      voteAmt,
      voteCharacterRecepientMint,
    ],
    async () => {
      const voteTransferIx = await delegateVotes(
        new PublicKey(walletAddress!),
        new PublicKey(selectedCharacter?.mint!),
        voteAmt,
        new PublicKey(voteCharacterRecepientMint)
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return !!voteTransferIx;
    },
    {
      enabled:
        selectedCharacter?.mint != undefined &&
        walletAddress != undefined &&
        voteAmt != undefined &&
        voteCharacterRecepientMint != undefined,
    }
  );

  return voteAmt && voteCharacterRecepientMint
    ? queryResult.data ?? defaultQueryResult
    : defaultQueryResult;
};
