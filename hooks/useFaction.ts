import { useMutation, useQuery } from "@tanstack/react-query"
import {
	getFaction,
	postFactionConstructionComplete,
	postFactionStationClaim,
	postFactionStationStart,
} from "@/lib/API"
import { Faction } from "@/types/server"

export const useFaction = ({ factionId }: { factionId: string }) => {
	return useQuery(["fetch-faction", factionId], () => getFaction(factionId), {
		enabled: !!factionId,
	})
}

export const useFactionStationStart = () => {
	return useMutation(["station-start"], postFactionStationStart)
}

export const useFactionStationClaim = () => {
	return useMutation<Faction, unknown, { mint: string; stationId: string }>(
		["station-claim"],
		({ mint, stationId }) => postFactionStationClaim(mint, stationId),
	)
}

// Complete a station construction
export const useCompleteConstruction = () => {
	return useMutation(["station-complete"], postFactionConstructionComplete)
}
