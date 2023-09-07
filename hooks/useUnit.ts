import { useMutation } from "@tanstack/react-query"
import {
	postCharacterUnitsEquipConfirm,
	postCharacterUnitsDequip,
	postCharacterUnitsConsumeConfirm,
	postCharacterUnitsConsumeRequest,
	postCharacterUnitsEquipRequest,
} from "@/lib/API"

export const useUnitRequestEquip = () => {
	return useMutation<
		{ encodedTx: string },
		unknown,
		{ mint: string; unit: string; owner?: string }
	>(["unit-equip-request"], ({ mint, unit, owner }) =>
		postCharacterUnitsEquipRequest(mint, unit, owner),
	)
}

export const useUnitConfirmEquip = () => {
	return useMutation(["unit-equip-confirm"], postCharacterUnitsEquipConfirm)
}

export const useUnitDequip = () => {
	return useMutation(["unit-dequip"], postCharacterUnitsDequip)
}

export const useUnitConsumeRequest = () => {
	return useMutation<
		{ encodedTx: string },
		unknown,
		{ mint: string; unit: string }
	>(["unit-consume-request"], ({ mint, unit }) =>
		postCharacterUnitsConsumeRequest(mint, unit),
	)
}

export const useUnitConsumeConfirm = () => {
	return useMutation(["unit-consume-confirm"], postCharacterUnitsConsumeConfirm)
}
