import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { getAllFactionProposals, getFactionProposals } from "@/lib/API"
import { Proposal } from "@/types/server/Proposal"

export const useAllProposalsByFaction = (
	faction?: string,
): UseQueryResult<
	{
		proposals: Proposal[]
		total: number
	},
	Error
> => {
	return useQuery<
		{
			proposals: Proposal[]
			total: number
		},
		Error
	>(
		["fetch-all-proposals-by-faction", faction],
		() => {
			if (!faction) throw new Error("Faction ID is missing!")
			return getAllFactionProposals(faction)
		},
		{
			enabled: !!faction,
		},
	)
}
