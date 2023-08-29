import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getCitizenPDA, getCitizenAccount } from "@/lib/solanaClient";
import { Connection, PublicKey } from "@solana/web3.js";
import toast from "react-hot-toast";

type CitizenAccountInfo = {
  delegatedVotingPower: string; // Assuming BN is serializable as string for React state
  faction: string; // PublicKey serialized as a string
  grantedVotingPower: string;
  maxPledgedVotingPower: string;
  mint: string;
  totalVotingPower: string;
};

export const useCitizen = (
  mint: string,
  connection: Connection
): { data: CitizenAccountInfo; refetch: () => void; isLoading: boolean } => {

  const defaultQueryResult: CitizenAccountInfo = {
    delegatedVotingPower: "0",
    faction: "",
    grantedVotingPower: "0",
    maxPledgedVotingPower: "0",
    mint: "",
    totalVotingPower: "0"
  };

  const queryResult = useQuery<CitizenAccountInfo, unknown>(
    ['citizen', mint],
    async (): Promise<CitizenAccountInfo> => {
      if (!mint) {
        return defaultQueryResult;
      }

      const characterMint = new PublicKey(mint);
      const citizenPDA = getCitizenPDA(characterMint);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('citizen pda: ', citizenPDA);

      const citizenAccount = await getCitizenAccount(connection, citizenPDA);
      console.log('citizen account: ', citizenAccount);

      if (!citizenAccount) {
        console.error('Failed to fetch citizen');
        return defaultQueryResult;
      }

      return {
        delegatedVotingPower: citizenAccount.delegatedVotingPower.toString(),
        faction: citizenAccount.faction!.toString(),
        grantedVotingPower: citizenAccount.grantedVotingPower.toString(),
        maxPledgedVotingPower: citizenAccount.maxPledgedVotingPower.toString(),
        mint: citizenAccount.mint.toString(),
        totalVotingPower: citizenAccount.totalVotingPower.toString()
      };
    }
  );

  return {
    data: queryResult.data || defaultQueryResult,
    refetch: queryResult.refetch,
    isLoading: queryResult.isLoading
  };
};
