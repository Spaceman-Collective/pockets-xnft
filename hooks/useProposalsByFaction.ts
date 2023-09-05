import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { FetchResponse, getFactionProposals } from "@/lib/API"
import { Proposal } from "@/types/server/Proposal"

export const useFetchProposalsByFaction = (
	faction?: string,
	skip?: number,
	take?: number,
): UseQueryResult<FetchResponse, Error> => {
	return useQuery<FetchResponse, Error>(
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
