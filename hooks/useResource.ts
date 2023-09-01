import { postConsumeResource } from "@/lib/apiClient"
import { useMutation } from "@tanstack/react-query"

export const useResourceConsume = () => {
	return useMutation(["resource-consume"], postConsumeResource)
}
