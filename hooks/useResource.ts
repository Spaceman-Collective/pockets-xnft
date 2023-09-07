import { postCharacterResourcesConsume } from "@/lib/API"
import { useMutation } from "@tanstack/react-query"

export const useResourceConsume = () => {
	return useMutation(["resource-consume"], postCharacterResourcesConsume)
}
