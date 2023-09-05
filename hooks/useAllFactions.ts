import { useQuery } from "@tanstack/react-query"
import { getFactions, getLeaderboard } from "@/lib/API"

export const useAllFactions = () => {
	return useQuery(["fetch-factions"], getFactions)
}
export const useGetLeaderboard = () => {
	return useQuery(["fetch-leaderboard"], getLeaderboard)
}
