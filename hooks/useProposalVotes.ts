import { useQuery } from "@tanstack/react-query";
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

export const useProposalVotes = (proposalId: string | undefined) => {
    const [selectedCharacter] = useSelectedCharacter();
    const { connection } = useSolana();
  
    const defaultQueryResult = {
      data: "NA",
    };
  
    const queryResult = useQuery(
      ['proposalVotes', proposalId, selectedCharacter?.mint],
      async () => {
        if (!proposalId) {
          return defaultQueryResult;
        }
  
        const propPDA = getProposalPDA(proposalId);
        const citiPDA = getCitizenPDA(new PublicKey(selectedCharacter?.mint!));
        const votePDA = getVotePDA(citiPDA, propPDA);
        const vA = await getVoteAccount(connection, votePDA);
  
        if (vA) {
          return vA.voteAmt.toString();
        } else {
          return "0";
        }
      }
    );
  
    return proposalId ? queryResult : defaultQueryResult;
  };
  
  