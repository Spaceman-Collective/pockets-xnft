import { useMutation } from "@tanstack/react-query";
import { postJoinFaction } from "@/lib/apiClient";

export const useJoinFaction = () => {
  return useMutation(["join-faction"], postJoinFaction);
};
