import { useQuery, QueryFunctionContext } from "@tanstack/react-query";
import { getProposalAccount } from "@/lib/solanaClient";
import { Connection } from "@solana/web3.js";

export const useProposalAccount = (connection: Connection, proposalId: string) => {
  return useQuery(["proposal-account"], 
  (context: QueryFunctionContext<any>) => getProposalAccount(proposalId));
};