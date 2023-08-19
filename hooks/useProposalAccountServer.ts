import { useQuery, QueryFunctionContext } from "@tanstack/react-query";
import { fetchProposalAccount } from "@/lib/apiClient";
import { Connection } from "@solana/web3.js";

export const useProposalAccountServer = (id: string) => {
  return useQuery(['proposalAccount', id], () => fetchProposalAccount(id));
};