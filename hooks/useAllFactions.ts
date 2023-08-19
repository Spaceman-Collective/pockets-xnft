import {useQuery } from "@tanstack/react-query";
import { fetchFactions } from "@/lib/apiClient";

export const useFetchAllFactions = () => {
  return useQuery(['fetch-factions'], fetchFactions);
};