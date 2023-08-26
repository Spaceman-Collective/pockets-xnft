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
    if (!selectedCharacter?.mint) {
      throw new Error("Character mint is missing");
    }

    const propPDA = getProposalPDA(proposalId);
    const citiPDA = getCitizenPDA(new PublicKey(selectedCharacter.mint));
    const votePDA = getVotePDA(citiPDA, propPDA);
    const vA = await getVoteAccount(connection, votePDA);

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
    },
    {
      enabled: !!proposalIds && proposalIds.length > 0 && !!selectedCharacter?.mint,
    }
  );

  return proposalIds && selectedCharacter?.mint ? queryResults : defaultQueryResult;
};
