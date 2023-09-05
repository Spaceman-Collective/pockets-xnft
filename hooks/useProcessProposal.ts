import { useMutation } from "@tanstack/react-query"
import { postFactionProposalProcess as processProposalRequest } from "@/lib/API"
import toast from "react-hot-toast"

import { useQueryClient } from "@tanstack/react-query"

export const useProcessProposal = (
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
	proposalId?: string,
) => {
	const queryClient = useQueryClient()

	const mutation = useMutation(() => processProposalRequest(proposalId!), {
		onMutate: () => {
			setIsLoading(true)
		},
		onSuccess: async (data) => {
			console.log("pp: ", data)
			queryClient.refetchQueries(["proposalVotes", proposalId])
			queryClient.refetchQueries(["proposalInfo", proposalId])
			queryClient.refetchQueries({ queryKey: ["citizen"] })
			queryClient.refetchQueries({ queryKey: ["fetch-proposals-by-faction"] })
			await new Promise((resolve) => setTimeout(resolve, 1000))
			toast.success("Proposal processed successfully!")
			setIsLoading(false)
		},
		onError: (error) => {
			toast.error("Failed to process the proposal!")
			console.error("Error processing the proposal:", error)
			setIsLoading(false)
		},
	})

	return mutation
}
