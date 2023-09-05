import { useMutation } from "@tanstack/react-query"
import { postFactionJoin } from "@/lib/API"

export const useJoinFaction = () => {
	return useMutation(["join-faction"], postFactionJoin)
}
