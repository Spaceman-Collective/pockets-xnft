import { useMutation, useQuery } from "@tanstack/react-query"
import { getCharacterTimers, postCharacterTimersSpeedup } from "@/lib/API"

export const useCharTimers = ({ mint }: { mint?: string }) => {
	return useQuery(["char-timers", mint], () => getCharacterTimers(mint ?? ""), {
		enabled: mint !== undefined,
	})
}

export const useSpeedUpTimer = () => {
	return useMutation(["speed-up-timer"], postCharacterTimersSpeedup)
}
