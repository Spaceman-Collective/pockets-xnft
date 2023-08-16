import {useQuery } from "@tanstack/react-query";
import { fetchFactions } from "@/lib/apiClient";

export const useFactionsInfo = () => {
  return useQuery(['fetch-factions'], fetchFactions);
};