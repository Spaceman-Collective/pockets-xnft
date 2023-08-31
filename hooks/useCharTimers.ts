import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchCharTimers, postSpeedUpWithBonk } from "@/lib/apiClient";

export const useCharTimers = ({ mint }: { mint?: string }) => {
  return useQuery(
    ["char-timers", mint],
    () => fetchCharTimers({ mint: mint ?? "" }),
    {
      enabled: mint !== undefined,
    },
  );
};

export const useSpeedUpTimer = () => {
  return useMutation(["speed-up-timer"], postSpeedUpWithBonk);
};
