import { useQuery } from "@tanstack/react-query";
import { fetchProposalsByFaction } from "@/lib/apiClient";

export const useFetchProposalsByFaction = () => {
  return useQuery(['fetch-proposals-by-faction'], fetchProposalsByFaction);
};