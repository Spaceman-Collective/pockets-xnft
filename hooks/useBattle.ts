import { getCharacterBattleHistory, postCharacterBattle } from "@/lib/API"
import { Character } from "@/types/server"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useBattle = () => {
	return useMutation(["battle"], postCharacterBattle)
}

export const useBattleHistory = (mint: string, opponents?: Character[]) => {
	return useQuery(
		["battle-history", mint, opponents],
		() =>
			getCharacterBattleHistory(
				mint,
				opponents ? opponents.map((opponent: any) => opponent.mint) : [],
			),
		{
			enabled: !!mint,
		},
	)
}
