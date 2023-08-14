import { fetchAssets } from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import useLocalStorage from "use-local-storage";

export const useAssets = () => {
  const [account, setAccount] = useLocalStorage("account", "");

  return useQuery(
    ["assets"],
    () => fetchAssets({ walletAddress: account ?? "" }),
    { enabled: !!account }
  );
};
