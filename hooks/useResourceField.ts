import { useQuery } from "@tanstack/react-query"
import { fetchResources } from "@/lib/apiClient"

export const useResourceField = ({ factionId }: { factionId?: string }) => {
	return useQuery(
		["fetch-resource-field", factionId],
		() => fetchResources({ factionId: factionId ?? "" }),
		{
			enabled: factionId !== undefined,
		},
	)
}
