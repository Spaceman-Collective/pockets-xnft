import { useQuery } from "@tanstack/react-query";
import { fetchFactions, fetchLeaderboard } from "@/lib/apiClient";

export const useAllFactions = () => {
  return useQuery(["fetch-factions"], fetchFactions);
};

export const useGetLeaderboard = () => {
  return useQuery(["fetch-leaderboard"], fetchLeaderboard);
};
