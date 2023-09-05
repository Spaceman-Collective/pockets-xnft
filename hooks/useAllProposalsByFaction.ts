import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { getFactionProposals } from "@/lib/API"
import { Proposal } from "@/types/server/Proposal"

export const useAllProposalsByFaction = (
	faction?: string,
	skip?: number,
	take?: number,
): UseQueryResult<
	{
		proposals: Proposal[]
		skip: string
		take: string
		total: number
	},
	Error
> => {
	return useQuery<
		{
			proposals: Proposal[]
			skip: string
			take: string
			total: number
		},
		Error
	>(
		["fetch-proposals-by-faction", faction, `${skip}`, `${take}`],
		() => {
			if (!faction) throw new Error("Faction ID is missing!")
			return getFactionProposals(faction, skip!, take!)
		},
		{
			enabled: !!faction,
		},
	)
}
