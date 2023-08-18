import { useMutation } from "@tanstack/react-query";
import { harvestResourceField } from "@/lib/apiClient";

export const useHarvestResourceField = () => {
  return useMutation(["harvest-rf"], harvestResourceField);
}