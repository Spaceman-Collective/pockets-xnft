import { useQuery } from "@tanstack/react-query";
import { fetchProposal } from "@/lib/apiClient";

export const useFetchProposal = () => {
  return useQuery(['fetch-proposal'], fetchProposal);
};