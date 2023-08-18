import { useMutation } from "@tanstack/react-query";
import { postJoinFaction } from "@/lib/apiClient";
import { useToast } from './useToast';

export const useJoinFaction = () => {
  const toast: any = useToast();

  return useMutation(["join-faction"], async () => {
    try {
      const data = await postJoinFaction();
      toast.success('Joined faction successfully!');
      return data;
    } catch (error) {
      toast.error('Failed to join faction.');
      throw error;
    }
  });
};
