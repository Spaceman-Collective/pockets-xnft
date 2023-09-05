import { useQuery, useMutation } from "@tanstack/react-query"
import {
	getResourceFieldAllocation,
	postResourceFieldAllocate,
	postResourceFieldHarvest,
} from "@/lib/API"

export const useRfAllocation = () => {
	return useQuery(["rf-allocation"], getResourceFieldAllocation)
}

export const useRfAllocate = () => {
	return useMutation(["rf-allocate"], postResourceFieldAllocate)
}

export const useRfHarvest = () => {
	return useMutation(["rf-harvest"], postResourceFieldHarvest)
}
