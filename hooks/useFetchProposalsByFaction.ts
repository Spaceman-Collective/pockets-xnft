import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { FetchResponse, fetchProposalsByFaction } from "@/lib/apiClient";
import { Proposal } from "@/types/server/Proposal";

export const useFetchProposalsByFaction = (faction: string, skip: number, take: number): UseQueryResult<FetchResponse, Error> => {
  return useQuery<FetchResponse, Error>(
    ['fetch-proposals-by-faction', faction, `${skip}`, `${take}`],
    () => fetchProposalsByFaction(faction, skip, take)
  );
};

