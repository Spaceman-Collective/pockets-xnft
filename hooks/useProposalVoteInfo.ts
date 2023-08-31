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
  getProposalAccount,
} from "@/lib/solanaClient";
import { Connection, PublicKey } from "@solana/web3.js";
import { useSelectedCharacter } from "./useSelectedCharacter";

type ProposalVoteInfo = {
  voteAccountExists: boolean;
  totalVoteAmount: string;
  personalVoteAmount: string;
};

export const useProposalVoteInfo = (
  proposalId: string | undefined,
  connection: Connection
): { data: ProposalVoteInfo; isLoading: boolean } => {
  const [selectedCharacter] = useSelectedCharacter();

  const defaultQueryResult: ProposalVoteInfo = {
    voteAccountExists: false,
    totalVoteAmount: "NA",
    personalVoteAmount: "NA",
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

      const pA = await getProposalAccount(connection, proposalId);
      console.log('pA: ', pA)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const vA = await getVoteAccount(connection, votePDA);
      console.log('vA: ', vA)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        voteAccountExists: !!vA,
        totalVoteAmount: pA ? pA!.voteAmt.toString() : "0",
        personalVoteAmount: vA ? vA!.voteAmt.toString() : "0",
      };
    }
  );
  return {
    data: queryResult.data || defaultQueryResult,
    isLoading: queryResult.isLoading,
  };
};
