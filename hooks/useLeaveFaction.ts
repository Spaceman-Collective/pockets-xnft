import { useMutation } from "@tanstack/react-query"
import { postFactionLeave } from "@/lib/API"

export const useLeaveFaction = () => {
	return useMutation(["leave-faction"], postFactionLeave)
}
