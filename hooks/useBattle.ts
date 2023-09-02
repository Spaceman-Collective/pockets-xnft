import { getBattleHistory, postBattle } from "@/lib/apiClient"
import { Character } from "@/types/server"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useBattle = () => {
	return useMutation(["battle"], postBattle)
}

export const useBattleHistory = (mint: string, opponents?: Character[]) => {
	return useQuery(
		["battle-history", mint, opponents],
		() =>
			getBattleHistory({
				attacker: mint,
				defenders: opponents ? opponents.map((opponent: any) => opponent.mint) : [],
			}),
		{
			enabled: !!mint,
		},
	)
}
