import { postCharCreate } from "@/lib/apiClient";
import { useMutation } from "@tanstack/react-query";
import { useToast } from './useToast';

export const useCreateCharacter = () => {
  const toast: any = useToast();

  return useMutation(["mint-char"], async () => {
    try {
      const data = await postCharCreate();
      toast.success('Character created successfully!');
      return data;
    } catch (error) {
      toast.error('Failed to create character.');
      throw error;
    }
  });
};
