import { useQuery } from "@tanstack/react-query";
import { fetchFaction } from "@/lib/apiClient";

export const useFaction = ({ factionId }: { factionId: string }) => {
  return useQuery(["fetch-faction", factionId], () =>
    fetchFaction({ factionId }),
  {
    enabled: !!factionId,
  });
};