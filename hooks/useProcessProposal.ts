import { useMutation } from "@tanstack/react-query";
import { processProposal as processProposalRequest } from "@/lib/apiClient";
import toast from "react-hot-toast";

const useProcessProposal = (proposalId?: string) => {
  const mutation = useMutation(
    () => processProposalRequest(proposalId!),
    {
      onSuccess: (data) => {
        console.log("Process Proposal Result:", data);
        toast.success("Proposal processed successfully!");
      },
      onError: (error) => {
        console.error("Error processing the proposal:", error);
        toast.error("Failed to process the proposal!");
      }
    }
  );

  return mutation;
};

export default useProcessProposal;
