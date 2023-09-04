import { useMutation } from "@tanstack/react-query"
import {
	postCharacterUnitsEquipConfirm,
	postCharacterUnitsDequip,
	postCharacterUnitsConsumeConfirm,
	postCharacterUnitsConsumeRequest,
	postCharacterUnitsEquipRequest,
} from "@/lib/API"

export const useUnitRequestEquip = () => {
	return useMutation(["unit-equip-request"], postCharacterUnitsEquipRequest)
}

export const useUnitConfirmEquip = () => {
	return useMutation(["unit-equip-confirm"], postCharacterUnitsEquipConfirm)
}

export const useUnitDequip = () => {
	return useMutation(["unit-dequip"], postCharacterUnitsDequip)
}

export const useUnitConsumeRequest = () => {
	return useMutation(["unit-consume-request"], postCharacterUnitsConsumeRequest)
}

export const useUnitConsumeConfirm = () => {
	return useMutation(["unit-consume-confirm"], postCharacterUnitsConsumeConfirm)
}
