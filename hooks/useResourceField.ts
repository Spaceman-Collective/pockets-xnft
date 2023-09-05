import { useQuery } from "@tanstack/react-query"
import { getFactionResourceFields } from "@/lib/API"

export const useResourceField = ({ factionId }: { factionId?: string }) => {
	return useQuery(
		["fetch-resource-field", factionId],
		() => getFactionResourceFields(factionId ?? ""),
		{
			enabled: factionId !== undefined,
		},
	)
}
