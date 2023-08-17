import {useQuery } from "@tanstack/react-query";
import { fetchFactions } from "@/lib/apiClient";
import { dummyFactions } from "@/test/factions";

export const useFetchAllFactions = () => {
  return useQuery(['fetch-factions'], fetchFactions);
};

export const useFetchAllFactionsDummy = () => {
  return {data: dummyFactions};
}