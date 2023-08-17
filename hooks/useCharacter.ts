import { fetchCharacter } from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";

export const useCharacter = (mint: string) => {
  return useQuery(
    ["character", mint],
    () => fetchCharacter({ mint }),
    {
      enabled: mint !== undefined,
    }
  );
};
