import { useMutation } from "@tanstack/react-query";
import { postLeaveFaction } from "@/lib/apiClient";
import { useToast } from './useToast';

export const useLeaveFaction = () => {
  const toast: any = useToast();

  return useMutation(["leave-faction"], async () => {
    try {
      const data = await postLeaveFaction();
      toast.success('Left faction successfully!');
      return data;
    } catch (error) {
      toast.error('Failed to leave faction.');
      throw error;
    }
  });
};
