import { Faction } from "@/types/server"
import { apiRequest } from "."
import { Leaderboard } from "@/types/client/Leaderboard"

export const getLeaderboard = async () => {
	return apiRequest<Leaderboard[]>("get", "/leaderboard")
}
