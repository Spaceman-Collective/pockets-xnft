import { useToast } from './useToast';
import { fetchCharacter } from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";

export const useCharacter = (mint: string | undefined) => {
  const toast: any = useToast();
  return useQuery(
    ["character", mint],
    async () => {
      try {
        if (mint === undefined) throw new Error('No mint provided');
        const data = await fetchCharacter({ mint });
        console.log("calling success")
        toast.success('Character fetched successfully!');
        return data;
      } catch (error) {
        toast.error('Failed to fetch character.');
        throw error;
      }
    },
    {
      enabled: mint !== undefined,
    }
  );
};
