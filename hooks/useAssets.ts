import { fetchAssets } from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import { useSolana } from "./useSolana";

export const useAssets = () => {
  const { account } = useSolana();

  return useQuery(
    ["assets"],
    () => fetchAssets({ walletAddress: account?.toString() ?? "" }),
    { enabled: !!account }
  );
};
