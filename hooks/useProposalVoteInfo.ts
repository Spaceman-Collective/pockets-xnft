import {
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  getProposalPDA,
  getCitizenPDA,
  getVotePDA,
  getVoteAccount,
} from "@/lib/solanaClient";
import { Connection, PublicKey } from "@solana/web3.js";
import { useSelectedCharacter } from "./useSelectedCharacter";

type ProposalVoteInfo = {
  voteAccountExists: boolean;
  voteAmount: string;
};

export const useProposalVoteInfo = (
  proposalId: string | undefined,
  connection: Connection
): { data: ProposalVoteInfo; refetch: () => void; isLoading: boolean } => {
  const [selectedCharacter] = useSelectedCharacter();
  const queryClient = useQueryClient();

  const defaultQueryResult: ProposalVoteInfo = {
    voteAccountExists: false,
    voteAmount: "NA",
  };

  const queryResult = useQuery<ProposalVoteInfo, unknown>(
    ["proposalInfo", proposalId, selectedCharacter?.mint],
    async (): Promise<ProposalVoteInfo> => {
      if (!proposalId || !selectedCharacter) {
        return defaultQueryResult;
      }

      const propPDA = getProposalPDA(proposalId);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const citiPDA = getCitizenPDA(new PublicKey(selectedCharacter?.mint));
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const votePDA = getVotePDA(citiPDA, propPDA);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const vA = await getVoteAccount(connection, votePDA);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      queryClient.invalidateQueries([
        "proposalInfo",
        proposalId,
        selectedCharacter?.mint,
      ]);

      return {
        voteAccountExists: !!vA,
        voteAmount: vA ? vA!.voteAmt.toString() : "NA",
      };
    }
  );
  return {
    data: queryResult.data || defaultQueryResult,
    refetch: queryResult.refetch,
    isLoading: queryResult.isLoading,
  };
};
