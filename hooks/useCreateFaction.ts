import { useMutation } from "@tanstack/react-query";
import { postCreateFaction } from "@/lib/apiClient";
import { useToast } from './useToast';

export const useCreateFaction = () => {
  const toast: any = useToast();

  return useMutation(["create-faction"], async () => {
    try {
      const data = await postCreateFaction();
      toast.success('Faction created successfully!');
      return data;
    } catch (error) {
      toast.error('Failed to create faction.');
      throw error;
    }
  });
};
