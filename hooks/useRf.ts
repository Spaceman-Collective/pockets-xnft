import { useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchRfAllocation,
  postRfAllocate,
  postRfHarvest,
} from "@/lib/apiClient";

export const useRfAllocation = () => {
  return useQuery(["rf-allocation"], fetchRfAllocation);
};

export const useRfAllocate = () => {
  return useMutation(["rf-allocate"], postRfAllocate);
};

export const useRfHarvest = () => {
  return useMutation(["rf-harvest"], postRfHarvest);
};
