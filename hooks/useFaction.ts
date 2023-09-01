import { useMutation, useQuery } from "@tanstack/react-query"
import {
	fetchFaction,
	postCompleteConstruction,
	postFactionStationClaim,
	postFactionStationStart,
} from "@/lib/apiClient"

export const useFaction = ({ factionId }: { factionId: string }) => {
	return useQuery(
		["fetch-faction", factionId],
		() => fetchFaction({ factionId }),
		{
			enabled: !!factionId,
		},
	)
}

export const useFactionStationStart = () => {
	return useMutation(["station-start"], postFactionStationStart)
}

export const useFactionStationClaim = () => {
	return useMutation(["station-claim"], postFactionStationClaim)
}

// Complete a station construction
export const useCompleteConstruction = () => {
	return useMutation(["station-complete"], postCompleteConstruction)
}
