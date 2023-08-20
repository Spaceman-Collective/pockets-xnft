import { fetchAllAssets } from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import { useSolana } from "./useSolana";

export const useAllWalletAssets = () => {
  const { walletAddress } = useSolana();

  return useQuery(
    ["wallet-assets", walletAddress],
    () => fetchAllAssets({ walletAddress: walletAddress ?? "" }),
    { enabled: walletAddress !== undefined },
  );
};
