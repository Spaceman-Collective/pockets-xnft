import { fetchAssets } from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import { useWeb3Auth } from "./useWeb3Auth";

const account = "58Sz6sPcnbvTm7ChF8Zo4Sa6EDU7tbtDnFapuz2RQ1WP";

export const useAssets = () => {
  console.log("Account: ", account);
  return useQuery(
    ["assets"],
    () => fetchAssets({ walletAddress: account ?? "" }),
    { enabled: !!account }
  );
};
