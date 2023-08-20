import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchFaction, postFactionStationStart } from "@/lib/apiClient";

export const useFaction = ({ factionId }: { factionId: string }) => {
  return useQuery(["fetch-faction", factionId], () =>
    fetchFaction({ factionId }),
  );
};

export const useFactionStationStart = () => {
  return useMutation(["station-start"], postFactionStationStart);
};
