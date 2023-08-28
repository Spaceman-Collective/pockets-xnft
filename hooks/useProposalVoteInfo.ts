import { useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
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
  proposalId: string | undefined, connection: Connection
): { data: ProposalVoteInfo; refetch: () => void; isLoading: boolean } => {

  const [selectedCharacter] = useSelectedCharacter();
  const queryClient = useQueryClient();

  const defaultQueryResult: ProposalVoteInfo = {
    voteAccountExists: false,
    voteAmount: "NA",
  };

  const queryResult = useQuery<ProposalVoteInfo, unknown>(
    ['proposalInfo', proposalId, selectedCharacter?.mint],
    async (): Promise<ProposalVoteInfo> => {
      if (!proposalId) {
        return defaultQueryResult;
      }

      const propPDA = getProposalPDA(proposalId);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(`propPDA ${proposalId}: `, propPDA);


      const citiPDA = getCitizenPDA(new PublicKey(selectedCharacter?.mint!));
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(`citiPDA ${proposalId}: `, citiPDA);


      const votePDA = getVotePDA(citiPDA, propPDA);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(`votePDA ${proposalId}: `, votePDA);


      console.log(`getVoteAccount connection ${proposalId}: `, connection);
      const vA = await getVoteAccount(connection, votePDA);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      queryClient.invalidateQueries(['proposalInfo', proposalId, selectedCharacter?.mint]);

      console.log(`voteAccount ${proposalId}: `, vA);
      console.log('voteAccountExists: ', !!vA);
      console.log('voteAmount: ', vA!.voteAmt.toString());

      return {
        voteAccountExists: !!vA,
        voteAmount: vA ? vA.voteAmt.toString() : "NA",
      };
    }
  );
  return {
    data: queryResult.data || defaultQueryResult,
    refetch: queryResult.refetch,
    isLoading: queryResult.isLoading
  };
};