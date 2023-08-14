import { fetchAssets } from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import { useSolana } from "./useSolana";

export const useAssets = () => {
  const { account } = useSolana();
  console.log({ account });

  return useQuery(
    ["assets"],
    //@ts-ignore
    () => fetchAssets({ walletAddress: account?.toString() ?? "" }),
    { enabled: !!account }
  );
};
