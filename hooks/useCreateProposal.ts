import { useMutation } from "@tanstack/react-query"
import { postCreateProposal } from "@/lib/apiClient"

export const useCreateProposal = () => {
	return useMutation(["create-proposal"], postCreateProposal)
}
