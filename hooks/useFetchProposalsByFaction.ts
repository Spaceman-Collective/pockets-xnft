import { useQuery, QueryFunctionContext } from "@tanstack/react-query";
import { fetchProposalsByFaction } from "@/lib/apiClient";
import { Proposal } from "@/types/Proposal";

export const useFetchProposalsByFaction = (faction: string, skip: number, take: number) => {
  return useQuery(
    ['fetch-proposals-by-faction', faction, `${skip}`, `${take}`],
    (context: QueryFunctionContext<string[]>) => fetchProposalsByFaction(context, faction, skip, take)
  );
};
