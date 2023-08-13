import { postCharCreate } from "@/lib/apiClient";
import { useMutation } from "@tanstack/react-query";

export const useCreateCharacter = () => {
  return useMutation(["mint-char"], postCharCreate);
};
