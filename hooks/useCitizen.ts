import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { fetchCitizen } from "@/lib/apiClient";

export const useCitizen = (mint: string, options?: UseQueryOptions) => {
  return useQuery(["citizen", mint], () => fetchCitizen(mint), {
    enabled: mint !== undefined,
  });
};