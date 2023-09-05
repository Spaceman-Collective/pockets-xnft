import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { getFactionProposals } from "@/lib/API"

export const useFetchProposalsByFaction = (
	faction: string,
	skip: number,
	take: number,
): UseQueryResult => {
	return useQuery(
		["fetch-proposals-by-faction", faction, `${skip}`, `${take}`],
		() => getFactionProposals(faction, skip, take),
	)
}
