import { useMutation } from "@tanstack/react-query"
import { postLeaveFaction } from "@/lib/apiClient"

export const useLeaveFaction = () => {
	return useMutation(["leave-faction"], postLeaveFaction)
}
