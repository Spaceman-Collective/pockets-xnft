import { useQuery } from "@tanstack/react-query"
import { fetchProposalVotesByCitizen } from "@/lib/apiClient"

export const useProposalVotesByCitizen = (
	{ mint, proposalId }: { mint: string | null; proposalId: string },
	isEnabled: boolean,
) => {
	return useQuery(
		["proposal-votes-by-citizen", mint ?? "", proposalId ?? ""],
		() => fetchProposalVotesByCitizen(mint!, proposalId),
		{
			enabled: isEnabled,
		},
	)
}
