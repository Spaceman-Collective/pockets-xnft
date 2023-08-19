import { RESOURCE_FIELDS } from "@/types/server/Resources";
import {useQuery } from "@tanstack/react-query";
// import { fetchFactions } from "@/lib/apiClient";

export const useFetchAllResourceFields = () => {
  // return useQuery(['fetch-factions'], fetchFactions);
  return { data: RESOURCE_FIELDS }
};