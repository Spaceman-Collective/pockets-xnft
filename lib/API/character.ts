import { BattleHistory, Character, Faction, Unit } from "@/types/server"
import { apiRequest } from "."
import { Timers } from "@/types/client/Timers"

export const getCharacter = async (mint: string) => {
	return apiRequest<{ character?: Character; faction?: Faction }>(
		"get",
		"/character",
		{ mint },
	)
}

export const postCharacterCreate = async (signedTx: string) => {
	return apiRequest<Character>("post", "/character/create", { signedTx })
}

// TODO: Add the correct return type in the generic
export const postCharacterTimersSpeedup = async (signedTx: string) => {
	return apiRequest("post", "/character/timers/speedup", { signedTx })
}

export const getCharacterTimers = async (mint: string) => {
	return apiRequest<Timers>("get", "/character/timers", { mint })
}

export const postCharacterUnitsConsumeRequest = async (
	mint: string,
	unit: string,
) => {
	return apiRequest<{ encodedTx: string }>(
		"post",
		"/character/units/consume/request",
		{ mint, unit },
	)
}

export const postCharacterUnitsConsumeConfirm = async (signedTx: string) => {
	return apiRequest<Unit>("post", "/character/units/consume/confirm", {
		signedTx,
	})
}

export const postCharacterResourcesConsume = async (signedTx: string) => {
	return apiRequest<Character>("post", "/character/resources/consume", {
		signedTx,
	})
}

export const postCharacterUnitsEquipRequest = async (
	mint: string,
	unit: string,
	owner?: string,
) => {
	return apiRequest<{
		encodedTx: string
	}>("post", "/character/units/equip/request", {
		mint,
		unit,
		owner,
	})
}

export const postCharacterUnitsEquipConfirm = async (signedTx: string) => {
	return apiRequest<Character>("post", "/character/units/equip/confirm", {
		signedTx,
	})
}

export const postCharacterUnitsDequip = async (signedTx: string) => {
	return apiRequest<{ sig: string }>("post", "/character/units/dequip", {
		signedTx,
	})
}

export const postCharacterBattle = async (signedTx: string): Promise<any> => {
	return apiRequest("post", "/character/battle", { signedTx })
}

export const getCharacterBattleHistory = async (
	attacker: string,
	defenders: string[],
) => {
	return apiRequest<BattleHistory>("get", "/character/battle/history", {
		attacker,
		defenders,
	})
}
