import {useQuery } from "@tanstack/react-query";
import { fetchFactions } from "@/lib/apiClient";
import { dummyFactions } from "@/test/factions";
import { useToast } from './useToast';

export const useFetchAllFactions = () => {
  const toast: any = useToast();

  return useQuery(['fetch-factions'], async () => {
    try {
      const data = await fetchFactions();
      toast.success('Factions fetched successfully!');
      return data;
    } catch (error) {
      toast.error('Failed to fetch factions.');
      throw error;
    }
  });
};

export const useFetchAllFactionsDummy = () => {
  return {data: dummyFactions};
}

