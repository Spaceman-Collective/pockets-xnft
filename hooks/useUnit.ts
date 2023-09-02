import { useMutation } from "@tanstack/react-query"
import {
	confirmEquipUnit,
	dequipUnit,
	postConsumeUnitConfirm,
	postConsumeUnitRequest,
	requestEquipUnit,
} from "@/lib/apiClient"

export const useUnitRequestEquip = () => {
	return useMutation(["unit-equip-request"], requestEquipUnit)
}

export const useUnitConfirmEquip = () => {
	return useMutation(["unit-equip-confirm"], confirmEquipUnit)
}

export const useUnitDequip = () => {
	return useMutation(["unit-dequip"], dequipUnit)
}

export const useUnitConsumeRequest = () => {
	return useMutation(["unit-consume-request"], postConsumeUnitRequest)
}

export const useUnitConsumeConfirm = () => {
	return useMutation(["unit-consume-confirm"], postConsumeUnitConfirm)
}
