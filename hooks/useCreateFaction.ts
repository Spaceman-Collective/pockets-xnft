import { useMutation } from "@tanstack/react-query";
import { postCreateFaction } from "@/lib/apiClient";

export const useCreateFaction = () => {
  return useMutation(["create-faction"], postCreateFaction);
};
