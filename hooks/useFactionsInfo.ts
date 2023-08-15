import { useMutation } from "@tanstack/react-query";
import { fetchFactions } from "@/lib/apiClient";

export const useCreateFaction = () => {
  return useMutation(["fetch-faction"], fetchFactions);
};