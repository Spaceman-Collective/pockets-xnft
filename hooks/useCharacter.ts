import { getCharacter } from "@/lib/API"
import { useQuery } from "@tanstack/react-query"

export const useCharacter = (mint: string) => {
	return useQuery(["character", mint], () => getCharacter(mint), {
		enabled: mint !== undefined,
	})
}
