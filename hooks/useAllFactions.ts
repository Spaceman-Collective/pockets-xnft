import {useQuery } from "@tanstack/react-query";
import { fetchFactions } from "@/lib/apiClient";

export const useAllFactions = () => {
  return useQuery(['fetch-factions'], fetchFactions);
};