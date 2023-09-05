import { useMutation } from "@tanstack/react-query"
import { postFactionProposalCreate } from "@/lib/API"

export const useCreateProposal = () => {
	return useMutation(["create-proposal"], postFactionProposalCreate)
}
