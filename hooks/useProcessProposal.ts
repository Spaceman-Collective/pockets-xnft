import { useMutation } from "@tanstack/react-query";
import { processProposal as processProposalRequest } from "@/lib/apiClient";
import toast from "react-hot-toast";

import { useQueryClient } from "@tanstack/react-query";

export const useProcessProposal = (
  setIsLoading: (React.Dispatch<React.SetStateAction<boolean>>),
  proposalId?: string,
) => {
  setIsLoading(true);
  const queryClient = useQueryClient();
  const mutation = useMutation(() => processProposalRequest(proposalId!), {
    onSuccess: (data) => {
      toast.success("Proposal processed successfully!");

      queryClient.refetchQueries(["proposalVotes", proposalId]);
      queryClient.refetchQueries({queryKey: ['citizen']});
    },
    onError: (error) => {
      console.error("Error processing the proposal:", error);
      toast.error("Failed to process the proposal!");
    },
  });
  setIsLoading(false);
  return mutation;
};
