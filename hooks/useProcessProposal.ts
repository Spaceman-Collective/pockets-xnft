import { useQuery } from "@tanstack/react-query";
import { processProposal } from "@/lib/apiClient";

export const useFetchProposal = () => {
  return useQuery(['process-proposal'], processProposal);
};