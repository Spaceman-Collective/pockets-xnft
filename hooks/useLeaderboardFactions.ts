// TODO: Remove this with real data. useAllFactions
import { useQuery } from "@tanstack/react-query"
import { generateFactionStats } from "@/lib/mockData"

async function fetchLeaderboardFactions(mockFactions: any[]) {
	await new Promise((resolve) => setTimeout(resolve, 1000))
	const leaderboardFactions = generateFactionStats(mockFactions)
	return leaderboardFactions
}

export const useLeaderboardFactions = (mockFactions: any[]) => {
	return useQuery(["leaderboard-factions", mockFactions], () =>
		fetchLeaderboardFactions(mockFactions),
	)
}
