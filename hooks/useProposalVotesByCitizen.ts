import { useQuery } from "@tanstack/react-query"
import { getAccountsVote } from "@/lib/API"

export const useProposalVotesByCitizen = (
	{ mint, proposalId }: { mint: string | null; proposalId: string },
	isEnabled: boolean,
) => {
	return useQuery(
		["proposal-votes-by-citizen", mint ?? "", proposalId ?? ""],
		() => getAccountsVote(mint!, proposalId),
		{
			enabled: isEnabled,
		},
	)
}
