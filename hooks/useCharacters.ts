import { fetchCharacters } from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import { useSolana } from "./useSolana";

export const useAssets = () => {
  const { walletAddress } = useSolana();

  return useQuery(
    ["assets"],
    () => fetchCharacters({ walletAddress: walletAddress ?? "" }),
    { enabled: walletAddress !== undefined }
  );
};
