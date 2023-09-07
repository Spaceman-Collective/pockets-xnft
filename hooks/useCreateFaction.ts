import { useMutation } from "@tanstack/react-query"
import { PostFactionCreateData, postFactionCreate } from "@/lib/API"
import { Faction } from "@/types/server"

export const useCreateFaction = () => {
	return useMutation<Faction, unknown, PostFactionCreateData>(
		["create-faction"],
		({ factionData, signedTx }) => postFactionCreate(signedTx, factionData),
	)
}
