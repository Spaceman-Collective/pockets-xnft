import { useMutation } from "@tanstack/react-query";
import { allocateResourceField } from "@/lib/apiClient";

export const useAllocateResourceField = () => {
  return useMutation(["allocate-rf"], allocateResourceField);
};
