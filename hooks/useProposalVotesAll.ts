import { useQuery } from "@tanstack/react-query";
import {
  getProposalPDA,
  getCitizenPDA,
  getVotePDA,
  getVoteAccount,
} from "@/lib/solanaClient";
import { Connection, PublicKey } from "@solana/web3.js";
import { useSelectedCharacter } from "./useSelectedCharacter";
import { useSolana } from "./useSolana";

export const useProposalVotesAll = (proposalIds: string[] | undefined) => {
    const [selectedCharacter] = useSelectedCharacter();
    const { connection } = useSolana();
  
    const defaultQueryResult = {
      data: "NA",
    };

    const fetchVotesForProposal = async (proposalId: string) => {
      const propPDA = getProposalPDA(proposalId);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const citiPDA = getCitizenPDA(new PublicKey(selectedCharacter?.mint!));
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const votePDA = getVotePDA(citiPDA, propPDA);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const vA = await getVoteAccount(connection, votePDA);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return vA ? parseInt(vA.voteAmt.toString(), 10) : 0;
    };

    const queryResults = useQuery(
      ['proposalVotes', proposalIds, selectedCharacter?.mint],
      async () => {
        if (!proposalIds || proposalIds.length === 0) {
          return defaultQueryResult;
        }
        
        const voteAmounts = await Promise.all(proposalIds.map(fetchVotesForProposal));
        const sumVotes = voteAmounts.reduce((acc, curr) => acc + curr, 0);
        
        return sumVotes.toString();
      }
    );
  
    return proposalIds ? queryResults : defaultQueryResult;
};
