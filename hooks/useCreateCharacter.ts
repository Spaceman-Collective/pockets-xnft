import { postCharacterCreate } from "@/lib/API"
import { useMutation } from "@tanstack/react-query"

export const useCreateCharacter = () => {
	return useMutation(["mint-char"], postCharacterCreate)
}
