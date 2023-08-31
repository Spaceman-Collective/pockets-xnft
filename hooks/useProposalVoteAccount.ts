import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getProposalPDA,
  getCitizenPDA,
  getVotePDA,
  getVoteAccount,
} from "@/lib/solanaClient";
import { Connection, PublicKey } from "@solana/web3.js";
import { Character } from "@/types/server";
import { useSelectedCharacter } from "./useSelectedCharacter";
import { useSolana } from "./useSolana";

export const useProposalVoteAccount = (proposalId: string | undefined): boolean => {
  const [selectedCharacter] = useSelectedCharacter();
  const { connection } = useSolana();

  const queryClient = useQueryClient();

  const defaultQueryResult = false;

  const queryResult = useQuery<boolean>(
    ['proposalVotes', proposalId, selectedCharacter?.mint],
    async () => {
      if (!proposalId) {
        return defaultQueryResult;
      }
      const propPDA = getProposalPDA(proposalId);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const citiPDA = getCitizenPDA(new PublicKey(selectedCharacter?.mint!));
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const votePDA = getVotePDA(citiPDA, propPDA);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const vA = await getVoteAccount(connection, votePDA);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return !!vA;
    }
  );

  return proposalId ? (queryResult.data ?? defaultQueryResult) : defaultQueryResult;
};

  
  