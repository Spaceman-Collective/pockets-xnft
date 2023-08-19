import { useQuery } from "@tanstack/react-query";
import { fetchCharTimers } from "@/lib/apiClient";

export const useCharTimers = ({ mint }: { mint?: string }) => {
  return useQuery(
    ["char-timers", mint],
    () => fetchCharTimers({ mint: mint ?? "" }),
    {
      enabled: mint !== undefined,
    },
  );
};
