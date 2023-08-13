import { fetchAssets } from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";

export const useAssets = () => {
  const account = "";
  return useQuery(
    ["assets"],
    () => fetchAssets({ walletAddress: account ?? "" }),
    { enabled: !!account }
  );
};
